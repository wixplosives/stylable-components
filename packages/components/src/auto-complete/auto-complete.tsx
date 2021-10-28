import { Popover } from '@zeejs/react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Area } from '../area/area';
import { classes, st } from './auto-complete.st.css';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { ScrollListProps, ScrollList } from '../scroll-list/scroll-list';
import { searchMethodContext, searchStringContext } from '../searchable-text/searchable-text';
import { createListRoot } from '../list/list';
import { InputWithClear } from '../input-with-clear/input-with-clear';
import { KeyCodes } from '../keycodes';
import { useTransmittedCB } from '../hooks/use-transmitted-events';

export interface AutoCompleteProps<T, EL extends HTMLElement = HTMLDivElement> extends ScrollListProps<T, EL> {
    getTextContent: (item: T) => string;
    searchControl?: StateControls<string | undefined>;
}
export type AutoComplete<T, EL extends HTMLElement = HTMLDivElement> = (props: AutoCompleteProps<T, EL>) => JSX.Element;

export function AutoComplete<T, EL extends HTMLElement = HTMLDivElement>(props: AutoCompleteProps<T, EL>): JSX.Element {
    const { searchControl, getTextContent, items, focusControl, selectionControl, getId, ...listProps } = props;
    const [focused, setFocused] = useStateControls(focusControl);
    const [selected, setSelected] = useStateControls(selectionControl);

    const scrollListRef = useRef<HTMLDivElement>(null);
    const [searchText, updateSearchText] = useStateControls(searchControl);
    const { match } = useContext(searchMethodContext);

    const { cb: onKeyPress, useTransmit } = useTransmittedCB<React.KeyboardEventHandler>();
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => {
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);
    const filteredData = useMemo(() => {
        if (!searchText) {
            return items;
        }
        return items.reduce((acc, item) => {
            const content = getTextContent(item);
            if (match(content, searchText)) {
                acc.push(item);
            }
            return acc;
        }, [] as T[]);
    }, [getTextContent, items, match, searchText]);

    const onListSelect = useCallback(
        (selectedId?: string) => {
            const item = items.find((item) => getId(item) === selectedId);
            updateSearchText(item ? getTextContent(item) : '');
            setSelected(selectedId);
            close();
        },
        [close, getId, getTextContent, items, setSelected, updateSearchText]
    );
    const scrollListRoot = createListRoot(Area, {
        className: classes.scrollListRoot,
        ref: scrollListRef,
        style: {
            height: '100%',
        },
    });
    const onKeyDown = useCallback(
        (ev: React.KeyboardEvent<HTMLInputElement>) => {
            if (ev.code === KeyCodes.Escape) {
                close();
            } else if (ev.code !== KeyCodes.Tab) {
                open();
                onKeyPress(ev);
            }
        },
        [close, onKeyPress, open]
    );
    useEffect(() => {
        if (filteredData[0]) {
            setFocused(getId(filteredData[0]));
        }
    }, [filteredData, getId, setFocused]);
    return (
        <div className={st(classes.root)} onClick={open}>
            <InputWithClear
                valueControl={[searchText || '', updateSearchText]}
                onFocus={open}
                className={classes.input}
                onKeyDown={onKeyDown}
            />

            <Popover show={isOpen} matchWidth className={classes.popover} avoidAnchor onClickOutside={close}>
                <searchStringContext.Provider value={searchText || ''}>
                    <ScrollList
                        items={filteredData}
                        {...listProps}
                        scrollListRoot={scrollListRoot}
                        focusControl={[focused, setFocused]}
                        selectionControl={[selected, onListSelect]}
                        getId={getId}
                        transmitKeyPress={useTransmit}
                        scrollWindow={scrollListRef}
                    />
                </searchStringContext.Provider>
            </Popover>
        </div>
    );
}
