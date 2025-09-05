import { System } from "../../system-lib/system/system";
import { Vector } from "@tabletop-playground/api";

export class MapPlaceFrontierTokens {
  static _getZeroPlanetSystems(): Array<System> {
    const zeroPlanetSystems: Array<System> = [];
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      if (system.getPlanets().length === 0) {
        zeroPlanetSystems.push(system);
      }
    }
    return zeroPlanetSystems;
  }

  static _placeFrontierToken(system: System): void {
    const pos: Vector = system.getObj().getPosition().add([0, -2.5, 10]);
    const token = TI4.spawn.spawn("token.attachment.system:pok/frontier", pos);
    if (token) {
      token.snapToGround();
    }
  }

  placeFrontierTokens(): void {
    const zeroPlanetSystems = MapPlaceFrontierTokens._getZeroPlanetSystems();
    for (const system of zeroPlanetSystems) {
      MapPlaceFrontierTokens._placeFrontierToken(system);
    }
  }
}
