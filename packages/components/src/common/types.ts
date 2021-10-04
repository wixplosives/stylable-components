/**
 * slots are used where we want a node type to be interchangable in a component
 */

import type React from 'react';

export interface ElementSlot<
  MinimalProps,
  El extends React.ComponentType<Props> | keyof React.ReactHTML = React.ComponentType<any> | keyof React.ReactHTML,
  Props extends MinimalProps = any
> {
  el: El;
  props: OptionalFields<Props, keyof MinimalProps>;
}

export type OptionalFields<T, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;

export type MergeWithMap<T, MAP extends PropMapping<unknown>, F extends keyof T> = Omit<T, F> &
  Partial<Pick<T, Extract<F, keyof MAP>>>;

export type PropMapping<MinimalProps> = {
  [key in keyof MinimalProps]?: (internalProps: MinimalProps[key], extenalProp: MinimalProps[key]) => MinimalProps[key];
};

export const elementSlot = <MinimalProps, MAP extends PropMapping<MinimalProps>>() => {
  return <Props extends MinimalProps>(
    el: React.ComponentType<Props> | keyof React.ReactHTML,
    props: MergeWithMap<Props, MAP, keyof MinimalProps>
  ) => {
    return {
      el,
      props,
    } as ElementSlot<MinimalProps, React.ComponentType<Props> | keyof React.ReactHTML, Props>;
  };
};
