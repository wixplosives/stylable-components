import React, { useCallback } from 'react';
import { getElementWithId } from '../common';

export function useIdListener<EVType extends React.KeyboardEvent | React.MouseEvent>(
    idSetter: (id: string | undefined, ev: EVType, element?: Element) => void,
): (ev: EVType) => any {
    return useCallback(
        (ev: EVType) => {
            if (!ev.currentTarget || !ev.target) {
                return;
            }
            const res = getElementWithId(ev.target as Element, ev.currentTarget as unknown as Element);
            idSetter(res?.id || undefined, ev, res?.element);
        },
        [idSetter],
    );
}
