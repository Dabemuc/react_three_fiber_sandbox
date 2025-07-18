"use client";

import FirefliesScene from "@/scenes/FirefliesScene/FirefliesScene";
import GhostOfTsushimaScene from "@/scenes/GhostOfTsushimaScene/GhostOfTsushimaScene";
import GrassScene from "@/scenes/GrassScene/GrassScene";
import WaterSimulationScene from "@/scenes/WaterSimulationScene/WaterSimulationScene";
import { useState } from "react";

const scenes = [
  "Grass",
  "Fireflies",
  "Ghost of Tsushima",
  "Water Simulation",
] as const;
type SceneType = (typeof scenes)[number];

export default function Home() {
  const [scene, setScene] = useState<SceneType>("Water Simulation");

  function getCurrentScene(scene: SceneType) {
    switch (scene) {
      case "Fireflies":
        return <FirefliesScene />;
      case "Grass":
        return <GrassScene />;
      case "Ghost of Tsushima":
        return <GhostOfTsushimaScene />;
      case "Water Simulation":
        return <WaterSimulationScene />;
      default:
        return null;
    }
  }

  return (
    <div id="page" className="w-full h-full">
      <SceneSwitcher scene={scene} setScene={setScene} />
      {getCurrentScene(scene)}
    </div>
  );
}

function SceneSwitcher({
  scene,
  setScene,
}: {
  scene: SceneType;
  setScene: (sceneToSet: SceneType) => void;
}) {
  return (
    <div className="absolute right-0 bottom-0 m-4 z-10">
      <select
        className="m-2 text-black"
        onChange={(e) => setScene(e.target.value as SceneType)}
        defaultValue={scene}
      >
        {scenes.map((scene) => (
          <option key={scene} value={scene} className="text-black">
            {scene}
          </option>
        ))}
      </select>
    </div>
  );
}
