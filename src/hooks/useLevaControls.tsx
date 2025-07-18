import { createContext, useContext, ReactNode } from "react";
import { useControls } from "leva";
import {
  WaterSimulationControls,
  WaterSimulationControlsConfig,
} from "@/scenes/WaterSimulationScene/types";
import { Schema } from "leva/plugin";

type GlobalControls = {
  ACTIVE_SCENE: number;
};

type SceneControlsConfig = WaterSimulationControlsConfig;
type SceneControls = WaterSimulationControls;

interface LevaControlsContextType {
  GLOBAL_CONTROLS: GlobalControls;
  SCENE_CONTROLS: SceneControls;
}

const LevaControlsContext = createContext<LevaControlsContextType | undefined>(
  undefined,
);

interface LevaControlsProviderProps {
  sceneControlsConfig: SceneControlsConfig;
  children: ReactNode;
}

export function LevaControlsProvider({
  children,
  sceneControlsConfig,
}: LevaControlsProviderProps) {
  const globalControls = useControls("Global", {
    ACTIVE_SCENE: 1,
  } satisfies GlobalControls);

  const sceneControls = useControls(
    "Scene",
    sceneControlsConfig as Schema,
  ) as SceneControls;

  const contextValues: LevaControlsContextType = {
    GLOBAL_CONTROLS: globalControls,
    SCENE_CONTROLS: sceneControls,
  };

  return (
    <LevaControlsContext.Provider value={contextValues}>
      {children}
    </LevaControlsContext.Provider>
  );
}

export function useLevaControls() {
  const context = useContext(LevaControlsContext);
  if (context === undefined) {
    throw new Error(
      "useLevaControls must be used within a LevaControlsProvider",
    );
  }
  return context;
}
