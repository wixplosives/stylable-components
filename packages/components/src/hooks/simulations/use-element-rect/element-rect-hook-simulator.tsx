import React from 'react';
import { useRef } from 'react';
import { useElementSize, WatchedSize, unMeasured, useElementDimension, useIdBasedRects } from '../../use-element-rect';
import { classes } from './element-rect-hook-simulator.st.css';
export const ElementSizeHookSimulator = ({
  watchSize = unMeasured,
  height,
  width,
}: {
  watchSize?: WatchedSize | boolean;
  width?: string;
  height?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const res = useElementSize(ref, watchSize);
  return (
    <div
      style={{
        height,
        width,
      }}
      className={classes.root}
    >
      <div ref={ref} style={{ width: '100%', height: '100%' }}>
        <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
          <div>width: ${res.width}</div>
          <div>height: ${res.height}</div>
        </div>
      </div>
    </div>
  );
};

export const ElmentDimHookSimulator = ({
  isVertical,
  watchSize,
  width,
  height,
}: {
  isVertical: boolean;
  watchSize: number | boolean;
  width?: string;
  height?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const res = useElementDimension(ref, isVertical, watchSize);
  return (
    <div
      style={{
        height,
        width,
      }}
    >
      <div ref={ref} style={{ width: '100%', height: '100%' }}>
        <div style={{ position: 'fixed', top: '50%', left: '50%' }}>{res}</div>
      </div>
    </div>
  );
};

export interface IdBasedRectsItem {
  id: string;
  skipRender?: true;
  style?: React.CSSProperties;
}
const getid = (item: IdBasedRectsItem) => item.id;
export const IdBasedRectsHookSimulator = ({
  watchSize,
  width,
  height,
  data,
}: {
  watchSize: WatchedSize | boolean;
  width?: string;
  height?: string;
  data: IdBasedRectsItem[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const res = useIdBasedRects(ref, data, getid, watchSize);
  return (
    <div
      style={{
        height,
        width,
      }}
    >
      <div ref={ref} style={{ width: '100%', height: '100%' }}>
        <pre style={{ position: 'fixed', top: '50%', left: '50%' }}>{JSON.stringify(res, null, 4)}</pre>
        {data.map((item) =>
          item.skipRender ? null : (
            <div key={item.id} data-id={item.id} style={item.style}>
              item {item.id}
            </div>
          )
        )}
      </div>
    </div>
  );
};
