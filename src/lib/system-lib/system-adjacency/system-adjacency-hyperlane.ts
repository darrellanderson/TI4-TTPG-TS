import { Adjacency, Hex, HexType } from "ttpg-darrell";
import { System } from "../system/system";

export class SystemAdjacencyHyperlane {
  constructor() {}

  static yawToShift(yaw: number): number {
    yaw = yaw % 360; // force [-360:360]
    yaw = (yaw + 360) % 360; // force [0:360]
    return Math.round(yaw / 60);
  }

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    for (const [hex, system] of hexToSystem) {
      if (!system.isHyperlane()) {
        continue;
      }

      // Get neighbors, reverse-rotate to match the system's orientation.
      // (This way we can use "north" relative to the tile orientation.)
      const neighbors: Array<HexType> = Hex.neighbors(hex);
      // TODO XXX
    }
  }
}
