import React, { useState } from 'react';
import { useRef } from 'react';
import { useElementSize, WatchedSize, unMeasured, useElementDimension, useIdBasedRects } from '../../use-element-rect';
export const ElementSizeHookSimulator: React.FC<{
    watchSize?: WatchedSize | boolean;
    width?: string;
    height?: string;
}> = ({ watchSize = unMeasured, height, width }) => {
    const ref = useRef<HTMLDivElement>(null);
    const res = useElementSize(ref, watchSize);
    return (
        <div
            style={{
                height,
                width,
            }}
        >
            <div ref={ref} style={{ width: '100%', height: '100%', background: 'red' }}>
                <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                    <div>width: ${res.width}</div>
                    <div>height: ${res.height}</div>
                </div>
            </div>
        </div>
    );
};

export const ElmentDimHookSimulator: React.FC<{
    isVertical: boolean;
    watchSize: number | boolean;
    width?: string;
    height?: string;
}> = ({ isVertical, watchSize, width, height }) => {
    const ref = useRef<HTMLDivElement>(null);
    const res = useElementDimension(ref, isVertical, watchSize);

    const [size, updateSize] = useState('100');
    const usedSize = isNaN(parseInt(size)) ? 100 : parseInt(size);

    return (
        <div
            style={{
                height,
                width,
            }}
        >
            <div>
                enter size
                <input value={size} onChange={(ev) => updateSize(ev.target.value)}></input>
            </div>
            <div ref={ref} style={{ width: '100%', height: usedSize + 'px', background: 'lightblue' }}>
                <div style={{ position: 'fixed', top: '50%', left: '50%' }}>{res}</div>
            </div>
        </div>
    );
};

const lorem = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
   Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
export interface IdBasedRectsItem {
    id: string;
    style?: React.CSSProperties;
    text: string;
}
const getid = (item: IdBasedRectsItem) => item.id;
const colors = ['red', 'blue'];
export const IdBasedRectsHookSimulator: React.FC<{
    watchSize: WatchedSize | boolean;
    width?: string;
    height?: string;
}> = ({ watchSize, width, height }) => {
    const [data, update] = useState<IdBasedRectsItem[]>([
        {
            id: 'a',
            text: lorem,
            style: {
                background: colors[1],
            },
        },
        {
            id: 'b',
            text: lorem,
            style: {
                background: colors[0],
            },
        },
    ]);
    const ref = useRef<HTMLDivElement>(null);
    const res = useIdBasedRects(ref, data, getid, watchSize);
    const updateItem = (idx: number, text: string) => {
        const newData = [...data];
        const newItem = { ...data[idx], text };
        newData[idx] = newItem as IdBasedRectsItem;
        update(newData);
    };
    return (
        <div
            style={{
                height,
                width,
            }}
        >
            <button
                onClick={() => {
                    const newData = [...data];
                    newData.unshift({
                        id: 'id' + Math.random(),
                        style: {
                            background: colors[newData.length % 2],
                        },
                        text: '',
                    });
                    update(newData);
                }}
            >
                add item
            </button>
            <div style={{ width: '100%', height: '100%' }}>
                <div ref={ref} style={{ width: '50%', height: '100%' }}>
                    {data.map((item, idx) => (
                        <p
                            key={item.id}
                            data-id={item.id}
                            style={item.style}
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: item.text }}
                            onChange={(ev) => {
                                updateItem(idx, ev.currentTarget.innerText);
                            }}
                        />
                    ))}
                </div>
                <pre style={{ position: 'fixed', top: '50%', left: '50%' }}>{JSON.stringify(res, null, 4)}</pre>
            </div>
        </div>
    );
};
