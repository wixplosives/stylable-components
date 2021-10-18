import React from 'react';
import { classes } from './icon-simulator.st.css';
import * as Icons from '../';
import { Area } from '../../area/area';
export const IconSimulator = () => {
    return (
        <div className={classes.root}>
            {Object.keys(Icons).map((iconName) => {
                const Icon = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
                if (!Icon) {
                    return null;
                }
                return (
                    <Area key={iconName} className={classes.floating}>
                        <Icon className={classes.iconSmall} />
                        {iconName}
                    </Area>
                );
            })}
        </div>
    );
};
