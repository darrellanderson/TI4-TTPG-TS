import { Adjacency, Hex, HexType } from "ttpg-darrell";
import { System } from "../system/system";

export class SystemAdjacencyNeighbor {
  constructor() {}

  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    // Add tags for each edge where systems are in the same class.
    // Do not use a single tag for the system, allows for an edge to be blocked.
    for (const [hex, system] of hexToSystem) {
      if (system.getClass() === "off-map") {
        continue; // off-map have no neighbors
      }
      const neighbors: Array<HexType> = Hex.neighbors(hex);
      for (const neighbor of neighbors) {
        const neighborSystem: System | undefined = hexToSystem.get(neighbor);
        if (neighborSystem?.getClass() === system.getClass()) {
          const edge: string = [hex, neighbor].sort().join("-");
          adjacency.addNodeTags(hex, [edge]);
          adjacency.addLink(edge, edge); // make nodes sharing this tag adjacent
        }
      }
    }
  }
}
