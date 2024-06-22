import { Facing, HexType } from "ttpg-darrell";
import { MapStringHex } from "./map-string-hex";
import { SystemAdjacencyHyperlane } from "lib/system-lib/system-adjacency/system-adjacency-hyperlane";
import { Vector } from "@tabletop-playground/api";

export class MapStringSave {
  save(): string {
    const entries: Array<string> = [];
    const mapStringHex: MapStringHex = new MapStringHex();

    for (const system of TI4.systemRegistry.getOnTableSystems()) {
      // Ignore off-map systems.
      if (system.getClass() === "off-map") {
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
    if (entries[0] === "18") {
      entries.shift();
    } else {
      entries[0] = `{${entries[0]}}`;
    }

    return entries.join(" ");
  }
}
