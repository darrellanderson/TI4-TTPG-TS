import { GameObject } from "@tabletop-playground/api";
import {
  Adjacency,
  AdjacencyLinkType,
  Facing,
  Hex,
  HexType,
} from "ttpg-darrell";
import { System } from "../system/system";

export type Direction = "n" | "nw" | "sw" | "s" | "se" | "ne";
export type DirectionToNeighborHexType = Record<Direction, HexType>;

export class SystemAdjacencyHyperlane {
  constructor() {}

  /**
   * Translate system tile rotation into neighbor index shift.
   * Expose for map string save.
   *
   * @param yaw
   * @returns
   */
  public static yawToShift(yaw: number): number {
    yaw = yaw % 360; // [-360:360]
    yaw = (yaw + 360) % 360; // [0:360]
    return Math.round(yaw / 60) % 6; // [0:5]
  }

  static _getDirectionToNeighbor(
    neighbors: Array<HexType>
  ): DirectionToNeighborHexType {
    const n: HexType | undefined = neighbors[0];
    const nw: HexType | undefined = neighbors[1];
    const sw: HexType | undefined = neighbors[2];
    const s: HexType | undefined = neighbors[3];
    const se: HexType | undefined = neighbors[4];
    const ne: HexType | undefined = neighbors[5];

    // Make sure TypeScript knows all the values are defined.
    if (!n || !nw || !sw || !s || !se || !ne || neighbors.length !== 6) {
      throw new Error("neighbors must have 6 elements");
    }
    return {
      n,
      nw,
      sw,
      s,
      se,
      ne,
    };
  }

  /**
   * Compute system tile local direction to world edge.
   *
   * That is, "n" is north from the tile's rotated/flipped local perspective,
   * but may be any of the 6 directions in world space.
   *
   * @param system
   * @returns
   */
  static _localNeighborsWithRotAndFlip(
    system: System
  ): DirectionToNeighborHexType {
    const systemTileObj: GameObject = system.getObj();
    const faceUp: boolean = Facing.isFaceUp(systemTileObj);
    const yaw: number = systemTileObj.getRotation().yaw;
    const yawShiftCount: number = SystemAdjacencyHyperlane.yawToShift(yaw);

    const hex: HexType = TI4.hex.fromPosition(systemTileObj.getPosition());
    const neighbors: Array<HexType> = Hex.neighbors(hex);

    // Shift neighbors to match local orientation.
    for (let i = 0; i < yawShiftCount; i++) {
      if (faceUp) {
        neighbors.push(neighbors.shift()!);
      } else {
        neighbors.unshift(neighbors.pop()!);
      }
    }

    // Extract the shifted hexes in local directions.
    return SystemAdjacencyHyperlane._getDirectionToNeighbor(neighbors);
  }

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    for (const [hex, system] of hexToSystem.entries()) {
      if (!system.isHyperlane()) {
        continue;
      }

      // Get mapping to neighbors, accounting for rotated and flipped.
      const localNeighbors: DirectionToNeighborHexType =
        SystemAdjacencyHyperlane._localNeighborsWithRotAndFlip(system);

      const hyperlanes: Record<string, Array<string>> = system.getHyperlanes();
      for (const [srcDir, dstDirs] of Object.entries(hyperlanes)) {
        const srcNeighbor: HexType | undefined =
          localNeighbors[srcDir as Direction];
        if (srcNeighbor) {
          const srcEdge: string = [srcNeighbor, hex].join("|");
          for (const dstDir of dstDirs) {
            const dstNeighbor: HexType | undefined =
              localNeighbors[dstDir as Direction];
            if (dstNeighbor) {
              const dstEdge: string = [hex, dstNeighbor].join("|");
              const link: AdjacencyLinkType = {
                src: srcEdge,
                dst: dstEdge,
                distance: 0,
                isTransit: true,
              };
              //console.log(JSON.stringify(link));
              adjacency.addLink(link);
            }
          }
        }
      }
    }
  }
}
