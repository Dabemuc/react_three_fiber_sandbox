"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { loadGrassTuft } from "./GrassTuft";

// Global settings
const grassTuftScale = 0.15;
const grassTuftRandomScaleVariance = 0.08;
const grassTuftRandomRotationVariance = Math.PI; // Full Rotation allowed
const grassTuftCount = 8000;
const grassAreaSize = 10;

export default function GrassScene() {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    async function fetchGeometry() {
      const loadedGeometry = await loadGrassTuft();
      setGeometry(loadedGeometry ?? null);
    }
    fetchGeometry();
  }, []);

  if (!geometry) {
    return <div>Loading...</div>; // Show a fallback while loading
  }

  return (
    <Canvas camera={{ position: [3, 8, 10] }}>
      <Perf position="top-left" />
      <OrbitControls />
      <Lighting />
      <Ground />
      <Grass grassGeometry={geometry} />
    </Canvas>
  );
}

const Grass = ({ grassGeometry }: { grassGeometry: THREE.BufferGeometry }) => {
  const instancedLeafsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  useEffect(() => {
    if (instancedLeafsRef.current) {
      for (let i = 0; i < grassTuftCount; i++) {
        //Set position
        dummy.position.set(
          Math.random() * grassAreaSize - grassAreaSize / 2,
          0,
          Math.random() * grassAreaSize - grassAreaSize / 2,
        );
        // Set scale
        const computedScale =
          grassTuftScale +
          (Math.random() * 2 - 1) * grassTuftRandomScaleVariance;
        dummy.scale.set(computedScale, computedScale, computedScale);
        // Set rotation
        const computedRotation =
          Math.random() * grassTuftRandomRotationVariance -
          grassTuftRandomRotationVariance / 2;
        dummy.rotation.set(0, computedRotation, 0);
        // Apply to instance
        dummy.updateMatrix();
        instancedLeafsRef.current.setMatrixAt(i, dummy.matrix);
      }
      instancedLeafsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [grassGeometry]);

  return (
    <instancedMesh
      ref={instancedLeafsRef}
      args={[grassGeometry, undefined, grassTuftCount]}
    >
      <meshPhongMaterial color={0x90f090} side={THREE.DoubleSide} />
    </instancedMesh>
  );
};

const Ground = () => {
  return (
    <mesh
      scale={new THREE.Vector3(grassAreaSize, grassAreaSize, 0)}
      rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
      receiveShadow={true}
      position={new THREE.Vector3(0, 0, 0)}
    >
      <planeGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};

const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        color={new THREE.Color(0xcfaa7a)}
        intensity={10}
        castShadow={true}
      />
    </>
  );
};
