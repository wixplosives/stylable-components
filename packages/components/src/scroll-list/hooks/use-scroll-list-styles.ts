import React, { useMemo } from 'react';

export const useScrollListStyles = ({
    isHorizontal,
    firstWantedPixel,
}: {
    isHorizontal: boolean;
    firstWantedPixel: number;
}) => {
    const wrapperStyle = useMemo(
        () =>
            ({
                position: 'relative', // non-static position so that overlay can be positioned absolutely in relation to it
            } as React.CSSProperties),
        []
    );

    const listStyle = useMemo(
        () =>
            ({
                position: 'absolute',
                top: isHorizontal ? 0 : `${firstWantedPixel}px`,
                left: isHorizontal ? `${firstWantedPixel}px` : 0,
            } as React.CSSProperties),
        [firstWantedPixel, isHorizontal]
    );

    const overlayStyle = useMemo(
        () =>
            ({
                ...listStyle,
                width: '100%',
                height: '100%',
            } as React.CSSProperties),
        [listStyle]
    );

    return {
        wrapperStyle,
        listStyle,
        overlayStyle,
    };
};
