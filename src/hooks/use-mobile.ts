
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set the initial value
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [breakpoint]);

  return isMobile;
}
