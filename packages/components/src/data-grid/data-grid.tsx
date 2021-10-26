import React, { createContext, useContext, useRef } from 'react';
import type { ListItemProps } from '..';
import { useElementDimension } from '../hooks/use-element-rect';
import { concatClasses, defaultRoot, defineElementSlot, mergeObjectInternalWins } from '../hooks/use-element-slot';
import { ScrollList, ScrollListProps, forwardScrollListRoot } from '../scroll-list/scroll-list';
import { classes, vars } from './data-grid.st.css';
export interface Column<T> {
    id: string;
    size: number;
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

export interface DataGridProps<T, EL extends HTMLElement = HTMLElement> extends ScrollListProps<T, EL> {
    columns: Column<T>[];
    gridRoot?: typeof gridRoot;
}

export type DataGrid<T, EL extends HTMLElement = HTMLElement> = React.ComponentType<DataGridProps<T, EL>>;
export function DataGrid<T, EL extends HTMLElement>({
    columns,
    scrollListRoot,
    isHorizontal,
    gridRoot,
    ...props
}: DataGridProps<T, EL>) {
    const headerRef = useRef<HTMLDivElement>(null);
    const scrollListRef = useRef<HTMLDivElement>(null);
    const headerSize = useElementDimension(headerRef, isHorizontal, true);
    return (
        <columnContext.Provider value={columns}>
            <GridRoot
                slot={gridRoot}
                props={{
                    className: classes.root,
                    style: {
                        [vars.columns!]: columns.map((col) => col.size + 'px').join(' '),
                    },
                }}
            >
                <div className={classes.header} ref={headerRef}>
                    {columns.map((col) => (
                        <div key={col.id} className={classes.headerCell}>
                            {col.header}
                        </div>
                    ))}
                </div>
                <ScrollList
                    {...props}
                    ItemRenderer={DataRow}
                    scrollListRoot={forwardScrollListRoot(scrollListRoot, {
                        style: {
                            height: `calc( 100% - ${headerSize}px)`,
                            overflowY: 'auto',
                        },
                        ref: scrollListRef,
                    })}
                    isHorizontal={isHorizontal}
                    scrollWindow={scrollListRef}
                    watchScrollWindoSize={true}
                />
            </GridRoot>
            <div
                style={{
                    [vars.columns!]: columns.map((col) => col.size + 'px').join(' '),
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

export const columnContext = createContext<Column<any>[]>([]);
function DataRow<T>({ id, ...props }: ListItemProps<T>) {
    const columns = useContext(columnContext);
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
