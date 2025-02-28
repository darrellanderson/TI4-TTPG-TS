import { GameObject, Player, Vector, world } from "@tabletop-playground/api";
import { GarbageContainer, HexType, NSID } from "ttpg-darrell";

export class MapRemoveFrontierTokens {
  removeFrontierTokens(): void {
    // Get system hexes.
    const hexes: Set<HexType> = new Set();
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      hexes.add(hex);
    }

    // Look for planet cards on system hexes.
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "token.attachment.system:pok/frontier") {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        if (hexes.has(hex)) {
          this._removeFrontierToken(obj);
        }
      }
    }
  }

  _removeFrontierToken(obj: GameObject): void {
    const player: Player | undefined = undefined;
    GarbageContainer.tryRecycle(obj, player);
  }
}
