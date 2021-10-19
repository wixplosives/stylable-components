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

export function childrenById(parent: Element): Record<string, Element> {
    const children: Element[] = [];
    for (let i = 0; i < parent.children.length; i++) {
        children.push(parent.children.item(i)!);
    }
    const res: Record<string, Element> = {};
    children.forEach((el) => {
        const id = el.getAttribute('data-id');
        if (id) {
            res[id] = el;
        }
    });
    return res;
}
