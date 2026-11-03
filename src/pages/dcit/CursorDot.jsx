import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './CursorDot.module.css';

// Things the dot should grow around
const HOT = 'a, button, [data-hot]';

/**
 * A blue dot that follows the mouse.
 *
 *   <CursorDot />                    follows the cursor over the whole page
 *   <CursorDot targetRef={someRef} /> only while the cursor is over that element
 *
 * It does nothing on touch screens.
 */
export default function CursorDot({ targetRef }) {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return undefined;

    // Only for devices with a real mouse
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const host = targetRef?.current || document;
    const leaveHost = host === document ? document.documentElement : host;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    let seen = false;

    const draw = () => {
      raf = 0;
      const k = smooth ? 0.22 : 1; // lower = softer trailing
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (!seen) {
        // First move: appear exactly under the cursor instead of flying in
        pos.x = target.x;
        pos.y = target.y;
        seen = true;
      }
      dot.dataset.show = 'true';
      dot.dataset.hot = e.target instanceof Element && e.target.closest(HOT) ? 'true' : 'false';
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onLeave = () => {
      dot.dataset.show = 'false';
      dot.dataset.down = 'false';
      seen = false;
    };
    const onDown = () => { dot.dataset.down = 'true'; };
    const onUp = () => { dot.dataset.down = 'false'; };

    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    leaveHost.addEventListener('pointerleave', onLeave);

    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      leaveHost.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetRef]);

  // Portal to <body> so no parent (overflow, transform) can clip or offset it
  return createPortal(
    <div
      ref={dotRef}
      className={styles.cursor}
      data-show="false"
      data-hot="false"
      data-down="false"
      aria-hidden="true"
    >
      <span className={styles.dot} />
    </div>,
    document.body,
  );
}