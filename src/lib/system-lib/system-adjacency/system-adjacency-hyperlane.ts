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

  static neighborIndicesWithRotAndFlip(system: System): Array<number> {
    const systemTileObj: GameObject = system.getObj();
    const faceUp: boolean = Facing.isFaceUp(systemTileObj);
    const yaw: number = systemTileObj.getRotation().yaw;
    const n: number = SystemAdjacencyHyperlane.yawToShift(yaw);

    const neighborIndicess: Array<number> = [...new Array(6).fill(0).keys()];
    for (let i = 0; i < n; i++) {
      if (faceUp) {
        neighborIndicess.push(neighborIndicess.shift()!);
      } else {
        neighborIndicess.unshift(neighborIndicess.pop()!);
      }
    }
    return neighborIndicess;
  }

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    for (const [hex, system] of hexToSystem.entries()) {
      if (!system.isHyperlane()) {
        continue;
      }

      const neighbors: Array<HexType> = Hex.neighbors(hex);
      const edgesIn: Array<string> = neighbors.map(
        (neighbor: HexType): string => {
          return [neighbor, hex].sort().join("|");
        }
      );
      const edgesOut: Array<string> = neighbors.map(
        (neighbor: HexType): string => {
          return [hex, neighbor].sort().join("|");
        }
      );

      // Get mapping to neighbor indices, accounting for rotated and flipped.
      const neighborIndicess: Array<number> =
        SystemAdjacencyHyperlane.neighborIndicesWithRotAndFlip(system);

      const hyperlanes: Record<string, Array<string>> = system.getHyperlanes();
      for (const [srcDir, dstDirs] of Object.entries(hyperlanes)) {
        /*
        const srcEdge: HexType | undefined =
          neighbors[neighborIndicess[srcDir]];

        // Create a node for each edge of the hyperlane, link the edge
        // to the node and mark as a transit node.
        const srcHex: HexType | undefined = dirToHex[srcDir];
        if (srcHex) {
          const node: string = `${hex}-${srcDir}`;
          const edge = [srcHex, hex].sort().join("|");
          adjacency.addNodeTags(node, [edge]);
          adjacency.addTransitNode(node);
          adjacency.addLink(edge, edge); // make nodes sharing this tag adjacent

          for (const dstDir of dstDirs) {
            const dstHex: HexType | undefined = dirToHex[dstDir];
            if (dstHex) {
              const edge = [hex, dstHex].sort().join("|");
              adjacency.addNodeTags(node, [edge]);
              adjacency.addLink(edge, edge); // make nodes sharing this tag adjacent
            }
          }
        }*/
      }
    }
  }
}
