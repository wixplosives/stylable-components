import React, { useMemo } from 'react';
import type { ElementSlot, PropMapping } from '../common/types';
export const a = ()=><div></div>

export const createElementSlot = <MinimalProps, Mapping extends PropMapping<MinimalProps> = {}>(
  defaultSlot: ElementSlot<MinimalProps, any, any>,
  propsMapping: Mapping = {} as Mapping
) => {
  return (
    slot: ElementSlot<MinimalProps, any, any> | undefined,
    props: MinimalProps,
    children?: React.ReactChildren | React.ReactChild
  ) => {
    const usedSlot = slot || defaultSlot;

    const childrenArr = Array.isArray(children) ? children : [children];
    return useMemo(() => {
      return React.createElement(
        usedSlot.el,
        mergeWithMap(props, usedSlot.props as unknown as MinimalProps, propsMapping),
        ...childrenArr
      );
    }, [slot, props, children]);
  };
};

export const mergeObjectInternalWins = <T extends Record<string, unknown>>(internal: T, external: T) => ({
  ...external,
  ...internal,
});
export const mergeObjectExternalWins = <T extends Record<string, unknown>>(internal: T, external: T) => ({
  ...internal,
  ...external,
});
export const callExternal =
  <T extends (...args: unknown[]) => any>(_internal: T, external: T) =>
  (...args: unknown[]) =>
    external(...args);
export const callInternalFirst =
  <T extends (...args: any[]) => any>(internal?: T, external?: T) =>
  (...args: unknown[]) => {
    internal && internal(...args);
    return external && external(...args);
  };
export function mergeWithMap<Props, MinimalProps extends Partial<Props>>(
  props: Props,
  minProps: MinimalProps,
  mergeMap: PropMapping<MinimalProps>
) {
  return Object.entries(minProps).reduce(
    (acc, current) => {
      const [key, value] = current as [keyof MinimalProps, MinimalProps[keyof MinimalProps]];
      const policy = mergeMap[key];
      if (policy) {
        acc[key as keyof Props] = policy(
          value,
          acc[key as keyof Props] as unknown as MinimalProps[keyof MinimalProps]
        ) as unknown as Props[keyof Props];
      } else {
        acc[key as keyof Props] = value as unknown as Props[keyof Props];
      }
      return acc;
    },
    { ...props }
  );
}
