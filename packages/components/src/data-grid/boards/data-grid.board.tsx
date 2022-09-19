import { createBoard } from '@wixc3/react-board';
import React from 'react';
import type { ListItemProps } from '../../list/list';
import { DataGrid } from '../data-grid';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';

function cellRenderer<T>(key: keyof T) {
    const renderer = (props: ListItemProps<T>) => {
        return <div>{props.data[key] as unknown as React.ReactNode}</div>;
    };
    renderer.displayName = 'renderer ' + (key as string);
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

export default createBoard({
    name: 'Data Grid',
    Board: () => (
        <DataGrid
            columns={[
                {
                    cellRenderer: cellRenderer('firstName'),
                    header: <div>First name</div>,
                    id: 'fName',
                },
                {
                    cellRenderer: cellRenderer('lastName'),
                    header: <div>Last name</div>,
                    id: 'lastName',
                },
                {
                    cellRenderer: cellRenderer('age'),
                    header: <div>Age</div>,
                    id: 'age',
                },
            ]}
            columnSizesControl={() => [200, 200, 200]}
            items={createItems()}
            getId={(item) => item.id}
            gridRoot={{
                el: 'div',
                props: {
                    style: {
                        height: '100%',
                    },
                },
            }}
        />
    ),
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 461,
        canvasHeight: 400,
        windowHeight: 400,
    },
});
