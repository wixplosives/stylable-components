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
  searchString: string
): Array<{ isHighlighted: boolean; text: string }> => {
  let remainingSearchString = searchString;
  let remaingingInString = text;
  const sections: Array<{ isHighlighted: boolean; text: string }> = [];
  const add = (text: string, isHighlighted: boolean) => {
    if (sections.length === 0 || sections[sections.length - 1]?.isHighlighted !== isHighlighted) {
      sections.push({
        isHighlighted,
        text,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sections[sections.length - 1]!.text += text;
    }
  };
  while (remainingSearchString.length && remaingingInString.length) {
    const char = remainingSearchString[0];
    if (char?.toLowerCase() == remaingingInString[0]?.toLowerCase()) {
      remainingSearchString = remainingSearchString.slice(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      add(remaingingInString[0]!, true);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      add(remaingingInString[0]!, false);
    }
    remaingingInString = remaingingInString.slice(1);
  }
  add(remaingingInString, false);
  return sections;
};

export const searchStringContext = createContext('');
export const searchMethodContext = createContext({
  match: matchTextFuzzy,
  split: splitFuzzySearchText,
});

export const SearchableText = (props: { text: string; className?: string }): JSX.Element => {
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
