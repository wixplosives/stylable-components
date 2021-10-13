/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { ReactNode, ReactNodeArray, useMemo } from 'react';
import type { ElementSlot, PropMapping } from '../common/types';

// here bacause in issue with ts transformers in WCS
export const a = () => <div></div>;

export const defaultRoot: ElementSlot<{}, 'div'> = {
  el: 'div',
  props: {},
};
export const createElementSlot = <MinimalProps, Mapping extends PropMapping<MinimalProps> = {}>(
  defaultSlot: ElementSlot<MinimalProps, any, any>,
  propsMapping: Mapping = {} as Mapping
) => {
  return (
    slot: ElementSlot<MinimalProps, any, any> | undefined,
    props: MinimalProps,
    children?: ReactNodeArray | ReactNode
  ) => {
    const usedSlot = slot || defaultSlot;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const childrenArr = Array.isArray(children) ? children : [children];
    return useMemo(() => {
      return React.createElement(
        usedSlot.el,
        mergeWithMap(props, usedSlot.props as unknown as MinimalProps, propsMapping),
        ...childrenArr
      );
    }, [usedSlot.el, usedSlot.props, props, childrenArr]);
  };
};
export function useForwardElementSlot<
  MinimalProps,
  Slot extends ElementSlot<MinimalProps>,
  Mapping extends PropMapping<MinimalProps>
>(defaultSlot: Slot, slot?: Slot, props?: Partial<MinimalProps>, mergeMap?: Mapping): Slot {
  const usedSlot = slot || defaultSlot;
  return useMemo(() => {
    if (!props) {
      return usedSlot;
    }
    return {
      el: usedSlot.el,
      props: mergeWithMap(usedSlot.props, props as MinimalProps, mergeMap || {}),
    } as Slot;
  }, [usedSlot, props, mergeMap]);
}

export function mergeObjectInternalWins<T extends {} | undefined>(internal: T, external: T) {
  if (typeof internal === 'object') {
    if (typeof external === 'object') {
      return {
        ...(external),
        ...(internal),
      };
    }
    return internal;
  }
  return external;
}

export function mergeObjectExternalWins<T extends {} | undefined>(internal: T, external: T) {
  if (typeof external === 'object') {
    if (typeof internal === 'object') {
      return {
        ...(internal),
        ...(external),
      };
    }
    return external;
  }
  return internal;
}

export const callExternal =
  <T extends (...args: any[]) => unknown>(_internal: T, external: T) =>
  (...args: any[]) =>
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
