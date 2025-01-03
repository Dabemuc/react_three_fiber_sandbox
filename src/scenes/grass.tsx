"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Perf } from "r3f-perf";

export default function Grass() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <Perf />
      <ambientLight intensity={0.5} />
      <directionalLight />
      <mesh scale={new THREE.Vector3(10, 10, 0)}>
        <planeGeometry />
        <meshStandardMaterial />
      </mesh>
      <mesh position={new THREE.Vector3(0, 0, 0)}>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
      <mesh position={new THREE.Vector3(2, 2, 0)}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
}
