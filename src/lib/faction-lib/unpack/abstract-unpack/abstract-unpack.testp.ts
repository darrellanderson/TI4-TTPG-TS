import { GameObject, Player, refObject } from "@tabletop-playground/api";
import { AbstractUnpack } from "./abstract-unpack";
import { Faction } from "../../faction/faction";

export const FACTION: Faction = TI4.factionRegistry.getByNsid(
  "faction:base/arborec"
)!;
export const PLAYER_SLOT: number = 10;

export class AbstractUnpackTestP {
  constructor(unpack: AbstractUnpack) {
    refObject.addCustomAction("*Unpack");
    refObject.addCustomAction("*Remove");
    refObject.onCustomAction.add(
      (_obj: GameObject, player: Player, _identifier: string): void => {
        if (_identifier === "*Unpack") {
          unpack.unpack();
          TI4.onFactionChanged.trigger(PLAYER_SLOT, player);
        } else if (_identifier === "*Remove") {
          unpack.remove();
          TI4.onFactionChanged.trigger(PLAYER_SLOT, player);
        }
      }
    );
  }
}
