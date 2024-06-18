import { GameObject } from "@tabletop-playground/api";
import { Adjacency, Facing, Hex, HexType } from "ttpg-darrell";
import { System } from "../system/system";

export class SystemAdjacencyHyperlane {
  constructor() {}

  static yawToShift(yaw: number): number {
    yaw = yaw % 360; // [-360:360]
    yaw = (yaw + 360) % 360; // [0:360]
    return Math.round(yaw / 60) % 6; // [0:5]
  }

  static neighborsWithRotAndFlip(hex: HexType, system: System): Array<HexType> {
    const systemTileObj: GameObject = system.getObj();
    const faceUp: boolean = Facing.isFaceUp(systemTileObj);
    const yaw: number = systemTileObj.getRotation().yaw;
    const n: number = SystemAdjacencyHyperlane.yawToShift(yaw);

    const neighbors: Array<HexType> = Hex.neighbors(hex);
    for (let i = 0; i < n; i++) {
      if (faceUp) {
        neighbors.unshift(neighbors.pop()!);
      } else {
        neighbors.push(neighbors.shift()!);
      }
    }
    return neighbors;
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
