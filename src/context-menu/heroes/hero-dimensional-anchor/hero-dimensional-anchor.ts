import {
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  HexType,
  NSID,
  PlayerSlot,
} from "ttpg-darrell";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { RightClickPurge } from "../../right-click-purge/right-click-purge";
import { SystemAdjacency } from "../../../lib/system-lib/system-adjacency/system-adjacency";
import { UnitAttrs } from "../../../lib/unit-lib/unit-attrs/unit-attrs";
import { UnitAttrsSet } from "../../../lib/unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";

/**
 * Vuil'Raith hero It Feeds on Carrion
 *
 * ACTION: Each other player rolls a die for each of their non-fighter ships
 * that are in or adjacent to a system that contains a dimensional tear; on a
 * 1-3, capture that unit.
 *
 * If this causes a player's ground forces or fighters to be removed, also
 * capture those units.
 *
 * Then, purge this card.
 *
 * NOTES:
 *
 * If a player is blockading a vuil'raith system, they are immune.
 * Ugh, except if Nekro copies, the nekro versions do not count as blockade.
 */
export class HeroDimensionalAnchor extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.leader.hero:pok/it-feeds-on-carrion";
    const customActionName: string = "*Dimensional Anchor";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._dimensionalAnchor(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _dimensionalAnchor(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Dimensional Anchor!`;
    Broadcast.chatAll(msg, color);

    // TODO

    new RightClickPurge()._purge(object, playerSlot);
  }

  /**
   * Get hexes with dimensional tears.
   *
   * @param includeNekro
   * @returns
   */
  _getDimensionalTearHexes(includeNekro: boolean): Set<HexType> {
    const hexes: Set<HexType> = new Set();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === "token.attachment.system:pok/dimensional-tear.vuilraith" ||
        (includeNekro &&
          nsid === "token.attachment.system:pok/dimensional-tear.nekro")
      ) {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        hexes.add(hex);
      }
    }
    return hexes;
  }

  /**
   * Get hexes adjacent to the given hexes (including the source hexes).
   *
   * @param hexes
   * @param playerSlot
   * @returns
   */
  _getAdjacentHexes(hexes: Set<HexType>, playerSlot: PlayerSlot): Set<HexType> {
    const allAdjHexes: Set<HexType> = new Set(hexes); // include original hexes
    const systemAdjacency: SystemAdjacency = new SystemAdjacency();
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    for (const hex of hexes) {
      const adjHexes: Set<HexType> = systemAdjacency.getAdjHexes(hex, faction);
      for (const adjHex of adjHexes) {
        allAdjHexes.add(adjHex);
      }
    }
    return allAdjHexes;
  }

  /**
   * Get hexes and ships (get plastics).
   * Include fighters here to detect blockages, remove them for the final list.
   *
   * @returns
   */
  _getHexToShipsIncludingFighters(): Map<HexType, Array<UnitPlastic>> {
    const hexToNonFighterShips: Map<HexType, Array<UnitPlastic>> = new Map();
    const unitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
    for (const unitPlastic of unitPlastics) {
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
        unitPlastic.getUnit()
      );
      if (unitAttrs && unitAttrs.isShip()) {
        const hex: HexType = unitPlastic.getHex();
        let unitPlastics: Array<UnitPlastic> | undefined =
          hexToNonFighterShips.get(hex);
        if (!unitPlastics) {
          unitPlastics = [];
          hexToNonFighterShips.set(hex, unitPlastics);
        }
        unitPlastics.push(unitPlastic);
      }
    }
    return hexToNonFighterShips;
  }

  _getShipOwners(ships: Array<UnitPlastic>): Set<PlayerSlot> {
    const owners: Set<PlayerSlot> = new Set();
    for (const ship of ships) {
      const owner: PlayerSlot = ship.getOwningPlayerSlot();
      owners.add(owner);
    }
    return owners;
  }

  _getNonFighterShips(ships: Array<UnitPlastic>): Array<UnitPlastic> {
    return ships.filter((ship) => {
      return ship.getUnit() !== "fighter";
    });
  }
}
