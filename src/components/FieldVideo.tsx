'use client';
import DeferredVideo from './DeferredVideo';

export default function FieldVideo({ src, label }: { src: string; label: string }) {
    return (
        <DeferredVideo
            controls playsInline preload="none"
            poster={src.replace(/\.mp4$/i, '.webp')}
            aria-label={label}
            className="w-full aspect-[9/16] max-h-[540px] object-contain bg-black"
            pauseOthersOnPlay
        >
            <source src={src} type="video/mp4" />
            Your browser does not support video. <a href={src}>Open video</a>.
        </DeferredVideo>
    );
}
