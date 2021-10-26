/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useMemo } from 'react';
import type { ElementSlot, PropMapping } from '../common/types';

// here bacause in issue with ts transformers in WCS
export const a = (): JSX.Element => <div></div>;

export const defaultRoot: ElementSlot<React.ComponentPropsWithRef<'div'>, 'div'> = {
    el: 'div',
    props: {},
};

export const defineElementSlot = <MinimalProps, Mapping extends PropMapping<MinimalProps> = {}>(
    defaultSlot: ElementSlot<MinimalProps, any, any>,
    propsMapping: Mapping = {} as Mapping
) => {
    return {
        use: (slot: Partial<ElementSlot<MinimalProps, any, any>> | undefined, props: MinimalProps): JSX.Element => {
            const usedSlot = { ...defaultSlot, ...(slot || {}) };

            // eslint-disable-next-line react-hooks/exhaustive-deps
            return useMemo(() => {
                return React.createElement(
                    usedSlot.el,
                    mergeWithMap(props, usedSlot.props as unknown as MinimalProps, propsMapping)
                );
            }, [usedSlot.el, usedSlot.props, props]);
        },
        forward: (
            slot: Partial<ElementSlot<MinimalProps, any, any> | undefined>,
            props: MinimalProps
        ): ElementSlot<MinimalProps, any, any> => {
            const usedSlot = { ...defaultSlot, ...(slot || {}) };
            // eslint-disable-next-line react-hooks/exhaustive-deps
            return useMemo(() => {
                return {
                    el: usedSlot.el,
                    props: mergeWithMap(usedSlot.props, props, propsMapping) as any,
                };
            }, [usedSlot.el, usedSlot.props, props]);
        },
        slot: defaultSlot as Partial<typeof defaultSlot>,
        parentSlot: function <MinProps extends MinimalProps, MAP extends PropMapping<MinProps> = PropMapping<MinProps>>(
            defSlot?: ElementSlot<MinProps, any, any>,
            propsMapping: PropMapping<MinProps> = {}
        ) {
            const usedSlot = defSlot || defaultSlot;
            return defineElementSlot<MinProps, MAP>(usedSlot as ElementSlot<MinProps, any, any>, propsMapping as MAP);
        },
        create: function <Props extends MinimalProps>(
            el: React.ComponentType<Props> | keyof React.ReactHTML,
            props: Partial<Props>
        ): ElementSlot<MinimalProps, React.ComponentType<Props> | keyof React.ReactHTML, Props> {
            return {
                el,
                props: props as any,
            };
        },
    };
};

export function preferExternal<T extends {} | undefined>(internal: T, external: T): T {
    if (typeof external === 'undefined') {
        return internal;
    }
    return external;
}
export function mergeObjectInternalWins<T extends {} | undefined>(internal: T, external: T): T {
    if (typeof internal === 'object') {
        if (typeof external === 'object') {
            return {
                ...external,
                ...internal,
            };
        }
        return internal;
    }
    return external;
}

export function mergeObjectExternalWins<T extends {} | undefined>(internal: T, external: T): T {
    if (typeof external === 'object') {
        if (typeof internal === 'object') {
            return {
                ...internal,
                ...external,
            };
        }
        return external;
    }
    return internal;
}

export const callExternal =
    <T extends (...args: any[]) => unknown>(_internal: T, external: T) =>
    (...args: any[]): unknown =>
        external(...args);
export const callInternalFirst =
    <T extends (...args: any[]) => any>(internal?: T, external?: T) =>
    (...args: unknown[]): unknown => {
        internal && internal(...args);
        return external && external(...args);
    };

export const concatClasses = <T extends string>(internal?: T, external?: T) => `${internal || ''} ${external || ''}`;
export function mergeWithMap<Props, MinimalProps extends Partial<Props>>(
    props: Props,
    minProps: MinimalProps,
    mergeMap: PropMapping<MinimalProps>
): Props {
    return Object.entries(props).reduce(
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
        { ...minProps } as unknown as Props
    );
}
