'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

const Product3DCanvas = dynamic(() => import('./Product3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      Loading 3D preview...
    </div>
  ),
});

function supportsWebGL() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

export default function Product3DViewer({
  modelUrl,
  posterImage,
  alt,
  className = '',
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  const fallbackImage = useMemo(() => posterImage || null, [posterImage]);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden rounded-[2rem] bg-[#EFE7DA] ${className}`}>
      {!webglReady ? (
        <>
          {fallbackImage ? (
            <Image
              src={fallbackImage.url}
              alt={fallbackImage.altText || alt}
              fill
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-sm text-gray-700 shadow-sm">
            3D preview not supported on this device
          </div>
        </>
      ) : isVisible ? (
        <>
          <Product3DCanvas modelUrl={modelUrl} resetSignal={resetSignal} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/15 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
              3D
            </span>
            <button
              type="button"
              onClick={() => setResetSignal((current) => current + 1)}
              className="pointer-events-auto rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm transition-colors hover:bg-white"
            >
              Reset View
            </button>
          </div>
          <div className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs text-gray-600 shadow-sm">
            Drag to rotate, pinch or scroll to zoom
          </div>
        </>
      ) : (
        <>
          {fallbackImage ? (
            <Image
              src={fallbackImage.url}
              alt={fallbackImage.altText || alt}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              Preparing 3D preview...
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/8">
            <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-sm">
              Loading 3D
            </div>
          </div>
        </>
      )}
    </div>
  );
}
