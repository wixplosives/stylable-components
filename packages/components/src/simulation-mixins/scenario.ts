import { createPlugin } from '@wixc3/simulation-core';
import type { IReactSimulation } from '@wixc3/react-simulation';
import { classes } from './scenario.st.css';
import { getMixinControls } from './mixin-controls';
import { expect } from 'chai';
import { waitFor } from 'promise-assist';
export interface Action {
    execute: () => void | Promise<void>;
    title: string;
    highlightSelector?: string;
}

export interface ScenarioProps {
    title: string;
    events: Action[];
    timeout?: number;
    skip: boolean;
}

export const scenarioMixin = createPlugin<IReactSimulation>()(
    'scenario',
    {
        title: 'scenario',
        events: [] as Action[],
        timeout: 2000,
        skip: false,
    },
    {
        beforeRender(props) {
            const canvas = getMixinControls();
            const existing = canvas.querySelector('#scenario-mixin-button');
            if (!existing) {
                let modifiable = [...props.events];
                const btn = window.document.createElement('button');
                btn.setAttribute('class', classes.root);
                btn.setAttribute('id', 'scenario-mixin-button');
                btn.addEventListener('click', () => {
                    const current = modifiable.shift();
                    if (current) {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        current.execute();
                        const next = modifiable[0];
                        btn.innerText = next?.title || 'Done!';
                    } else {
                        btn.innerText = props.events[0]!.title;
                        modifiable = [...props.events];
                    }
                    setHighlightedElement(modifiable[0]?.highlightSelector);
                });
                btn.addEventListener('mousemove', () => {
                    const current = modifiable[0];

                    if (current?.highlightSelector) {
                        setHighlightedElement(current.highlightSelector);
                    } else {
                        clearHighlight();
                    }
                });
                const clearHighlight = () => {
                    highlight.removeAttribute('style');
                    highlight.removeAttribute('class');
                };
                const setHighlightedElement = (selector?: string) => {
                    if (!selector) {
                        clearHighlight();
                        return;
                    }
                    const target = actionTarget(selector);
                    if (target && target instanceof Element) {
                        const rect = target.getBoundingClientRect();
                        highlight.setAttribute(
                            'style',
                            `position: absolute; top: ${rect.top}px; left: ${rect.left}px; height:${rect.height}px; width:${rect.width}px;`
                        );
                        highlight.setAttribute('class', classes.item!);
                    }
                };
                btn.addEventListener('mouseout', clearHighlight);
                btn.innerText = props.skip ? 'skipped ' + props.events[0]!.title : props.events[0]!.title;
                const highlight = window.document.createElement('div');
                canvas.appendChild(btn);
                document.body.appendChild(highlight);
            }
        },
    }
);

const actionTarget = (selector?: string) => {
    if (selector) {
        return window.document.querySelector(selector);
    }
    return window;
};

export const maxScroll = (target: Element | Window, isVertical: boolean) => {
    if (target === window) {
        target = window.document.body;
    }
    const bounding = (target as HTMLElement).getBoundingClientRect();
    return Math.floor(
        isVertical
            ? (target as HTMLElement).scrollHeight - bounding.height
            : (target as HTMLElement).scrollWidth - bounding.width
    );
};

export const scrollAction = (pos: number, isVertical = true, selector?: string): Action => {
    return {
        title:
            'Scroll ' + (selector || 'window') + ' to ' + (pos === -1 ? (isVertical ? 'bottom' : 'right-most') : pos),
        execute: async () => {
            const target = actionTarget(selector);
            const usedPos = target && pos === -1 ? maxScroll(target, isVertical) : pos;
            if (target) {
                if (isVertical) {
                    target.scrollTo({
                        top: usedPos,
                        behavior: 'smooth',
                    });
                } else {
                    target.scrollTo({
                        left: usedPos,
                        behavior: 'smooth',
                    });
                }
            }
            return waitFor(() => {
                const currentPos = !target
                    ? 0
                    : target instanceof Window
                    ? isVertical
                        ? target.scrollY
                        : target.scrollX
                    : isVertical
                    ? target.scrollTop
                    : target.scrollLeft;
                expect(Math.round(currentPos)).to.eql(Math.round(usedPos));
            });
        },
        highlightSelector: selector,
    };
};

export const hoverAction = (selector?: string): Action => {
    return {
        title: 'Hover ' + (selector || 'window'),
        execute: () => {
            const target = actionTarget(selector);
            if (target) {
                target.dispatchEvent(
                    new MouseEvent('mousemove', {
                        bubbles: true,
                        relatedTarget: target,
                    })
                );
            }
        },
        highlightSelector: selector,
    };
};

export const clickAction = (selector?: string): Action => {
    return {
        title: 'Click ' + (selector || 'window'),
        execute: () => {
            const target = actionTarget(selector);
            if (target) {
                target.dispatchEvent(
                    new MouseEvent('mousedown', {
                        bubbles: true,
                        relatedTarget: target,
                    })
                );
                target.dispatchEvent(
                    new MouseEvent('click', {
                        bubbles: true,
                        relatedTarget: target,
                    })
                );
                target.dispatchEvent(
                    new MouseEvent('mouseup', {
                        bubbles: true,
                        relatedTarget: target,
                    })
                );
            }
        },
        highlightSelector: selector,
    };
};

export const expectElement = <EL extends Element>(
    selector: string,
    expectation?: (el: EL) => void,
    title: string = 'expecting selector ' + selector
): Action => {
    return {
        title,
        execute() {
            const el = window.document.querySelector(selector) as EL;
            if (!el) {
                throw new Error(title + ': element not found for selector ' + selector);
            }
            if (expectation) {
                expectation(el);
            }
        },
        highlightSelector: selector,
    };
};

export const expectElements = <SELECTORS extends string>(
    selectors: SELECTORS[],
    expectation?: (elements: Record<SELECTORS, Element>) => void,
    title: string = 'expecting elements ' + selectors
): Action => {
    return {
        title,
        execute() {
            const res = selectors.reduce((acc, selector) => {
                const el = window.document.querySelector(selector);
                if (!el) {
                    throw new Error(title + ': element not found for selector ' + selector);
                }
                acc[selector] = el;
                return acc;
            }, {} as Record<SELECTORS, Element>);
            if (expectation) {
                expectation(res);
            }
        },
    };
};

export const expectElementText = <EL extends Element>(
    selector: string,
    text: string,
    title: string = 'expecting text ' + text + ' for selector ' + selector
): Action => {
    return {
        title,
        execute() {
            const el = window.document.querySelector(selector) as EL;
            if (!el || !(el instanceof HTMLElement)) {
                throw new Error(title + ': element not found for selector ' + selector);
            }
            expect(el.innerText).to.equal(text);
        },
        highlightSelector: selector,
    };
};

export const expectElementStyle = <EL extends Element>(
    selector: string,
    expectedStyle: Partial<Record<keyof CSSStyleDeclaration, string>>,
    title: string = 'expectElementStyle ' + selector
): Action => {
    const exp = expectElement<EL>(
        selector,
        (el) => {
            const style = window.getComputedStyle(el);
            for (const [key, val] of Object.entries(expectedStyle)) {
                expect(style[key as keyof CSSStyleDeclaration]).to.eql(val);
            }
        },
        title
    );
    return {
        title,
        execute() {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            exp.execute();
        },
        highlightSelector: selector,
    };
};

export const expectElementsStyle = (
    elements: {
        [selector: string]: Partial<Record<keyof CSSStyleDeclaration, string>>;
    },
    title?: string
): Action => {
    return {
        title: title || 'expectElementsStyle ' + Object.keys(elements),
        execute() {
            for (const [selector, styles] of Object.entries(elements)) {
                expectElementStyle(selector, styles);
            }
        },
    };
};

export const expectElementScroll = (
    selector: string,
    expectedScroll: number,
    isHorizontal = false,
    title: string = 'expecting scroll ' + selector
): Action => {
    return expectElement(
        selector,
        (el) => {
            if (isHorizontal) {
                expect(el.scrollLeft).to.eql(expectedScroll);
            } else {
                expect(el.scrollTop).to.eql(expectedScroll);
            }
        },
        title
    );
};

export const expectWindowScroll = (
    expectedScroll: number,
    isHorizontal = false,
    title = 'expecting window scroll '
): Action => {
    return {
        title,
        execute: () => {
            if (isHorizontal) {
                expect(window.scrollX).to.eql(expectedScroll);
            } else {
                expect(window.scrollY).to.eql(expectedScroll);
            }
        },
    };
};
