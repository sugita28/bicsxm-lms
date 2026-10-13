import { useEffect, useRef, useState } from 'react';

function CountUp({ end, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // slows down at the end
          setValue(Math.round(end * eased));
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export default CountUp;