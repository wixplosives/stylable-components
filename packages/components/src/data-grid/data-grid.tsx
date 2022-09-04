import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import type { ListItemProps } from '../list/list';
import { concatClasses, defaultRoot, defineElementSlot, mergeObjectInternalWins } from '../hooks/use-element-slot';
import { useScroll } from '../hooks/use-scroll';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { ScrollList, ScrollListProps, forwardScrollListRoot } from '../scroll-list/scroll-list';
import { classes, vars } from './data-grid.st.css';
export interface Column<T> {
    id: string;
    header: JSX.Element;
    cellRenderer: React.ComponentType<ListItemProps<T>>;
}

export interface GridRootMinimalProps {
    className?: string;
    style: React.CSSProperties;
    children: React.ReactNode[];
}
export const GridRootPropMapping = {
    className: concatClasses,
    style: mergeObjectInternalWins,
};
export const {
    slot: gridRoot,
    create: createGridRoot,
    forward: forwardGridRoot,
    parentSlot: gridRootParent,
    Slot: GridRoot,
} = defineElementSlot<GridRootMinimalProps>(defaultRoot, GridRootPropMapping);

export type DataGridProps<T, EL extends HTMLElement = HTMLElement> = {
    columns: Column<T>[];
    columnSizesControl?: StateControls<number[]>;
    gridRoot?: typeof gridRoot;
} & Omit<ScrollListProps<T, EL>, 'ItemRenderer'>;

export type DataGrid<T, EL extends HTMLElement = HTMLElement> = React.ComponentType<DataGridProps<T, EL>>;
export function DataGrid<T, EL extends HTMLElement>({
    columns,
    scrollListRoot,
    isHorizontal,
    gridRoot,
    columnSizesControl,
    ...props
}: DataGridProps<T, EL>) {
    const headerRef = useRef<HTMLDivElement>(null);
    const scrollListRef = useRef<HTMLDivElement>(null);
    // const headerSize = useElementDimension(headerRef, isHorizontal, true);
    const [columnSizes, updateColumnSizes] = useStateControls(columnSizesControl, []);
    const listHorizontalScroll = useScroll({ isHorizontal: true, ref: scrollListRef });
    const listeners = useRef(new Set<{ cb: (ev: MouseEvent) => void; eventName: keyof WindowEventMap }>());
    const contextValue = useMemo(
        () => ({
            columns,
            sizes: columnSizes,
        }),
        [columnSizes, columns]
    );

    const resizers = useMemo(
        () =>
            columns.map((_col, idx) => (ev: React.MouseEvent<HTMLElement>) => {
                const resizer = ev.currentTarget;
                const listener = (ev: MouseEvent) => {
                    const left = resizer.parentElement!.getBoundingClientRect().left;
                    const newSizes = [...columnSizes];
                    newSizes.splice(idx, 1, ev.pageX - left);
                    updateColumnSizes(newSizes);
                };
                const endListener = (_ev: MouseEvent) => {
                    window.removeEventListener('mousemove', listener);
                    window.removeEventListener('mouseup', endListener);
                };
                listeners.current.add({ cb: listener, eventName: 'mousemove' });
                listeners.current.add({ cb: endListener, eventName: 'mouseup' });
                window.addEventListener('mousemove', listener);
                window.addEventListener('mouseup', endListener);
            }),
        [columns, columnSizes, updateColumnSizes]
    );
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const listen = [...listeners.current];
            for (const { eventName, cb } of listen) {
                window.removeEventListener(eventName, cb as () => void);
            }
        };
    }, []);
    return (
        <columnContext.Provider value={contextValue}>
            <GridRoot
                slot={gridRoot}
                props={{
                    className: classes.root,
                    style: {
                        [vars.columns!]: columnSizes.map((col) => col + 'px').join(' '),
                    },
                }}
            >
                <div className={classes.header} ref={headerRef}>
                    <div
                        className={classes.internalHeader}
                        style={{
                            left: -listHorizontalScroll + 'px',
                        }}
                    >
                        {columns.map((col, idx) => (
                            <div key={col.id} className={classes.headerCell}>
                                {col.header}
                                <div className={classes.resizer} onMouseDown={resizers[idx]} />
                            </div>
                        ))}
                    </div>
                </div>
                <ScrollList
                    {...props}
                    ItemRenderer={DataRow}
                    scrollListRoot={forwardScrollListRoot(scrollListRoot, {
                        style: {
                            height: `100%`,
                            overflowY: 'auto',
                        },
                        ref: scrollListRef,
                    })}
                    isHorizontal={isHorizontal}
                    scrollWindow={scrollListRef}
                    watchScrollWindowSize={true}
                    // initialScrollOffset={headerSize}
                />
            </GridRoot>
            <div
                style={{
                    [vars.columns!]: columnSizes.map((col) => col + 'px').join(' '),
                }}
                className={classes.root}
            ></div>
        </columnContext.Provider>
    );
}

export interface DataRowProps<T> extends ListItemProps<T> {
    index: number;
    columns: Column<T>[];
}

export const columnContext = createContext<{ columns: Column<any>[]; sizes: number[] }>({
    columns: [],
    sizes: [],
});
function DataRow<T>({ id, ...props }: ListItemProps<T>) {
    const { columns } = useContext(columnContext);
    return (
        <div data-id={id} className={classes.row}>
            {columns.map((col) => (
                <div key={col.id} className={classes.cell}>
                    <col.cellRenderer id={id} {...props} />
                </div>
            ))}
        </div>
    );
}
