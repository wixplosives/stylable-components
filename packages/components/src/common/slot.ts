import type React from 'react';
import type { OptionalFields } from './types';

/**
 * slots are used where we want a node type to be interchangeable in a component
 */
export interface ElementSlot<
    MinimalProps,
    El extends React.ComponentType<Props> | keyof React.ReactHTML = React.ComponentType<any> | keyof React.ReactHTML,
    Props extends MinimalProps = any
> {
    el: El;
    props: OptionalFields<Props, keyof MinimalProps>;
}
