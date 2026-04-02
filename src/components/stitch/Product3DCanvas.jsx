'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { Bounds, Environment, OrbitControls } from '@react-three/drei';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ url }) {
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
  });

  return <primitive object={gltf.scene.clone()} />;
}

function Scene({ modelUrl, resetSignal, isMobile }) {
  const controlsRef = useRef(null);
  const { camera, invalidate } = useThree();

  useEffect(() => {
    camera.position.set(isMobile ? 2.2 : 2.8, isMobile ? 1.6 : 2.1, isMobile ? 2.2 : 2.8);
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, isMobile]);

  useEffect(() => {
    if (!controlsRef.current) {
      return;
    }

    controlsRef.current.reset();
    invalidate();
  }, [invalidate, resetSignal]);

  return (
    <>
      <ambientLight intensity={isMobile ? 1.35 : 1.15} />
      <directionalLight position={[4, 6, 5]} intensity={isMobile ? 1.1 : 1.35} />
      {!isMobile ? <Environment preset="apartment" /> : null}
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.15}>
          <group position={[0, -0.1, 0]}>
            <Model url={modelUrl} />
          </group>
        </Bounds>
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        makeDefault
        minDistance={1.2}
        maxDistance={10}
        zoomSpeed={0.9}
        panSpeed={0.9}
        rotateSpeed={0.9}
      />
    </>
  );
}

export default function Product3DCanvas({ modelUrl, resetSignal }) {
  const [isMobile, setIsMobile] = useState(false);
  const dpr = useMemo(() => (isMobile ? [1, 1.5] : [1, 2]), [isMobile]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return (
    <Canvas dpr={dpr} camera={{ position: [2.8, 2.1, 2.8], fov: isMobile ? 42 : 36 }}>
      <Scene modelUrl={modelUrl} resetSignal={resetSignal} isMobile={isMobile} />
    </Canvas>
  );
}
