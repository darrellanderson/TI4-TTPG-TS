import { Adjacency, AdjacencyResult, Hex, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { Vector } from "@tabletop-playground/api";
import { SystemAdjacencyHyperlane } from "./system-adjacency-hyperlane";
import { SystemAdjacencyNeighbor } from "./system-adjacency-neighbor";
import { SystemAdjacencyWormhole } from "./system-adjacency-wormhole";

export class SystemAdjacency {
  private readonly _hyperlane = new SystemAdjacencyHyperlane();
  private readonly _neighbor = new SystemAdjacencyNeighbor();
  private readonly _wormhole = new SystemAdjacencyWormhole();

  static getHexToSystem(): Map<HexType, System> {
    const hexToSystem: Map<HexType, System> = new Map();
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained,
    )) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      hexToSystem.set(hex, system);
    }
    return hexToSystem;
  }

  getAdjHexes(hex: HexType): Set<HexType> {
    const adjHexes: Set<HexType> = new Set();
    const adjacency: Adjacency = new Adjacency();
    const hexToSystem: Map<HexType, System> = SystemAdjacency.getHexToSystem();
    this._hyperlane.addTags(hexToSystem, adjacency);
    this._neighbor.addTags(hexToSystem, adjacency);
    this._wormhole.addTags(hexToSystem, adjacency);
    this._neighbor.removeTags(adjacency);
    adjacency.get(hex, 1).forEach((result: AdjacencyResult): void => {
      if (result.distance === 1) {
        // Adjacency downgraded from HexType to string.
        // Verify node is HexType before using as one.
        const adjHex: HexType = result.node as HexType;
        if (Hex._maybeHexFromString(adjHex)) {
          adjHexes.add(adjHex);
        }
      }
    });
    adjHexes.delete(hex); // make sure hex is not included
    return adjHexes;
  }
}
