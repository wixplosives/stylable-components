// Library: wix-ui-icons-common
// Demo: https://wix-wix-ui-icons-common.surge.sh/
// Source: https://github.com/wix/wix-ui/tree/master/packages/wix-ui-icons-common/

import React, { FC, memo } from 'react';

const createIcon = (viewBox: string, svgChildren: React.ReactChild) => {
    const Icon: FC<React.SVGProps<SVGSVGElement>> = memo((props) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox={viewBox} {...props}>
            {svgChildren}
        </svg>
    ));
    Icon.displayName = 'Icon';
    return Icon;
};

export const createNormalWixUiIcon = createIcon.bind(null, '0 0 24 24');
export const createSmallWixUiIcon = createIcon.bind(null, '0 0 18 18');
