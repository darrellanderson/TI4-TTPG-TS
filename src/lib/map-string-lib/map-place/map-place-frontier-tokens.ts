import { Vector } from "@tabletop-playground/api";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";

export class MapPlaceFrontierTokens {
  static _getZeroPlanetSystems(): Array<System> {
    const zeroPlanetSystems: Array<System> = [];
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      const planets: Array<Planet> = system
        .getPlanets()
        .filter((planet) => !planet.isSpaceStation());
      if (
        planets.length === 0 &&
        system.getSystemTileNumber() > 0 &&
        !system.isHyperlane() &&
        system.getClass() !== "fracture"
      ) {
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
