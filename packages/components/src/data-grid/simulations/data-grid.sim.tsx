import { createSimulation } from '@wixc3/react-simulation';
import React from 'react';
import type { ListItemProps } from '../..';
import { DataGrid } from '../data-grid';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';

function cellRenderer<T, K extends keyof T>(key: K) {
    const renderer = (props: ListItemProps<T>) => {
        return <div>{props.data[key]}</div>;
    };
    renderer.displayName = 'renderer ' + key;
    return renderer;
}

interface GridItem {
    firstName: string;
    lastName: string;
    age: number;
    id: string;
}

const fNames = ['Shlomo', 'shraga', 'benny', 'zolthar'];
const lNames = ['ben shvili', 'hasarot', 'the destroyer', 'levi'];
function randomFromArr<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}
const createItems = (count = 1000, from = 0) => {
    return new Array<string>(count).fill('').map(
        (_, idx) =>
            ({
                age: Math.ceil(Math.random() * 120),
                firstName: randomFromArr(fNames),
                lastName: randomFromArr(lNames),
                id: 'a' + (idx + from),
            } as GridItem)
    );
};

export default createSimulation<DataGrid<GridItem>>({
    componentType: DataGrid,
    name: 'Data Grid',
    props: {
        columns: [
            {
                cellRenderer: cellRenderer<GridItem, 'firstName'>('firstName'),
                header: <div>FIrst name</div>,
                id: 'fName',
                size: 200,
            },
            {
                cellRenderer: cellRenderer<GridItem, 'lastName'>('lastName'),
                header: <div>Last name</div>,
                id: 'lastName',
                size: 200,
            },
            {
                cellRenderer: cellRenderer<GridItem, 'age'>('age'),
                header: <div>Age</div>,
                id: 'age',
                size: 200,
            },
        ],
        items: createItems(),
        getId: (item) => item.id,
        gridRoot: {
            el: 'div',
            props: {
                style: {
                    height: '100%',
                },
            },
        },
    },
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 461,
        canvasHeight: 400,
        windowHeight: 400,
    },
});
