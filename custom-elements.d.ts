import { WaterMaterial } from "@/scenes/WaterSimulationScene/WaterSimulationScene";
import { ReactThreeFiber } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      waterMaterial: ReactThreeFiber.Object3DNode<
        InstanceType<typeof WaterMaterial>,
        typeof WaterMaterial
      >;
    }
  }
}
