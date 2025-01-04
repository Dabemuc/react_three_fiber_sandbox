"use client";

import FirefliesScene from "@/scenes/fireflies";
import GrassScene from "@/scenes/GrassScene/GrassScene";
import { useState } from "react";

const scenes = ["Grass", "Fireflies"] as const;
type SceneType = (typeof scenes)[number];

export default function Home() {
  const [scene, setScene] = useState<SceneType>("Grass");

  function getCurrentScene(scene: SceneType) {
    switch (scene) {
      case "Fireflies":
        return <FirefliesScene />;
      default:
        return <GrassScene />;
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
    <div className="absolute right-0 top-0 m-4 z-10">
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
