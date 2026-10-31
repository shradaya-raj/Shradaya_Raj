'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';

// Posters fetch even with preload="none". Attach them only near the viewport.
export default function DeferredVideo({ poster, pauseOthersOnPlay = false, onPlay, ...props }: ComponentProps<'video'> & { pauseOthersOnPlay?: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [nearViewport, setNearViewport] = useState(false);

    useEffect(() => {
        const element = videoRef.current;
        if (!element) return;
        if (!('IntersectionObserver' in window)) {
            setNearViewport(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setNearViewport(true);
            observer.disconnect();
        }, { rootMargin: '300px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return <video {...props} ref={videoRef} poster={nearViewport ? poster : undefined} onPlay={event => {
        if (pauseOthersOnPlay) {
            const current = event.currentTarget;
            current.ownerDocument.querySelectorAll('video').forEach(video => {
                if (video !== current && !video.paused) video.pause();
            });
        }
        onPlay?.(event);
    }} />;
}
