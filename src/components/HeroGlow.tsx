'use client';

import { useEffect, useRef } from 'react';

// Move a small, fixed gradient layer without rerendering the page on every pointer event.
export default function HeroGlow() {
  const glow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const allowed = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event: PointerEvent) => {
      if (!allowed.matches || !glow.current?.parentElement) return;
      const bounds = glow.current.parentElement.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      x = event.clientX - bounds.left - 240;
      y = event.clientY - bounds.top - 240;
      if (!frame) frame = requestAnimationFrame(() => {
        if (glow.current) glow.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = 0;
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);
  return <div ref={glow} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[480px] w-[480px] rounded-full motion-reduce:hidden" style={{ background: 'radial-gradient(circle, rgba(59,130,246,.22), transparent 70%)', willChange: 'transform' }} />;
}
