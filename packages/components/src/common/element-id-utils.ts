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
