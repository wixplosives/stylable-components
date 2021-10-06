import { createPlugin } from '@wixc3/simulation-core';
import type { IReactSimulation } from '@wixc3/react-simulation';
import { classes } from './scenario.st.css';
export interface Action {
  execute: () => void | Promise<void>;
  title: string;
}

export const scenarioMixin = createPlugin<IReactSimulation>()(
  'scenario',
  {
    events: [] as Action[],
  },
  {
    beforeRender(props) {
      const existing = window.document.querySelector('#scenario-mixin-button');
      if (!existing) {
        let modifiable = [...props.events];
        const btn = window.document.createElement('button');
        btn.setAttribute('class', classes.root);
        btn.setAttribute('id', 'scenario-mixin-button');
        btn.addEventListener('click', () => {
          const current = modifiable.shift();
          if (current) {
            current.execute();
            const next = modifiable[0];
            btn.innerText = next?.title || 'Done!';
          } else {
            btn.innerText = props.events[0]!.title;
            modifiable = [...props.events];
          }
        });
        btn.innerText = props.events[0]!.title;
        document.body.appendChild(btn);
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

const targetScroll = (target: Element | Window, isVertical: boolean) => {
  if (target === window) {
    target = window.document.body;
  }
  return isVertical ? (target as HTMLElement).scrollHeight : (target as HTMLElement).scrollWidth;
};

export const scrollAction = (pos: number, isVertical = true, selector?: string): Action => {
  return {
    title: 'Scroll ' + (selector || 'window') + ' to ' + (pos === -1 ? (isVertical ? 'bottom' : 'right-most') : pos),
    execute: () => {
      const target = actionTarget(selector);
      if (target) {
        const usedPos = pos === -1 ? targetScroll(target, isVertical) : pos;
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
    },
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
  };
};
