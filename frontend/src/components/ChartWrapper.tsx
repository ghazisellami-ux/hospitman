'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ChartWrapperProps {
  height: number;
  children: (width: number, height: number) => React.ReactNode;
}

/**
 * A replacement for Recharts ResponsiveContainer that reliably measures
 * parent width using ResizeObserver. This avoids the known issue where
 * ResponsiveContainer renders 0-width charts in certain SSR/hydration scenarios.
 */
export default function ChartWrapper({ height, children }: ChartWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial measurement
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth(w);
    };
    measure();

    // Watch for resize
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);

    // Fallback: retry after a short delay in case layout isn't done
    const timer = setTimeout(measure, 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height }}>
      {width > 0 ? children(width, height) : (
        <div style={{ 
          width: '100%', height, display: 'flex', alignItems: 'center', 
          justifyContent: 'center', color: '#5c6478', fontSize: 14 
        }}>
          Chargement...
        </div>
      )}
    </div>
  );
}
