import { useRef, useEffect, RefObject } from 'react';

/**
 * Custom hook to enable drag-to-scroll functionality on an element
 * @returns ref to attach to the scrollable element
 */
export const useDragToScroll = <T extends HTMLElement>(): RefObject<T> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let isDown = false;
        let startX: number;
        let scrollLeft: number;

        const handleMouseDown = (e: MouseEvent) => {
            // Only enable drag on the scrollable container, not on buttons/inputs
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('input') ||
                target.closest('a')
            ) {
                return;
            }

            isDown = true;
            element.classList.add('active');
            element.style.cursor = 'grabbing';
            // element.style.userSelect = 'none'; // Allow text selection
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
            element.classList.remove('active');
            element.style.cursor = 'grab';
            element.style.userSelect = '';
        };

        const handleMouseUp = () => {
            isDown = false;
            element.classList.remove('active');
            element.style.cursor = 'grab';
            element.style.userSelect = '';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            // e.preventDefault(); // Allow text selection logic to work
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            element.scrollLeft = scrollLeft - walk;
        };

        // Set initial cursor
        element.style.cursor = 'grab';

        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mouseleave', handleMouseLeave);
        element.addEventListener('mouseup', handleMouseUp);
        element.addEventListener('mousemove', handleMouseMove);

        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('mouseup', handleMouseUp);
            element.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return ref;
};
