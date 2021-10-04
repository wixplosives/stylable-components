import React, {
  useState,
  ReactPortal,
  useRef,
  useEffect,
  useMemo,
  useReducer,
  Reducer,
  ReducerWithoutAction,
  useContext,
  createRef
} from 'react';
import { createPortal } from 'react-dom';
import { vars } from './opener.st.css';
import {Layer,} from '@zeejs/react';



const Opener = ()=>{
  <Layer overlap="window" style={{

  }}>
    content
  </Layer>
}
/**
 * percents are 0-1 based;
 * default XYoffset is 0 for all
 */
export interface XYOffset {
  percentX: number;
  pixelX: number;
  percentY: number;
  pixelY: number;
}
export interface Offset {
  percent: number;
  pixel: number;
}

export const defaultXYOffset: XYOffset = {
  percentX: 0,
  percentY: 0,
  pixelX: 0,
  pixelY: 0,
};

export const defaultWidth: Offset = {
  percent: 100,
  pixel: 0,
};

export interface PositionParams {
  referenceElementAnchor?: XYOffset;
  portalElementAnchor?: XYOffset;
  /**
   * defaults to 100 percent of reference width
   */
  width?: Offset | 'auto';
  /**
   * defaults to auto
   */
  height?: Offset | 'auto';
  fitInScreen?: boolean;
  isFixed?: boolean;
}


const calcPosition = (params: PositionParams, referenceElement: HTMLElement, stageElement: HTMLElement) => {
  const referenceElementAnchor = params.referenceElementAnchor || defaultXYOffset;
  const portalElementAnchor = params.portalElementAnchor || defaultXYOffset;
  const width = params.width || defaultWidth;
  const height = params.height || 'auto';
  const fitInScreen = params.fitInScreen !== false;
  const isFixed = params.isFixed;
  const res: React.CSSProperties = {};
  const referenceBox = referenceElement.getBoundingClientRect();
  const stageBox = stageElement.getBoundingClientRect();
  if(width!=='auto'){
    res.width = `${referenceBox.width * width.percent + width.pixel}px`
    const wantedTop = referenceBox.top - stageBox.top + (referenceBox.width * referenceElementAnchor.percentY)
  }
  if(height!=='auto'){
    res.height = `${referenceBox.height * height.percent + height.pixel}px`
  }
  res.position = isFixed ? 'fixed' : 'absolute';

  const heightCalc = `var(${vars.referenceHeight}) * ${size.percentY} + ${size.pixelY}px`;
  res.top = `calc( var(${vars.referenceY}) + ${referenceElementAnchor.percentY} * var(${vars.referenceHeight}) + ${referenceElementAnchor.pixelY} - ${portalElementAnchor.pixelY} -  vars.referenceY * portalElementAnchor.percentY`; //`calc( var(${vars.referenceY}) * )`;
  res.width = `calc( ${widthCalc} )`;
  res.height = `calc( ${heightCalc} )`;
  return res;
};

export const portalContext = React.createContext<React.RefObject<HTMLElement>>(createRef());



export const usePortalChildren = (children: React.ReactChildren, context = portalContext) => {
  const element = useContext(context);
  const portal = useMemo(() => {
    if (element.current) {
      return createPortal(children, element.current);
    }
    return null;
  }, []);
  return portal;
};

// export interface OpenerProps {
//   /**
//    * @default dropdown
//    */
//   behavior?: 'tooltip' | 'dropdown';
//   children: React.ReactChildren;
//   portalChildren: React.ReactChildren;
// }

// export interface PortalContext {
//   setOverlay(key: symbol, children: React.ReactChildren): void;
//   clearOverlay(key: symbol): void;
// }
// export const portalContext = React.createContext<PortalContext>({
//   setOverlay() {
//     throw new Error('set the context using PortalRoot');
//   },
//   clearOverlay() {
//     throw new Error('set the context using PortalRoot');
//   },
// });

// export interface PortalRootProps {
//   children: React.ReactChildren;
// }

// const getIdMap = () => {
//   const idMap = new Map<symbol, string>();
//   let counter = 0;

//   return (symb: symbol) => {
//     const current = idMap.get(symb);
//     if (current) {
//       return current;
//     }
//     counter++;
//     const id = `id ${counter}`;
//     idMap.set(symb, id);
//     return id;
//   };
// };

// type OverlayItem = [symbol, string, React.ReactChildren];
// type remove = [symbol];
// type set = [symbol, React.ReactChildren];
// export const PortalRoot = () => {
//   const genId = useMemo(getIdMap, []);
//   const [openOverlay, setOpen] = useReducer<Reducer<Array<OverlayItem>, remove | set>, null>(
//     (value, action) => {
//       if (action.length === 1) {
//         return value.filter(([symbol]) => symbol !== action[0]);
//       }
//       const newOverlays = value;
//       const currentIdx = newOverlays.findIndex(([item]) => action[0] === item);
//       if (currentIdx !== -1) {
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         newOverlays[currentIdx]![2] = action[1];
//       } else {
//         newOverlays.push([action[0], genId(action[0]), action[1]]);
//       }
//       return newOverlays;
//     },
//     null,
//     () => []
//   );
//   const api = useMemo(() => {
//     const api: PortalContext = {
//       setOverlay(symb, children) {
//         setOpen([symb, children]);
//       },
//       clearOverlay(symb) {
//         setOpen([symb]);
//       },
//     };
//     return api;
//   }, []);
//   const overlayRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (overlayRef.current) {
//     }
//   }, [openOverlay]);
//   const portal = overlayRef.current ? createPortal(openOverlay.map(item=>item[2]),overlayRef.current) : null;
//   return (
//     <portalContext.Provider value={api}>
//       <div>
//         <div>{portal}</div>
//         <div ref={overlayRef}></div>
//       </div>
//     </portalContext.Provider>
//   );
// };

// export const Opener = (props: OpenerProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return isOpen ? (
//     props.children
//   ) : (
//     <>
//       {props.children}
//       <Portal></Portal>
//     </>
//   );
// };
