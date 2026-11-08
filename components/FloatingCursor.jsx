'use client';

import { useEffect, useRef, useState } from 'react';

export default function FloatingCursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !matchMedia('(pointer:fine)').matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add('visible');

      const target = e.target;
      const isClickable = !!target.closest('a, button, input, select, textarea, [role="button"], [role="tab"]');
      el.classList.toggle('hovering', isClickable);

      // Contextual label detection
      const productCard = target.closest('.product-image, .quickview-main-image');
      const hotspot = target.closest('.hotspot-trigger');
      const swatch = target.closest('.product-swatches button');

      if (hotspot) {
        setLabel('EXPLORE');
        el.classList.add('has-label');
      } else if (productCard) {
        setLabel('VIEW');
        el.classList.add('has-label');
      } else if (swatch) {
        setLabel('COLOR');
        el.classList.add('has-label');
      } else {
        setLabel('');
        el.classList.remove('has-label');
      }
    };

    const animate = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };

    const hide = () => el.classList.remove('visible');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor-dot" />
      {label && <span className="cursor-label">{label}</span>}
    </div>
  );
}
