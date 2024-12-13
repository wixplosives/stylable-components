import React, { useContext } from 'react';
import { ChevronRightWixUiIcon, ComponentIcon } from '../../../icons/index.js';
import { SearchableText } from '../../../searchable-text/searchable-text.js';
import type { TreeItemInfo, TreeItemProps } from '../../../tree/index.js';
import { st, classes, vars } from '../../tree-items/lanes/element-item-renderer.st.css';
import { lanesContext } from '../../tree-items/lanes/lane-context.js';

export interface ElementData<TREEITEMS> {
    kind: 'element';
    tagName: string;
    id: string;
    children?: TREEITEMS[];
}

export function ElementRenderer<TREEITEMS>(props: TreeItemProps<ElementData<TREEITEMS>>) {
    const laneCtx = useContext(lanesContext);
    const indent = laneCtx.getIndent(props.data as ElementData<any>);
    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
                open: props.isOpen,
            })}
            style={
                {
                    [vars.indent!]: indent.toString(),
                } as React.CSSProperties
            }
            data-id={props.id}
        >
            {props.hasChildren ? (
                <ChevronRightWixUiIcon
                    className={classes.chevron}
                    onClick={() => {
                        if (props.isOpen) {
                            props.close();
                        } else {
                            props.open();
                        }
                    }}
                ></ChevronRightWixUiIcon>
            ) : (
                <div className={classes.chevron}></div>
            )}

            {props.data.tagName[0] === props.data.tagName[0]?.toLowerCase() ? (
                <div className={classes.icon}>
                    <div className={classes.elementIcon} />
                </div>
            ) : (
                <ComponentIcon className={classes.icon} />
            )}
            <SearchableText className={classes.text} text={props.data.tagName} />
        </div>
    );
}
export const calcElementSize = function <TREEITEMS>(_item: TreeItemInfo<ElementData<TREEITEMS>>) {
    return 16;
};
