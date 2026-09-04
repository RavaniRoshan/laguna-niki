import { useEffect } from 'react';

/**
 * BootLoader handles clean removal of the inline HTML boot loader after React paints.
 */
export default function BootLoader() {
  useEffect(() => {
    const el = document.getElementById('boot-loader');
    if (!el) return;

    // Fade out with 200ms opacity transition
    el.style.opacity = '0';
    const timer = setTimeout(() => {
      el.remove();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
