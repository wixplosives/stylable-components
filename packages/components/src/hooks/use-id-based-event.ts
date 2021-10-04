import React, { useCallback } from 'react';

export function getElementWithId(node: Element, scope: Element): { id: string; element: Element } | null {
  let current: Element | null = node;
  while (current && current !== scope) {
    const id = current.getAttribute('data-id');
    if (id) {
      return { id, element: current };
    }
    current = current.parentElement;
  }
  return null;
}

export function useIdListener<EVType extends React.KeyboardEvent | React.MouseEvent>(
  idSetter: (id: string | undefined, element?: Element) => void
): (ev: EVType) => any {
  return useCallback(
    (ev: EVType) => {
      if (!ev.currentTarget || !ev.target) {
        return;
      }
      const res = getElementWithId(ev.target as Element, ev.currentTarget as unknown as Element);
      idSetter(res?.id || undefined, res?.element);
    },
    [idSetter]
  );
}
