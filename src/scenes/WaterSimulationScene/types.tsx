import { NumberInput } from "leva/dist/declarations/src/components/Number/number-types";
import { Vector2d, Vector2dInput } from "leva/plugin";

export type WaterSimulationControls = {
  AREA_SIZE: number;
  AREA_RESOLUTION: number;
  WIND_SPEED: number;
  WIND_DIRECTION: Vector2d;
};

export type WaterSimulationControlsConfig = {
  AREA_SIZE: NumberInput;
  AREA_RESOLUTION: NumberInput;
  WIND_SPEED: NumberInput;
  WIND_DIRECTION: Vector2dInput;
};
