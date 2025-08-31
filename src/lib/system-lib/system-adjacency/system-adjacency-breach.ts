import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";

export class SystemAdjacencyBreach {
  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    for (const [hex, system] of hexToSystem) {
      if (system.isBreach()) {
        // System into wormhole.
        adjacency.addLink({
          src: hex,
          dst: "breach",
          distance: 0.5,
          isTransit: true,
        });

        // Wormhole into system.
        adjacency.addLink({
          src: "breach",
          dst: hex,
          distance: 0.5,
          isTransit: false,
        });
      }
    }
  }
}
