export type OptionalFields<T, F extends keyof T> = Omit<T, F> & Partial<Pick<T, F>>;

export type PropMapping<MinimalProps> = {
    [key in keyof MinimalProps]?: (
        internalProps: MinimalProps[key],
        externalProp: MinimalProps[key],
        name: key
    ) => MinimalProps[key];
};
