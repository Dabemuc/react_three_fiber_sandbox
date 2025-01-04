import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export async function loadGrassTuft() {
  return new Promise<THREE.BufferGeometry | undefined>((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      "/GrassTuft.gltf",
      (gltf) => {
        const geometries: THREE.BufferGeometry[] = [];

        // Extract geometries from the children
        gltf.scene.children.forEach((child) => {
          if ((child as THREE.Mesh).geometry) {
            child.updateMatrixWorld(); // Ensures transformations like scale, rotation, and position are applied
            const geometry = (child as THREE.Mesh).geometry.clone();
            geometry.applyMatrix4(child.matrixWorld); // Applies the mesh's world transformation
            geometries.push(geometry);
          }
        });

        if (geometries.length > 0) {
          // Combine geometries into one
          const mergedGeometry = mergeGeometries(geometries, true);
          resolve(mergedGeometry);
        } else {
          console.warn("No geometries found in the GLTF file.");
          resolve(undefined);
        }
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF:", error);
        reject(error);
      },
    );
  });
}
