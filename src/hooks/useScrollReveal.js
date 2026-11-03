import { useEffect } from 'react';

// Adds/removes "is-visible" on every [data-reveal] element as it enters/leaves the screen
export default function useScrollReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');

    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.target.classList.toggle('is-visible', e.isIntersecting));
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}