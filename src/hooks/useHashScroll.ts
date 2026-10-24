import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
export function useHashScroll() {
  const { hash, pathname, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname, key]);
}
