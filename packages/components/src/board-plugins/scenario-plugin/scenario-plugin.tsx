import { createPlugin } from '@wixc3/board-core';
import type { IReactBoard } from '@wixc3/react-board';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { sleep, waitFor } from 'promise-assist';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { renderInPluginControls } from '../plugin-controls/plugin-controls.js';
import { classes, st } from './scenario-plugin.st.css';

export interface Action {
    execute: () => void | Promise<void>;
    title: string;
    highlightSelector?: string;
    timeout: number;
}

export interface ScenarioParams {
    title?: string;
    resetBoard?: () => void;
    events: Action[];
    slowMo?: number;
    skip?: boolean;
}

export interface ScenarioProps {
    title?: string;
    events: Action[];
    slowMo?: number;
    skip?: boolean;
    resetBoard: () => void;
}

export const ScenarioRenderer = (props: ScenarioProps) => {
    const { resetBoard, events: propEvents } = props;
    const [events, updateEvents] = useState(propEvents);
    const [btnText, updateButtonText] = useState(propEvents[0]?.title);
    const [autoRunning, triggerAutoRun] = useState(false);
    const [runningAction, setRunning] = useState(false);
    const highlight = useMemo(() => window.document.createElement('div'), []);
    const clearHighlight = useCallback(() => {
        highlight.removeAttribute('style');
        highlight.removeAttribute('class');
    }, [highlight]);
    const setHighlightedElement = useCallback(
        (selector?: string) => {
            if (!selector) {
                clearHighlight();
                return;
            }
            const target = actionTarget(selector);
            if (target && target instanceof Element) {
                const rect = target.getBoundingClientRect();
                highlight.setAttribute(
                    'style',
                    `position: absolute; top: ${rect.top}px; left: ${rect.left}px; height:${rect.height}px; width:${rect.width}px;`,
                );
                highlight.setAttribute('class', classes.item!);
            }
        },
        [clearHighlight, highlight],
    );
    const hoverAction = () => {
        const current = events[0];

        if (current?.highlightSelector) {
            setHighlightedElement(current.highlightSelector);
        } else {
            clearHighlight();
        }
    };

    const resetAll = useCallback(() => {
        resetBoard();
        updateButtonText(propEvents[0]!.title);
        updateEvents(propEvents);
    }, [propEvents, resetBoard]);

    const runAction = useCallback(() => {
        const current = events[0];
        if (current) {
            const onTaskFailed = (err: any) => {
                updateEvents(events.slice(1));
                if (err instanceof Error) {
                    updateButtonText('Error:' + err.message);
                } else {
                    updateButtonText('Error ');
                }
            };
            const onTaskDone = () => {
                const next = events[1];
                updateButtonText(next?.title || 'Done!');
                if (!next) {
                    triggerAutoRun(false);
                }
                updateEvents(events.slice(1));
            };

            try {
                const res = current.execute();
                if (res) {
                    updateButtonText('task in progress');
                    return res.then(onTaskDone).catch(onTaskFailed);
                } else {
                    return onTaskDone();
                }
            } catch (err) {
                return onTaskFailed(err);
            }
        } else {
            resetAll();
        }
        setHighlightedElement(events[1]?.highlightSelector);
    }, [events, setHighlightedElement, resetAll]);

    const runActions = useCallback(() => {
        triggerAutoRun(true);
    }, []);

    useEffect(() => {
        const run = async () => {
            await sleep(props.slowMo || 10);
            if (autoRunning && !runningAction) {
                setRunning(true);
                await runAction();
                setRunning(false);
            }
        };
        void run();
    }, [autoRunning, props.slowMo, runAction, runningAction]);
    return (
        <div className={classes.root}>
            <div className={st(classes.header, { skipped: props.skip })}>
                {props.title || 'unnamedScenario'}
                <button className={classes.reset} onClick={resetAll} disabled={events.length === 0}>
                    Restart
                </button>
                <button
                    className={classes.reset}
                    onClick={() => {
                        void runActions();
                    }}
                >
                    Run
                </button>
            </div>
            <div className={classes.content}>
                <div>{events.length > 0 ? `${events.length} events left to run` : ''}</div>
                <div className={classes.controls}>
                    <button
                        onClick={() => {
                            void runAction();
                        }}
                        onMouseLeave={clearHighlight}
                        onMouseMove={hoverAction}
                    >
                        {btnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const RenderWrapper = (props: ScenarioParams & { board: React.ReactElement }) => {
    const [boardKey, rerenderBoard] = useReducer((n: number) => n + 1, 0);

    const resetBoard = () => {
        rerenderBoard();
        props.resetBoard?.();
    };

    return renderInPluginControls(
        <React.Fragment key={boardKey}>{props.board}</React.Fragment>,
        <ScenarioRenderer
            skip={props.skip}
            title={props.title || 'untitled'}
            events={props.events}
            resetBoard={resetBoard}
        />,
        'scenario ' + props.title,
    );
};

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
            : (target as HTMLElement).scrollWidth - bounding.width,
    );
};

export const scrollAction = (pos: number, isVertical = true, selector?: string, timeout = 2_000): Action => {
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
            return waitFor(
                () => {
                    const currentPos = !target
                        ? 0
                        : target instanceof Window
                          ? isVertical
                              ? target.scrollY
                              : target.scrollX
                          : isVertical
                            ? target.scrollTop
                            : target.scrollLeft;
                    expect(Math.round(currentPos)).to.approximately(Math.round(usedPos), 2);
                },
                { timeout },
            );
        },
        timeout,
        highlightSelector: selector,
    };
};

export const focusAction = (selector: string) => {
    return {
        title: `focus ${selector}`,
        execute: () => {
            const target = document.querySelector(selector);
            if (!target) {
                throw new Error(`could not find ${selector}`);
            }
            if (!('focus' in target) || typeof target.focus !== 'function') {
                throw new Error('element is not focusable');
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            target.focus();
        },
        timeout: 1000,
    };
};

export const hoverAction = (selector?: string, timeout = 2_000): Action => {
    return {
        title: 'Hover ' + (selector || 'window'),
        execute: () => {
            const target = actionTarget(selector);
            if (target) {
                target.dispatchEvent(
                    new MouseEvent('mousemove', {
                        bubbles: true,
                        relatedTarget: target,
                    }),
                );
            }
        },
        highlightSelector: selector,
        timeout,
    };
};

export const clickAction = (selector?: string, timeout = 2_000, eventData: MouseEventInit = {}): Action => {
    return {
        title: 'Click ' + (selector || 'window'),
        execute: () => {
            const target = actionTarget(selector);
            if (target) {
                target.dispatchEvent(
                    new MouseEvent('mousedown', {
                        bubbles: true,
                        relatedTarget: target,
                        ...eventData,
                    }),
                );
                target.dispatchEvent(
                    new MouseEvent('click', {
                        bubbles: true,
                        relatedTarget: target,
                        ...eventData,
                    }),
                );
                target.dispatchEvent(
                    new MouseEvent('mouseup', {
                        bubbles: true,
                        relatedTarget: target,
                        ...eventData,
                    }),
                );
            }
        },
        highlightSelector: selector,
        timeout,
    };
};

export const keyDownAction = (selector: string, keyCode: string, eventData: KeyboardEventInit = {}) => {
    return {
        title: `key down ${keyCode}`,
        execute: () => {
            const target = window.document.querySelector(selector);
            if (!target) {
                throw new Error(`could not find ${selector}`);
            }
            target.dispatchEvent(
                new KeyboardEvent('keydown', {
                    code: keyCode,
                    key: keyCode,
                    bubbles: true,
                    composed: true,
                    ...eventData,
                }),
            );
        },
        timeout: 1000,
    };
};

export const writeAction = (selector: string, text: string, timeout = 2_000): Action => {
    const title = `Write in "${text}" + ${selector}`;
    return {
        title,
        execute: async () => {
            const el = await waitForElement(selector, title, timeout);
            if (el && el instanceof HTMLInputElement) {
                fireEvent.change(el, { target: { value: text } });
            }
        },
        highlightSelector: selector,
        timeout,
    };
};

export const waitForElement = async (selector: string, title: string, timeout = 1000) => {
    await waitFor(
        () => {
            const el = window.document.querySelector(selector);
            if (!el) {
                throw new Error(title + ': element not found for selector ' + selector);
            }
        },
        { timeout },
    );
    return window.document.querySelector(selector);
};

export const expectElement = <EL extends HTMLElement | SVGElement>(
    selector: string,
    expectation?: (el: EL) => void,
    title: string = 'expecting selector ' + selector,
    timeout = 2_000,
): Action => {
    return {
        title,
        async execute() {
            const startTime = Date.now();
            const innerExec = async (): Promise<void> => {
                const timePassed = Date.now() - startTime;
                const el = (await waitForElement(selector, title, timeout - timePassed)) as EL;

                if (expectation) {
                    try {
                        expectation(el);
                    } catch (err) {
                        if (timePassed > timeout) {
                            throw err;
                        }
                        await sleep(Math.min(timeout - timePassed, 10));
                        return innerExec();
                    }
                }
            };
            return innerExec();
        },
        timeout,
        highlightSelector: selector,
    };
};

export const expectElements = <SELECTORS extends string>(
    selectors: SELECTORS[],
    expectation?: (elements: Record<SELECTORS, Element>) => void,
    title: string = 'expecting elements ' + selectors.join(','),
    timeout = 2_000,
): Action => {
    return {
        title,
        timeout,
        async execute() {
            await waitFor(
                () => {
                    const res = selectors.reduce(
                        (acc, selector) => {
                            const el = window.document.querySelector(selector);
                            if (!el) {
                                throw new Error(title + ': element not found for selector ' + selector);
                            }
                            acc[selector] = el;
                            return acc;
                        },
                        {} as Record<SELECTORS, Element>,
                    );
                    if (expectation) {
                        expectation(res);
                    }
                },
                {
                    timeout,
                },
            );
        },
    };
};

export const expectElementText = (
    selector: string,
    text: string,
    title: string = 'expecting text ' + text + ' for selector ' + selector,
    timeout = 2_000,
): Action => {
    return {
        title,
        timeout,
        execute() {
            return expectElement(
                selector,
                (el) => {
                    if (!(el instanceof HTMLElement)) {
                        throw new Error(title + ': element at ' + selector + 'is not an HTMLElement');
                    }
                    expect(el.innerText).to.equal(text);
                },
                title,
                timeout,
            ).execute();
        },
        highlightSelector: selector,
    };
};

export const expectElementStyle = (
    selector: string,
    expectedStyle: Partial<Record<keyof CSSStyleDeclaration, string>>,
    title: string = 'expectElementStyle ' + selector,
    timeout = 2_000,
): Action => {
    const exp = expectElement(
        selector,
        (el) => {
            const style = window.getComputedStyle(el);
            for (const [key, val] of Object.entries(expectedStyle)) {
                expect(style[key as keyof CSSStyleDeclaration]).to.eql(val);
            }
        },
        title,
    );
    return {
        title,
        execute() {
            return exp.execute();
        },
        highlightSelector: selector,
        timeout,
    };
};

export const expectElementsStyle = (
    elements: {
        [selector: string]: Partial<Record<keyof CSSStyleDeclaration, string>>;
    },
    title?: string,
    timeout = 2_000,
): Action => {
    return {
        title: title || 'expectElementsStyle ' + Object.keys(elements).join(', '),
        execute() {
            for (const [selector, styles] of Object.entries(elements)) {
                const exp = expectElement(
                    selector,
                    (el) => {
                        const style = window.getComputedStyle(el);
                        for (const [key, val] of Object.entries(styles)) {
                            expect(style[key as keyof CSSStyleDeclaration]).to.eql(val);
                        }
                    },
                    title,
                );

                return exp.execute();
            }
        },
        timeout,
    };
};

export const expectElementScroll = (
    selector: string,
    expectedScroll: number,
    isHorizontal = false,
    title: string = 'expecting scroll ' + selector,
    timeout = 2_000,
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
        title,
        timeout,
    );
};

export const expectWindowScroll = (
    expectedScroll: number,
    isHorizontal = false,
    title = 'expecting window scroll ',
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
        timeout: 0,
    };
};

export const scenarioPlugin = createPlugin<IReactBoard>()(
    'scenario',
    {
        title: 'scenario',
        events: [],
        timeout: 2000,
        skip: false,
    } as Partial<ScenarioParams>,
    {
        wrapRender(props, _r, board) {
            return <RenderWrapper board={board} {...props} />;
        },
    },
);
