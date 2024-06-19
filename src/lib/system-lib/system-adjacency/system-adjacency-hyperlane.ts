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
    for (const [hex, system] of hexToSystem.entries()) {
      if (!system.isHyperlane()) {
        continue;
      }

      // Get neighbors, reverse-rotate to match the system's orientation.
      // (This way we can use "north" relative to the tile orientation.)
      const neighbors: Array<HexType> =
        SystemAdjacencyHyperlane.neighborsWithRotAndFlip(hex, system);
      const dirToHex: Record<string, HexType | undefined> = {
        n: neighbors[0],
        nw: neighbors[1],
        sw: neighbors[2],
        s: neighbors[3],
        se: neighbors[4],
        ne: neighbors[5],
      };

      const hyperlanes: Record<string, Array<string>> = system.getHyperlanes();
      for (const [srcDir, dstDirs] of Object.entries(hyperlanes)) {
        // Create a node for each edge of the hyperlane, link the edge
        // to the node and mark as a transit node.
        const srcHex: HexType | undefined = dirToHex[srcDir];
        if (srcHex) {
          const node: string = `${hex}-${srcDir}`;
          const edge = [srcHex, hex].sort().join("-");
          adjacency.addNodeTags(node, [edge]);
          adjacency.addTransitNode(node);
          adjacency.addLink(edge, edge); // make nodes sharing this tag adjacent

          for (const dstDir of dstDirs) {
            const dstHex: HexType | undefined = dirToHex[dstDir];
            if (dstHex) {
              const edge = [hex, dstHex].sort().join("-");
              adjacency.addNodeTags(node, [edge]);
              adjacency.addLink(edge, edge); // make nodes sharing this tag adjacent
            }
          }
        }
      }
    }
  }
}
