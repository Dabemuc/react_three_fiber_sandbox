"use client";

import { LevaControlsProvider, useLevaControls } from "@/hooks/useLevaControls";
import { WaterSimulationControlsConfig } from "./types";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";

import waterVertexShader from "./shaders/waterVertex.glsl";
import waterFragmentShader from "./shaders/waterFragment.glsl";
export const WaterMaterial = shaderMaterial(
  {
    // Initial values
    uTime: 0,
    uAreaSize: 0,
    uMeshUp: new THREE.Vector3(0, 1, 0),
  },
  waterVertexShader,
  waterFragmentShader,
);
extend({ WaterMaterial });

const sceneControlsConfig: WaterSimulationControlsConfig = {
  AREA_SIZE: { value: 10, step: 1, min: 1 },
  AREA_RESOLUTION: { value: 10, step: 1, min: 1 },
  WIND_SPEED: { value: 5, step: 1, min: 0 },
  WIND_DIRECTION: {
    value: { x: 0, y: 0 },
    step: 0.03,
    max: 1,
    min: -1,
    joystick: "invertY",
  },
};

export default function WaterSimulationScene() {
  return (
    <LevaControlsProvider sceneControlsConfig={sceneControlsConfig}>
      <Simulation />
    </LevaControlsProvider>
  );
}

function Simulation() {
  return (
    <Canvas camera={{ position: [3, 8, 10] }}>
      <Perf position="top-left" />
      <OrbitControls />
      <Lighting />
      <Water />
    </Canvas>
  );

  function Water() {
    const { AREA_SIZE, AREA_RESOLUTION } = useLevaControls().SCENE_CONTROLS;
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<InstanceType<typeof WaterMaterial>>(null);

    const geometryArgs = useMemo(() => {
      console.log("Updating memmo");
      return {
        width: AREA_SIZE,
        height: AREA_SIZE,
        widthSegments: AREA_RESOLUTION,
        heightSegments: AREA_RESOLUTION,
      };
    }, [AREA_RESOLUTION, AREA_SIZE]);

    // Pass up direction to shader
    useEffect(() => {
      if (materialRef.current && meshRef.current) {
        const up = new THREE.Vector3(0, 1, 0);
        up.applyQuaternion(
          meshRef.current.getWorldQuaternion(new THREE.Quaternion()),
        );
        console.log("Passing up direction to shader:", up);
        materialRef.current.uniforms.uMeshUp.value.set(up.x, up.y, up.z);
      }
    }, []);

    // Update uTime uniform every frame
    useFrame(({ clock }) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      }
    });

    // Update other uniforms on change
    useEffect(() => {
      if (materialRef.current) {
        console.log("Updating material");
        materialRef.current.uniforms.uAreaSize.value = AREA_SIZE;
      }
    }, [AREA_SIZE]);

    const rotatedGeometry = useMemo(() => {
      const geom = new THREE.PlaneGeometry(
        geometryArgs.width,
        geometryArgs.height,
        geometryArgs.widthSegments,
        geometryArgs.heightSegments,
      );
      geom.rotateX(-Math.PI / 2); // <--- rotate once at creation
      return geom;
    }, [geometryArgs]);

    return (
      <mesh ref={meshRef}>
        <primitive object={rotatedGeometry} />
        <waterMaterial ref={materialRef} />
      </mesh>
    );
  }

  function Lighting() {
    return (
      <>
        <ambientLight intensity={0.3} />
        <directionalLight
          color={new THREE.Color(0xcfaa7a)}
          intensity={2}
          castShadow={true}
        />
      </>
    );
  }
}
