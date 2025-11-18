import { Vector } from "@tabletop-playground/api";
import {
  Adjacency,
  AdjacencyLinkType,
  AdjacencyNodeType,
  AdjacencyPathType,
  Hex,
  HexType,
} from "ttpg-darrell";

import { Faction } from "../../faction-lib/faction/faction";
import { System } from "../system/system";
import { SystemAdjacencyBreach } from "./system-adjacency-breach";
import { SystemAdjacencyHyperlane } from "./system-adjacency-hyperlane";
import { SystemAdjacencyIngress } from "./system-adjacency-ingress";
import { SystemAdjacencyNeighbor } from "./system-adjacency-neighbor";
import { SystemAdjacencyWormhole } from "./system-adjacency-wormhole";
import { SystemAdjacencyTFSpacialConduitCylinder } from "./system-adjacency-tf-spacial-conduit-cylinder";

export class SystemAdjacency {
  private readonly _breach = new SystemAdjacencyBreach();
  private readonly _hyperlane = new SystemAdjacencyHyperlane();
  private readonly _ingress = new SystemAdjacencyIngress();
  private readonly _neighbor = new SystemAdjacencyNeighbor();
  private readonly _wormhole = new SystemAdjacencyWormhole();
  private readonly _tfSpacialConduitCylinder =
    new SystemAdjacencyTFSpacialConduitCylinder();

  static getHexToSystem(): Map<HexType, System> {
    const hexToSystem: Map<HexType, System> = new Map();
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      hexToSystem.set(hex, system);
    }
    return hexToSystem;
  }

  /**
   * Convert path to simplified list of nodes.
   * Intended for debugging and display.
   *
   * @param adjacencyNodePath
   * @returns
   */
  static simplifyPath(
    adjacencyNodePath: AdjacencyPathType
  ): Array<AdjacencyNodeType> {
    const result: Array<AdjacencyNodeType> = [];
    const first: AdjacencyLinkType | undefined = adjacencyNodePath.path[0];
    if (first) {
      result.push(first.src);
    }
    for (const link of adjacencyNodePath.path) {
      result.push(link.dst);
    }
    return result;
  }

  /**
   * Node is either a HexType or a with-direction hex edge encoded as
   * "srcHex|dstHex".
   *
   * @param node
   * @returns
   */
  static adjNodeToPositionOrThrow(node: AdjacencyNodeType): Vector {
    const re: RegExp = /^(<-?\d+,-?\d+,-?\d+>)\|?(<-?\d+,-?\d+,-?\d+>)?$/;
    const match: RegExpMatchArray | null = node.match(re);
    let srcHex: HexType | undefined;
    let dstHex: HexType | undefined;
    if (match) {
      const srcStr: string | undefined = match[1];
      if (srcStr) {
        srcHex = srcStr as HexType;
      }
      const dstStr: string | undefined = match[2];
      if (dstStr) {
        dstHex = dstStr as HexType;
      }
    }
    if (srcHex && dstHex) {
      const srcPos: Vector = TI4.hex.toPosition(srcHex);
      const dstPos: Vector = TI4.hex.toPosition(dstHex);
      return srcPos.add(dstPos).divide(2);
    } else if (srcHex) {
      return TI4.hex.toPosition(srcHex);
    } else {
      throw new Error(`Invalid node: ${node}`);
    }
  }

  /**
   * Get cooked adjacency results, just the adjacent hexes.
   * @param hex
   * @returns
   */
  public getAdjHexes(hex: HexType, faction: Faction | undefined): Set<HexType> {
    const adjHexes: Set<HexType> = new Set();

    const adjacencyPaths: ReadonlyArray<AdjacencyPathType> =
      this.getAdjacencyPaths(hex, faction);
    adjacencyPaths.forEach((adjacencyPath: AdjacencyPathType): void => {
      if (adjacencyPath.distance === 1) {
        // Adjacency downgraded from HexType to string.
        // Verify node is HexType before using as one.
        const adjHex: HexType = adjacencyPath.node as HexType;
        if (Hex._maybeHexFromString(adjHex)) {
          adjHexes.add(adjHex);
        }
      }
    });
    adjHexes.delete(hex); // make sure hex is not included
    return adjHexes;
  }

  /**
   * Get the raw adjancency results, including path taken.
   * @param hex
   * @returns
   */
  public getAdjacencyPaths(
    hex: HexType,
    faction: Faction | undefined
  ): ReadonlyArray<AdjacencyPathType> {
    const adjacency: Adjacency = new Adjacency();
    const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
    this._breach.addTags(hexToSystem, adjacency);
    this._hyperlane.addTags(hexToSystem, adjacency);
    this._ingress.addTags(hexToSystem, adjacency);
    this._neighbor.addTags(hexToSystem, adjacency);
    this._wormhole.addTags(hexToSystem, adjacency, faction);
    this._tfSpacialConduitCylinder.addTags(adjacency);
    this._neighbor.removeTags(adjacency); // adjacency blocking tokens
    return adjacency.get(hex, 1);
  }
}
