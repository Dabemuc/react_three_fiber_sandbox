"use client";

import { LevaControlsProvider, useLevaControls } from "@/hooks/useLevaControls";
import { WaterSimulationControlsConfig } from "./types";

const sceneControlsConfig: WaterSimulationControlsConfig = {
  WIND_SPEED: { value: 5, step: 1 },
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
  const leva = useLevaControls();
  return <>{JSON.stringify(leva)}</>;
}
