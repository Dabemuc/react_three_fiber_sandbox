import { NumberInput } from "leva/dist/declarations/src/components/Number/number-types";
import { Vector2d, Vector2dInput } from "leva/plugin";

export type WaterSimulationControls = {
  WIND_SPEED: number;
  WIND_DIRECTION: Vector2d;
};

export type WaterSimulationControlsConfig = {
  WIND_SPEED: NumberInput;
  WIND_DIRECTION: Vector2dInput;
};
