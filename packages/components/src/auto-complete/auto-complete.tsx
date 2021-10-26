import { Popover } from '@zeejs/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Area } from '../area/area';
import { classes, st } from './auto-complete.st.css';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { ScrollListProps, ScrollList } from '../scroll-list/scroll-list';
import { searchMethodContext, searchStringContext } from '../searchable-text/searchable-text';
import { createListRoot } from '../list/list';

export interface AutoCompleteProps<T, EL extends HTMLElement = HTMLDivElement> extends ScrollListProps<T, EL> {
    getTextContent: (item: T) => string;
    searchControl?: StateControls<string | undefined>;
}
export type AutoComplete<T, EL extends HTMLElement = HTMLDivElement> = (props: AutoCompleteProps<T, EL>) => JSX.Element;

const scrollListRoot = createListRoot(Area, {
    className: classes.scrollListRoot,
});

export function AutoComplete<T, EL extends HTMLElement = HTMLDivElement>(props: AutoCompleteProps<T, EL>): JSX.Element {
    const { searchControl, getTextContent, items, ...listProps } = props;
    const [searchText, updateSearchText] = useStateControls(searchControl);
    const { match } = useContext(searchMethodContext);
    const onTextChange = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            updateSearchText(ev.currentTarget.value);
        },
        [updateSearchText]
    );
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
    return (
        <div className={st(classes.root)} onClick={open}>
            <input
                value={searchText || ''}
                onChange={onTextChange}
                onFocus={open}
                onBlur={close}
                className={classes.input}
            ></input>
            <Popover show={isOpen} matchWidth className={classes.popover}>
                <searchStringContext.Provider value={searchText || ''}>
                    <ScrollList items={filteredData} {...listProps} scrollListRoot={scrollListRoot} />
                </searchStringContext.Provider>
            </Popover>
        </div>
    );
}
