import React, { useState } from 'react';
import { classes } from './icon-simulator.st.css';
import * as Icons from '..';
import { Area } from '../../area/area';
export const IconSimulator = () => {
    const [size, setSize] = useState('iconSmall');
    return (
        <div className={classes.root}>
            <button className={classes.toggle} onClick={() => setSize('iconSmall')}>
                Small
            </button>
            <button className={classes.toggle} onClick={() => setSize('iconMedium')}>
                Medium
            </button>
            <button className={classes.toggle} onClick={() => setSize('iconLarge')}>
                Large
            </button>
            <div className={classes.icons}>
                {Object.keys(Icons).map((iconName) => {
                    const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
                    if (!Icon) {
                        return null;
                    }
                    return (
                        <Area key={iconName} className={classes.floating}>
                            <Icon className={classes[size]} />
                            {iconName}
                        </Area>
                    );
                })}
            </div>
        </div>
    );
};
