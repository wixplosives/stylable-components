import React, { memo } from 'react';

// Clockwise variant of 'refresh' icon from wix-ui.

export const RefreshCw = memo(function RefreshCW(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 19C15.866 19 19 15.866 19 12H18C18 15.3137 15.3137 18 12 18C9.77915 18 7.84012 16.7934 6.80269 15H10V14H5V19H6V15.6076C7.2249 17.6404 9.45367 19 12 19ZM14 9V10H19V5H18V8.39241C16.7751 6.35958 14.5463 5 12 5C8.13401 5 5 8.13401 5 12H6C6 8.68629 8.68629 6 12 6C14.2208 6 16.1599 7.2066 17.1973 9H14Z" />
        </svg>
    );
});
