import { HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { Vector } from "@tabletop-playground/api";

export class SystemAdjacency {
  static getHexToSystem(): Map<HexType, System> {
    const hexToSystem: Map<HexType, System> = new Map();
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      hexToSystem.set(hex, system);
    }
    return hexToSystem;
  }
}
