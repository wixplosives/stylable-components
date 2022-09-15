import React, { memo, useState } from 'react';
import type { ListItemProps } from '../list/list';
import type { ItemData } from './index';

export const ExpandableItemRenderer: React.FC<ListItemProps<ItemData>> = memo(function ExpandableItemRenderer(props) {
    const [isExpanded, setExpanded] = useState(true);
    return (
        <div
            data-id={props.id}
            style={{
                height: isExpanded ? '100px' : '12px',
                outline: '1px solid ',
            }}
        >
            <button onClick={() => setExpanded(!isExpanded)}>{isExpanded ? 'close' : 'open'}</button>
            {isExpanded && <div>{props.data.title}</div>}
        </div>
    );
});
