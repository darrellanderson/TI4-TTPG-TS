import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import {
  Find,
  IGlobal,
  NSID,
  OnCardBecameSingletonOrDeck,
  ParsedNSID,
  PlayerSlot,
} from "ttpg-darrell";

import { Faction } from "../../lib/faction-lib/faction/faction";
import { UnpackAll } from "../../lib/faction-lib/unpack/unpack-all/unpack-all";

export const ACTION_UNPACK: string = "*Unpack Faction";
export const ACTION_REMOVE: string = "*Remove Faction";

/**
 * Right click a faction reference card, "unpack" option.
 */
export class UnpackFactionContextMenuItem implements IGlobal {
  private readonly _onCustomActionHandler = (
    obj: GameObject,
    _player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_UNPACK) {
      this._unpackFaction(obj);
    } else if (identifier === ACTION_REMOVE) {
      this._removeFaction(obj);
    }
  };

  init() {
    OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((card: Card) => {
      card.removeCustomAction(ACTION_UNPACK);
      card.removeCustomAction(ACTION_REMOVE);
      card.onCustomAction.remove(this._onCustomActionHandler);
    });
    OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((card: Card) => {
      this._maybeAddContextMenuItem(card);
    });
  }

  _maybeAddContextMenuItem(card: Card): void {
    const nsid: string = NSID.get(card);
    if (nsid.startsWith("card.faction-reference:")) {
      card.removeCustomAction(ACTION_UNPACK);
      card.removeCustomAction(ACTION_REMOVE);
      card.addCustomAction(ACTION_UNPACK);
      card.addCustomAction(ACTION_REMOVE);
      card.onCustomAction.remove(this._onCustomActionHandler);
      card.onCustomAction.add(this._onCustomActionHandler);
    }
  }

  _getFaction(obj: GameObject): Faction {
    const nsid: string = NSID.get(obj);
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      throw new Error(`bad NSID "${nsid}"`);
    }
    const nsidName: string = parsed.nameParts.join(".");
    const faction: Faction = TI4.factionRegistry.getByNsidNameOrThrow(nsidName);
    return faction;
  }

  _getClosest(obj: GameObject): PlayerSlot {
    const pos: Vector = obj.getPosition();
    const playerSlot: PlayerSlot = new Find().closestOwnedCardHolderOwner(pos);
    return playerSlot;
  }

  _unpackFaction(obj: GameObject): void {
    const faction: Faction = this._getFaction(obj);
    const playerSlot: number = this._getClosest(obj);
    new UnpackAll(faction, playerSlot).unpack();
  }

  _removeFaction(obj: GameObject): void {
    const faction: Faction = this._getFaction(obj);
    const playerSlot: number = this._getClosest(obj);
    new UnpackAll(faction, playerSlot).remove();
  }
}
