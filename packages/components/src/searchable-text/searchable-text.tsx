import React, { createContext, useMemo, useContext } from 'react';
import { classes, style } from './searchable-text.st.css';

export const matchTextFuzzy = (searchString: string, inString: string): boolean => {
    while (searchString.length) {
        const char = searchString[0];
        searchString = searchString.slice(1);
        if (char?.toLowerCase() === inString[0]?.toLowerCase()) {
            inString = inString.slice(1);
            if (inString.length === 0) {
                return true;
            }
        }
    }
    return false;
};

export const splitFuzzySearchText = (
    text: string,
    searchString: string,
): Array<{ isHighlighted: boolean; text: string }> => {
    let remainingSearchString = searchString;
    let remainingInString = text;
    const sections: Array<{ isHighlighted: boolean; text: string }> = [];
    const add = (text: string, isHighlighted: boolean) => {
        if (sections.length === 0 || sections[sections.length - 1]?.isHighlighted !== isHighlighted) {
            sections.push({
                isHighlighted,
                text,
            });
        } else {
            sections[sections.length - 1]!.text += text;
        }
    };
    while (remainingSearchString.length && remainingInString.length) {
        const char = remainingSearchString[0];
        if (char?.toLowerCase() == remainingInString[0]?.toLowerCase()) {
            remainingSearchString = remainingSearchString.slice(1);
            add(remainingInString[0]!, true);
        } else {
            add(remainingInString[0]!, false);
        }
        remainingInString = remainingInString.slice(1);
    }
    add(remainingInString, false);
    return sections;
};

export const searchStringContext = createContext('');
export const searchMethodContext = createContext({
    match: matchTextFuzzy,
    split: splitFuzzySearchText,
});

export const SearchableText = (props: { text: string; className?: string }): React.ReactElement => {
    const searchString = useContext(searchStringContext);
    const { split } = useContext(searchMethodContext);
    const sections = useMemo(() => split(props.text, searchString), [props.text, searchString, split]);
    return (
        <div className={style(classes.root, props.className)}>
            {sections.map(({ text, isHighlighted }, idx) => {
                return (
                    <span key={idx} className={style(classes.textSpan, { isHighlighted })}>
                        {text}
                    </span>
                );
            })}
        </div>
    );
};
