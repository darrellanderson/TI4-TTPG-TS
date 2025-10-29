import { Card, GameObject, Player } from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  CardUtil,
  DeletedItemsContainer,
  NSID,
  ParsedNSID,
} from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";
import { AbstractUnpack } from "../../faction-lib/unpack/abstract-unpack/abstract-unpack";
import { UnpackFactionSheet } from "../../faction-lib/unpack/unpack-faction-sheet/unpack-faction-sheet";
import { UnpackCommandTokens } from "../../faction-lib/unpack/unpack-command-tokens/unpack-command-tokens";
import { UnpackControlTokens } from "../../faction-lib/unpack/unpack-control-tokens/unpack-control-tokens";

const ACTION_NAME: string = "*Claim faction";

class RightClickTFFactionSheet extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "sheet.faction:twilights-fall/";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME) {
        this._claimFaction(object, player);
      }
    };
    super(cardNsidPrefix, ACTION_NAME, customActionHandler);
  }

  _claimFaction(object: GameObject, player: Player): void {
    if (object.getOwningPlayerSlot() !== -1) {
      Broadcast.chatOne(player, "Faction already claimed");
      return;
    }

    const nsid: string = NSID.get(object);
    const playerSlot: number = player.getSlot();

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (parsed) {
      const nsidName: string | undefined = parsed.nameParts[0];
      if (nsidName) {
        const faction: Faction | undefined =
          TI4.factionRegistry.getByNsidName(nsidName);
        if (faction) {
          new TFUnpackFaction(faction, playerSlot).unpack();
          DeletedItemsContainer.destroyWithoutCopying(object);
        }
      }
    }
  }
}

export class TFUnpackFaction {
  private readonly _faction: Faction;
  private readonly _playerSlot: number;

  static addContextMenuToFactionSheets(): void {
    new RightClickTFFactionSheet().init();
  }

  constructor(faction: Faction, playerSlot: number) {
    this._faction = faction;
    this._playerSlot = playerSlot;
  }

  _getPackUnpacks(): Array<AbstractUnpack> {
    return [
      new UnpackFactionSheet(this._faction, this._playerSlot),
      new UnpackCommandTokens(this._faction, this._playerSlot),
      new UnpackControlTokens(this._faction, this._playerSlot),
    ];
  }

  _getTechCardNsids(): Array<string> {
    const nsid: string = this._faction.getNsid();
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (!parsed) {
      throw new Error(`parse failed for ${nsid}`);
    }
    const nsidName: string | undefined = parsed.nameParts[0];
    if (!nsidName) {
      throw new Error(`nameParts[0] is undefined for ${nsid}`);
    }
    if (!nsidName.startsWith("tf-")) {
      throw new Error(`nsidName does not start with 'tf-' for ${nsidName}`);
    }
    const colorName: string = nsidName.substring(3);
    return [
      `card.tf-faction-tech:twilights-fall/antimatter-${colorName}`,
      `card.tf-faction-tech:twilights-fall/wavelength-${colorName}`,
    ];
  }

  unpack(): void {
    for (const unpack of this._getPackUnpacks()) {
      unpack.unpack();
    }

    const deck: Card = TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow(
      "card.tf-faction-tech:"
    );

    const nsids: Array<string> = this._getTechCardNsids();
    const cardUtil: CardUtil = new CardUtil();
    const cards: Card | undefined = cardUtil.filterCards(
      deck,
      (nsid: string): boolean => {
        return nsids.includes(nsid);
      }
    );
    if (cards) {
      const split: Array<Card> = cardUtil.separateDeck(cards);
      split.forEach((card: Card): undefined => {
        cardUtil.dealToHolder(card, this._playerSlot);
      });
    }

    DeletedItemsContainer.destroyWithoutCopying(deck);

    TI4.events.onFactionChanged.trigger(this._playerSlot);
  }

  remove(): void {
    for (const unpack of this._getPackUnpacks()) {
      unpack.remove();
    }
  }
}
