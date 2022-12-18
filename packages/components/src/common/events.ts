import type { EventHandler, SyntheticEvent } from 'react';

export const preventDefault: EventHandler<SyntheticEvent> = (e) => {
    e.preventDefault();
};
