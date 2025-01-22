"use-client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Perf } from "r3f-perf";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { folder, useControls } from "leva";
import { bezier } from "@leva-ui/plugin-bezier";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

// Import shader files
import grassVertexShader from "./shaders/grassVertex.glsl";
import grassFragmentShader from "./shaders/grassFragment.glsl";

type SceneControlls = {
  AREA_SIZE: number;
  LEAVES_COUNT: number;
  SEED: number;
  LEAF_COLOR: string;
  LEAF_BEZIERE: {
    0: number;
    1: number;
    2: number;
    3: number;
    cssEasing: string;
    evaluate: (x: number) => number;
  };
  LEAF_THICKNESS: number;
  LEAF_HEIGT: number;
  LEAF_SEGMENT_COUNT: number;
  LEAF_MAX_RANDOM_ROTATION: number;
};

let controlls: SceneControlls;

export default function GhostOfTsushimaScene() {
  controlls = useControls({
    Global: folder(
      {
        AREA_SIZE: { value: 10, min: 1, max: 100 },
        LEAVES_COUNT: { value: 10000, min: 1, max: 1000000 },
        SEED: 123,
      },
      { order: 0, collapsed: true },
    ),
    Leaf: folder(
      {
        LEAF_COLOR: "#9f9",
        LEAF_BEZIERE: bezier([0.04, 0.17, 0.25, 1.0]),
        LEAF_THICKNESS: { value: 0.1, min: 0.01, step: 0.02 },
        LEAF_HEIGT: { value: 1, min: 0.01, step: 0.05 },
        LEAF_SEGMENT_COUNT: { value: 6, min: 1, step: 1 },
        LEAF_MAX_RANDOM_ROTATION: {
          value: 0.3,
          min: 0,
          max: Math.PI,
          step: 0.01,
        },
      },
      { order: 1, collapsed: true },
    ),
  });

  useEffect(() => {
    console.log(controlls);
  }, [controlls]);

  return (
    <Canvas camera={{ position: [3, 8, 10] }}>
      <Perf position="top-left" />
      <OrbitControls />
      <Lighting />
      <Ground />
      <Grass />
    </Canvas>
  );
}

const Grass = () => {
  const instancedLeavesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();

  const leafGeo = buildLeaveGeo();

  // Update geometry if needed
  useEffect(() => {
    if (instancedLeavesRef.current) {
      const gridSize = Math.ceil(Math.sqrt(controlls.LEAVES_COUNT)); // Number of rows/columns
      const spacing = controlls.AREA_SIZE / gridSize; // Spacing between blades

      for (let i = 0; i < controlls.LEAVES_COUNT; i++) {
        /* POSITION */
        // Calculate leafs position in grid
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Calculate center position of the tile
        const x = col * spacing + spacing / 2 - controlls.AREA_SIZE / 2;
        const z = row * spacing + spacing / 2 - controlls.AREA_SIZE / 2;

        // Add random positional offset
        const randomOffsetX = (Math.random() - 0.5) * spacing;
        const randomOffsetZ = (Math.random() - 0.5) * spacing;

        // Set position
        dummy.position.set(x + randomOffsetX, 0, z + randomOffsetZ);

        /* Rotation */
        // Add random rotation
        dummy.rotation.set(
          0,
          (Math.random() * 2 - 1) * controlls.LEAF_MAX_RANDOM_ROTATION,
          0,
        );

        // Update matrix for the instance
        dummy.updateMatrix();
        instancedLeavesRef.current.setMatrixAt(i, dummy.matrix);
      }

      instancedLeavesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Create custom ShaderMaterial
  const material = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: THREE.MeshPhongMaterial,
        uniforms: {},
        vertexShader: grassVertexShader,
        fragmentShader: grassFragmentShader,
        vertexColors: false,
        side: THREE.DoubleSide,
        color: new THREE.Color(controlls.LEAF_COLOR),
      }),
    [controlls.LEAF_COLOR],
  );

  return (
    <instancedMesh
      ref={instancedLeavesRef}
      args={[leafGeo, undefined, controlls.LEAVES_COUNT]}
    >
      <primitive attach="material" object={material} />
    </instancedMesh>
  );
};

// function seededRandom(seed: number, index: number): number {
//   let value = seed + index * 16807; // Use index to modify the seed
//   value = (value * 16807) % 2147483647;
//   return (value - 1) / 2147483646; // Normalize to range [0, 1)
// }

function buildLeaveGeo() {
  const geometry = useMemo(() => {
    const bladeGeometry = new THREE.BufferGeometry();
    const segments = controlls.LEAF_SEGMENT_COUNT; // Number of divisions along the blade
    const positions = [];
    const indices = [];
    const halfThickness = controlls.LEAF_THICKNESS / 2;

    for (let i = 0; i <= segments; i++) {
      const y = i / segments;
      const curveValue =
        controlls.LEAF_BEZIERE.evaluate(y) * controlls.LEAF_HEIGT;

      // Taper the thickness near the tip
      const currentThickness = halfThickness * (1 - y);

      // Add two vertices for the current segment (left and right of the curve)
      positions.push(
        -currentThickness,
        curveValue,
        y, // Left vertex
        currentThickness,
        curveValue,
        y, // Right vertex
      );

      // Connect vertices to form triangles
      if (i < segments) {
        const baseIndex = i * 2;
        indices.push(
          baseIndex,
          baseIndex + 1,
          baseIndex + 2, // First triangle
          baseIndex + 1,
          baseIndex + 3,
          baseIndex + 2, // Second triangle
        );
      }
    }

    bladeGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    bladeGeometry.setIndex(indices);
    bladeGeometry.computeVertexNormals();

    return bladeGeometry;
  }, [
    controlls.LEAF_THICKNESS,
    controlls.LEAF_BEZIERE,
    controlls.LEAF_HEIGT,
    controlls.LEAF_SEGMENT_COUNT,
  ]);

  return geometry;
}

const Lighting = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        color={new THREE.Color(0xcfaa7a)}
        intensity={2}
        castShadow={true}
      />
    </>
  );
};

const Ground = () => {
  return (
    <mesh
      scale={new THREE.Vector3(controlls.AREA_SIZE, controlls.AREA_SIZE, 0)}
      rotation={new THREE.Euler(-Math.PI / 2, 0, 0)}
      receiveShadow={true}
      position={new THREE.Vector3(0, 0, 0)}
    >
      <planeGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};
