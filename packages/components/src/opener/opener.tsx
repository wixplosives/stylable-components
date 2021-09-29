import React, {
  useState,
  ReactPortal,
  useRef,
  useEffect,
  useMemo,
  useReducer,
  Reducer,
  ReducerWithoutAction,
} from 'react';
import { createPortal } from 'react-dom';
export interface OpenerProps {
  /**
   * @default dropdown
   */
  behavior?: 'tooltip' | 'dropdown';
  children: React.ReactChildren;
  portalChildren: React.ReactChildren;
}

export interface PortalContext {
  setOverlay(key: symbol, children: React.ReactChildren): void;
  clearOverlay(key: symbol): void;
}
export const portalContext = React.createContext<PortalContext>({
  setOverlay() {
    throw new Error('set the context using PortalRoot');
  },
  clearOverlay() {
    throw new Error('set the context using PortalRoot');
  },
});

export interface PortalRootProps {
  children: React.ReactChildren;
}

const getIdMap = () => {
  const idMap = new Map<symbol, string>();
  let counter = 0;

  return (symb: symbol) => {
    const current = idMap.get(symb);
    if (current) {
      return current;
    }
    counter++;
    const id = `id ${counter}`;
    idMap.set(symb, id);
    return id;
  };
};

type OverlayItem = [symbol, string, React.ReactChildren];
type remove = [symbol];
type set = [symbol, React.ReactChildren];
export const PortalRoot = () => {
  const genId = useMemo(getIdMap, []);
  const [openOverlay, setOpen] = useReducer<Reducer<Array<OverlayItem>, remove | set>, null>(
    (value, action) => {
      if (action.length === 1) {
        return value.filter(([symbol]) => symbol !== action[0]);
      }
      const newOverlays = value;
      const currentIdx = newOverlays.findIndex(([item]) => action[0] === item);
      if (currentIdx !== -1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        newOverlays[currentIdx]![2] = action[1];
      } else {
        newOverlays.push([action[0], genId(action[0]), action[1]]);
      }
      return newOverlays;
    },
    null,
    () => []
  );
  const api = useMemo(() => {
    const api: PortalContext = {
      setOverlay(symb, children) {
        setOpen([symb, children]);
      },
      clearOverlay(symb) {
        setOpen([symb]);
      },
    };
    return api;
  }, []);
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (overlayRef.current) {
    }
  }, [openOverlay]);
  const portal = overlayRef.current ? createPortal(openOverlay.map(item=>item[2]),overlayRef.current) : null;
  return (
    <portalContext.Provider value={api}>
      <div>
        <div>{portal}</div>
        <div ref={overlayRef}></div>
      </div>
    </portalContext.Provider>
  );
};

export const Opener = (props: OpenerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return isOpen ? (
    props.children
  ) : (
    <>
      {props.children}
      <Portal></Portal>
    </>
  );
};
