import { Vector } from "@tabletop-playground/api";
import { Facing, HexType } from "ttpg-darrell";

import { MapStringHex } from "./map-string-hex";
import { SystemAdjacencyHyperlane } from "../../system-lib/system-adjacency/system-adjacency-hyperlane";

export class MapStringSave {
  save(): string {
    const entries: Array<string> = [];
    const mapStringHex: MapStringHex = new MapStringHex();

    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      // Ignore off-map systems.
      const systemClass: string = system.getClass();
      if (systemClass === "off-map" || systemClass === "fracture") {
        continue;
      }

      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      const idx: number = mapStringHex.hexToIndex(hex);

      // Ignore tiles way outside map.
      if (idx > 150) {
        continue;
      }

      const tileNumber: number = system.getSystemTileNumber();
      const side: string = Facing.isFaceUp(system.getObj()) ? "A" : "B";
      const yaw: number = system.getObj().getRotation().yaw;
      const rot: number = SystemAdjacencyHyperlane.yawToShift(yaw); // [0:5]

      if (system.isHome() && side === "B") {
        entries[idx] = "0";
      } else if (side === "A" && rot === 0) {
        entries[idx] = `${tileNumber}`;
      } else {
        entries[idx] = `${tileNumber}${side}${rot}`;
      }
    }

    // Fill in any missing entries with -1.
    for (let i = 0; i < entries.length; i++) {
      if (!entries[i]) {
        entries[i] = "-1";
      }
    }

    // 18 is the default start, prune it if there.
    // Otherwise mark the custom start as such.
    const rex: string = TI4.systemRegistry
      .getMecatolRexSystemTileNumber()
      .toString();
    if (entries[0] === rex) {
      entries.shift();
    } else if (entries[0]) {
      entries[0] = `{${entries[0]}}`;
    }

    return entries.join(" ");
  }
}
