import { GameObject, Vector } from "@tabletop-playground/api";
import { Adjacency, Find, Hex, HexType } from "ttpg-darrell";
import { System } from "../system/system";

export class SystemAdjacencyNeighbor {
  private readonly _find: Find = new Find();

  constructor() {}

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    // Create:
    // 1. Incoming links from hex edges to hex.
    // 2. Outgoing links from hex to hex edges.
    for (const [hex, system] of hexToSystem) {
      // "off-map" systems never have neighbors (not to be conused with
      // adjaency, which they can have via wormholes).  Hyperlanes do
      // not have outgoing neighbors in this sense, but are considered
      // to be neighbors of "normal" systems.
      if (system.getClass() === "off-map" || system.isHyperlane()) {
        continue; // hyperlanes are handled by SystemAdjacencyHyperlane
      }

      const neighbors: Array<HexType> = Hex.neighbors(hex);
      for (const neighbor of neighbors) {
        const neighborSystem: System | undefined = hexToSystem.get(neighbor);
        if (neighborSystem && neighborSystem.getClass() === system.getClass()) {
          // Incoming link from neighbor to hex.
          const edgeIn: string = [neighbor, hex].join("|");
          adjacency.addLink({
            src: edgeIn,
            dst: hex,
            distance: 0.5,
            isTransit: false,
          });

          // Outgoing link from hex to neighbor.
          const edgeOut: string = [hex, neighbor].join("|");
          adjacency.addLink({
            src: hex,
            dst: edgeOut,
            distance: 0.5,
            isTransit: true,
          });
        }
      }
    }
  }

  /**
   * Some effects may block neighbor adjacency.  Bake those into a separate
   * "removeTags" method to apply after other tags have been added.
   *
   * @param hexToSystem
   * @param adjacency
   */
  public removeTags(adjacency: Adjacency): void {
    // Block neighbor adjacency by placing a token on the edge between them.
    const nsid: string = "token:hombrew.demo/neighbor-blocker";
    const blocker: GameObject | undefined = this._find.findGameObject(nsid);
    if (blocker) {
      // Find two closest hexes, first is blocker hex.
      const pos: Vector = blocker.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      const neighbors: Array<HexType> = Hex.neighbors(hex);
      let best: HexType | undefined;
      let bestDSq: number = Infinity;
      for (const neighbor of neighbors) {
        const neighborPos: Vector = TI4.hex.toPosition(neighbor);
        const dSq: number = pos.subtract(neighborPos).magnitudeSquared();
        if (dSq < bestDSq) {
          best = neighbor;
          bestDSq = dSq;
        }
      }
      if (best) {
        // Remove all links between edge and the two hexes.
        const edgeA: string = [best, hex].join("|");
        adjacency.removeNode(edgeA);

        const edgeB: string = [hex, best].join("|");
        adjacency.removeNode(edgeB);
      }
    }
  }
}
