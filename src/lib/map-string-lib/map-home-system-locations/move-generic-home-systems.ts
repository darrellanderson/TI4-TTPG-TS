import { GameObject, Vector, world } from "@tabletop-playground/api";
import { HexType, NSID } from "ttpg-darrell";
import { MapStringEntry, MapStringHex, MapStringParser } from "../map-string";

export class MoveGenericHomeSystemLocations {
  moveGenerics(mapString: string): void {
    const openHexes: Set<HexType> = new Set(this._getOpenHexes(mapString));
    const genericHomeSystems: Set<GameObject> = new Set(
      this._getGenericHomeSystemObjects()
    );

    while (openHexes.size > 0 && genericHomeSystems.size > 0) {
      let bestDSq: number = Number.MAX_VALUE;
      let bestHex: HexType | undefined = undefined;
      let bestHome: GameObject | undefined = undefined;

      for (const hex of openHexes) {
        const p0: Vector = TI4.hex.toPosition(hex);
        p0.z = 0;
        for (const home of genericHomeSystems) {
          const p1: Vector = home.getPosition();
          p1.z = 0;
          const dSq: number = p0.subtract(p1).magnitudeSquared();
          if (dSq < bestDSq) {
            bestDSq = dSq;
            bestHex = hex;
            bestHome = home;
          }
        }
      }

      if (bestHex && bestHome) {
        const pos: Vector = TI4.hex.toPosition(bestHex);
        pos.z = world.getTableHeight() + 10;
        bestHome.setPosition(pos);
        bestHome.snapToGround();

        openHexes.delete(bestHex);
        genericHomeSystems.delete(bestHome);
      }
    }
  }

  _getOpenHexes(mapString: string): Array<HexType> {
    const openHexes: Array<HexType> = [];

    const invalidEntries: Array<string> = [];
    const parsed: Array<MapStringEntry> = new MapStringParser().parse(
      mapString,
      invalidEntries
    );

    const mapStringHex: MapStringHex = new MapStringHex();
    parsed.forEach((entry: MapStringEntry, index: number): void => {
      if (entry.tile === 0) {
        const hex: HexType = mapStringHex.indexToHex(index);
        openHexes.push(hex);
      }
    });

    return openHexes;
  }

  _getGenericHomeSystemObjects(): Array<GameObject> {
    const generics: Array<GameObject> = [];

    const skipConained: boolean = true;
    for (const obj of world.getAllObjects(skipConained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "tile.system:base/0") {
        generics.push(obj);
      }
    }

    return generics;
  }
}
