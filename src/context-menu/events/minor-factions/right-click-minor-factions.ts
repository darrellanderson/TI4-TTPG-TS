import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  CardUtil,
  DeletedItemsContainer,
  NSID,
  PlayerSlot,
  Shuffle,
  Spawn,
} from "ttpg-darrell";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";
import { System } from "../../../lib/system-lib/system/system";

export const MINOR_FACTIONS_ACTION_NAME: string = "*Deal home systems";

/**
 * Give each player:
 * - one unused home system,
 * - linked alliance card,
 * - 3 neutral infantry
 *
 * Minor faction planets have all traits.
 */
export class RightClickMinorFactions extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.event:codex.liberation/minor-factions";
    const customActionHandler = (
      _object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === MINOR_FACTIONS_ACTION_NAME) {
        const playerName: string = TI4.playerName.getByPlayer(player);
        const msg: string = `${playerName} dealing minor faction home systems.`;
        Broadcast.chatAll(msg);

        this._dealHomeSystemTiles();
      }
    };
    super(cardNsidPrefix, MINOR_FACTIONS_ACTION_NAME, customActionHandler);
  }

  _getInPlayFactionHomeSystemNsids(): Set<string> {
    // Using nsids is better than factions b/c Keleres.
    const inPlayHomeSystemNsids: Set<string> = new Set();

    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      if (system.isHome()) {
        const nsid: string = NSID.get(system.getObj());
        inPlayHomeSystemNsids.add(nsid);
      }
    }
    return inPlayHomeSystemNsids;
  }

  _getAllHomeSystemTileNsids(): Set<string> {
    const result: Set<string> = new Set();
    TI4.factionRegistry
      .getAllFactionsFilteredByConfigSources()
      .forEach((faction: Faction): void => {
        const surrogate: number = faction.getHomeSurrogateTileNumber();
        const tile: number = faction.getHomeSystemTileNumber();
        const nsid: string | undefined =
          TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
        // Ignore homes with surrogate tiles, gets complicated.
        if (surrogate < 0 && nsid) {
          result.add(nsid);
        }
      });
    return result;
  }

  _getAvailableHomeSystemNsids(): Array<string> {
    const allHomeSystemNsids: Set<string> = this._getAllHomeSystemTileNsids();
    const inPlayHomeSystemNsids: Set<string> =
      this._getInPlayFactionHomeSystemNsids();

    const availableNsids: Array<string> = Array.from(allHomeSystemNsids).filter(
      (nsid: string): boolean => {
        return !inPlayHomeSystemNsids.has(nsid);
      }
    );
    return availableNsids;
  }

  _getHomeSystemTiles(count: number): Array<GameObject> {
    const availableNsids: Array<string> = new Shuffle<string>().shuffle(
      this._getAvailableHomeSystemNsids()
    );

    // Get the requested number of system tiles.
    // Let spawn fail, might be bad homebrew.
    const systemTileObjs: Array<GameObject> = [];
    while (systemTileObjs.length < count && availableNsids.length > 0) {
      const nsid: string | undefined = availableNsids.pop();
      if (nsid) {
        const systemTileObj: GameObject | undefined = Spawn.spawn(nsid);
        if (systemTileObj) {
          systemTileObjs.push(systemTileObj);
        }
      }
    }

    return systemTileObjs;
  }

  _dealHomeSystemTiles(): void {
    const systemTileObjs: Array<GameObject> = this._getHomeSystemTiles(
      TI4.config.playerCount
    );

    TI4.playerSeats
      .getAllSeats()
      .forEach((seat: PlayerSeatType, seatIndex: number): void => {
        const playerSlot: PlayerSlot = seat.playerSlot;
        const pos: Vector = TI4.playerSeats.getDealPosition(playerSlot);
        const systemTileObj: GameObject | undefined = systemTileObjs[seatIndex];
        if (systemTileObj) {
          systemTileObj.setPosition(pos);
          systemTileObj.snapToGround();
        }
      });

    RightClickMinorFactions.dealAllianceCards(systemTileObjs);
  }

  static dealAllianceCards(systemTileObjs: Array<GameObject>): void {
    const cardUtil: CardUtil = new CardUtil();

    // Spawn alliance deck.
    const nsids: Array<string> = Spawn.getAllNsids().filter((nsid: string) =>
      nsid.startsWith("card.alliance:")
    );
    const deck: Card = Spawn.spawnMergeDecksOrThrow(nsids);

    // Remove any sources/nsids based on game config.
    TI4.removeRegistry.createRemoveFromRegistryAndConfig().removeOne(deck);

    for (const systemTileObj of systemTileObjs) {
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileObjId(systemTileObj.getId());
      if (system) {
        const tile: number = system.getSystemTileNumber();
        const faction: Faction | undefined =
          TI4.factionRegistry.getByHomeSystemTileNumber(tile);
        if (faction) {
          const allianceCardNsids: Array<string> = faction.getAllianceNsids();
          const card: Card | undefined = cardUtil.filterCards(
            deck,
            (nsid: string): boolean => {
              return allianceCardNsids.includes(nsid);
            }
          );
          RightClickMinorFactions._dealAllianceCard(card, systemTileObj);
        }
        RightClickMinorFactions._enableAllTraits(system);
      }
    }

    DeletedItemsContainer.destroyWithoutCopying(deck);
  }

  static _dealAllianceCard(
    card: Card | undefined,
    systemTileObj: GameObject
  ): void {
    if (card) {
      const above = systemTileObj.getPosition().add([0, 0, 10]);
      card.setRotation([0, 0, 180]);
      card.setPosition(above);
      card.snapToGround();
    }
  }

  static _enableAllTraits(system: System): void {
    system.getObj().setSavedData("true", "minorFactionsTraits");
    TI4.events.onSystemChanged.trigger(system);
  }
}
