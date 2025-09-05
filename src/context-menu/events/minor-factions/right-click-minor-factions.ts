import { Card, GameObject, Player, Vector } from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  CardUtil,
  DeletedItemsContainer,
  Find,
  NSID,
  PlayerSlot,
  Shuffle,
} from "ttpg-darrell";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { PlayerSeatType } from "../../../lib/player-lib/player-seats/player-seats";
import { System } from "../../../lib/system-lib/system/system";

export const ACTION_DEAL_HOME_SYSTEMS: string = "*Deal home systems";
export const ACTION_DEAL_ALLIANCE_CARDS: string = "*Deal alliance cards";

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
      if (identifier === ACTION_DEAL_HOME_SYSTEMS) {
        const playerName: string = TI4.playerName.getByPlayer(player);
        const msg: string = `${playerName} dealing minor faction home systems.`;
        Broadcast.chatAll(msg);

        const systemTileObjs: Array<GameObject> = this._dealHomeSystemTiles();
        RightClickMinorFactions.dealAllianceCards(systemTileObjs);
        RightClickMinorFactions.enableExplorationTraits(systemTileObjs);
      } else if (identifier === ACTION_DEAL_ALLIANCE_CARDS) {
        const systemTileObjs: Array<GameObject> =
          this._findMinorFactionSystemTileObjs();
        RightClickMinorFactions.dealAllianceCards(systemTileObjs);
        RightClickMinorFactions.enableExplorationTraits(systemTileObjs);
      }
    };
    super(cardNsidPrefix, ACTION_DEAL_HOME_SYSTEMS, customActionHandler);
    this.addCustomActionName(ACTION_DEAL_ALLIANCE_CARDS);
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
        const systemTileObj: GameObject | undefined = TI4.spawn.spawn(nsid);
        if (systemTileObj) {
          systemTileObjs.push(systemTileObj);
        }
      }
    }

    return systemTileObjs;
  }

  _dealHomeSystemTiles(): Array<GameObject> {
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

    return systemTileObjs;
  }

  /**
   * Find minor faction home system tiles: home system tiles without a faction sheet.
   *
   * @param count
   * @returns
   */
  _findMinorFactionSystemTileObjs(): Array<GameObject> {
    const systemTileObjs: Array<GameObject> = [];
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      const faction: Faction | undefined =
        TI4.factionRegistry.getByHomeSystemTileNumber(
          system.getSystemTileNumber()
        );
      if (faction) {
        const factionSheetNsid: string = faction.getFactionSheetNsid();
        const factionSheet: GameObject | undefined = new Find().findGameObject(
          factionSheetNsid,
          undefined,
          skipContained
        );
        if (!factionSheet) {
          systemTileObjs.push(system.getObj());
        }
      }
    }
    return systemTileObjs;
  }

  static dealAllianceCards(systemTileObjs: Array<GameObject>): void {
    const cardUtil: CardUtil = new CardUtil();

    // Spawn alliance deck.
    const deck: Card =
      TI4.spawn.spawnMergeDecksWithNsidPrefixOrThrow("card.alliance:");

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

  static enableExplorationTraits(systemTileObjs: Array<GameObject>): void {
    for (const systemTileObj of systemTileObjs) {
      RightClickMinorFactions._enableAllTraits(systemTileObj);
    }
  }

  static _enableAllTraits(systemTileObj: GameObject): void {
    systemTileObj.setSavedData("true", "minorFactionsTraits");
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      systemTileObj.getId()
    );
    if (system) {
      TI4.events.onSystemChanged.trigger(system);
    }
  }
}
