import { Adjacency, HexType } from "ttpg-darrell";
import { System } from "../system/system";

export class SystemAdjacencyIngress {
  public addTags(
    hexToSystem: Map<HexType, System>,
    adjacency: Adjacency
  ): void {
    const ingressHexes: Array<HexType> = [];
    const egressHexes: Array<HexType> = [];

    for (const [hex, system] of hexToSystem) {
      if (system.isIngress()) {
        ingressHexes.push(hex);
      }
      if (system.isEgress()) {
        egressHexes.push(hex);
      }
    }

    for (const ingressHex of ingressHexes) {
      for (const egressHex of egressHexes) {
        adjacency.addLink({
          src: ingressHex,
          dst: egressHex,
          distance: 1,
          isTransit: false,
        });
      }
    }

    for (const egressHex of egressHexes) {
      for (const ingressHex of ingressHexes) {
        adjacency.addLink({
          src: egressHex,
          dst: ingressHex,
          distance: 1,
          isTransit: false,
        });
      }
    }
  }
}
