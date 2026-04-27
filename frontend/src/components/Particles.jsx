import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const particles = [];

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      p.style.width = (Math.random() * 5 + 3) + 'px';
      p.style.height = p.style.width;
      p.style.animationDuration = (Math.random() * 6 + 4) + 's';
      p.style.animationDelay = (Math.random() * 4) + 's';
      p.style.opacity = Math.random() * 0.6 + 0.2;
      container.appendChild(p);
      particles.push(p);
    }

    return () => particles.forEach(p => p.remove());
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />;
}
