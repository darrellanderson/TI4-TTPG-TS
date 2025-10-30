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
import { UnpackHomeSystem } from "../../faction-lib/unpack/unpack-home-system/unpack-home-system";
import { UnpackHomePlanetCards } from "../../faction-lib/unpack/unpack-home-planet-cards/unpack-home-planet-cards";

const ACTION_NAME: string = "*TF Unpack home system";

class RightClickTfUnpackHomeSystem extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.faction-reference:";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME) {
        this._unpackHomeSystem(object, player);
      }
    };
    super(cardNsidPrefix, ACTION_NAME, customActionHandler);
  }

  _unpackHomeSystem(object: GameObject, player: Player): void {
    const nsid: string = NSID.get(object);
    const playerSlot: number = player.getSlot();

    const overriddenTile: number | undefined =
      Faction.getOverrideHomeSystemTileNumber(playerSlot);
    if (overriddenTile !== undefined) {
      Broadcast.chatOne(
        player,
        "Home system already unpacked",
        Broadcast.ERROR
      );
      return;
    }

    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    if (parsed) {
      const nsidName: string | undefined = parsed.nameParts[0];
      if (nsidName) {
        const faction: Faction | undefined =
          TI4.factionRegistry.getByNsidName(nsidName);
        if (faction) {
          new TFUnpackHomeSystem(faction, playerSlot).unpack();
        }
      }
    }
  }
}

export class TFUnpackHomeSystem {
  private readonly _faction: Faction;
  private readonly _playerSlot: number;

  static addContextMenuToFactionReferenceCards(): void {
    new RightClickTfUnpackHomeSystem().init();
  }

  constructor(faction: Faction, playerSlot: number) {
    this._faction = faction;
    this._playerSlot = playerSlot;
  }

  unpack(): void {
    new UnpackHomeSystem(this._faction, this._playerSlot).unpack();
    new UnpackHomePlanetCards(this._faction, this._playerSlot).unpack();

    // Tell the faction to find THIS home system tile.
    const playerSlot: number = this._playerSlot;
    const tileNumber: number = this._faction.getHomeSystemTileNumber();
    Faction.setOverrideHomeSystemTileNumber(playerSlot, tileNumber);

    let echoCardNsid: string | undefined = undefined;
    const tile: number = this._faction.getHomeSystemTileNumber();
    if (tile === 51) {
      echoCardNsid = "card.tf-echo:twilights-fall/echo-of-sacrifice";
    } else if (tile === 118) {
      echoCardNsid = "card.tf-echo:twilights-fall/echo-of-divergence";
    }

    if (echoCardNsid) {
      const deck: Card =
        TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.tf-echo:");
      const cardUtil: CardUtil = new CardUtil();
      const card: Card | undefined = cardUtil.filterCards(
        deck,
        (nsid: string): boolean => {
          return nsid === echoCardNsid;
        }
      );
      if (card) {
        cardUtil.dealToHolder(card, this._playerSlot);
      }
      DeletedItemsContainer.destroyWithoutCopying(deck);
    }
  }
}
