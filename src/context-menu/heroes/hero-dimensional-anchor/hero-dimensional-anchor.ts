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
import { RightClickRift } from "../../right-click-rift/right-click-rift";

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

    // Hero applies to all dimensional tears, including nekro's.
    const dimensionalTearHexes: Set<HexType> =
      this._getDimensionalTearHexes(true); // include Nekro
    const inAndAdjacentHexes: Set<HexType> = this._getInAndAdjacentHexes(
      dimensionalTearHexes,
      playerSlot
    );

    // Get players blockading the vuil'raith dimensional tears (not Nekro).
    const blockadableHexes: Set<HexType> = this._getDimensionalTearHexes(false); // exclude Nekro
    const hexToShipsIncludingFighters: Map<
      HexType,
      Array<UnitPlastic>
    > = this._getHexToShipsIncludingFighters();
    const blockadingPlayerSlots: Set<PlayerSlot> = new Set([playerSlot]); // exlude self
    for (const hex of blockadableHexes) {
      const ships: Array<UnitPlastic> | undefined =
        hexToShipsIncludingFighters.get(hex);
      if (ships) {
        const owners: Set<PlayerSlot> = this._getShipOwners(ships);
        for (const owner of owners) {
          blockadingPlayerSlots.add(owner);
        }
      }
    }

    // Get non-fighter ships from non-blockading players.
    const nonFighterShips: Array<UnitPlastic> = [];
    for (const hex of inAndAdjacentHexes) {
      const ships: Array<UnitPlastic> | undefined =
        hexToShipsIncludingFighters.get(hex);
      if (ships) {
        const nonFighterShips: Array<UnitPlastic> =
          this._getNonFighterShips(ships);
        const nonBlockadedShips: Array<UnitPlastic> =
          this._getNonBlockadedShips(nonFighterShips, blockadingPlayerSlots);
        nonFighterShips.push(...nonBlockadedShips);
      }
    }

    for (const nonFighterShip of nonFighterShips) {
      const obj: GameObject = nonFighterShip.getObj();
      const rollResult: number = Math.floor(Math.random() * 10) + 1;
      RightClickRift.applyRiftResult(obj, rollResult);
    }

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
  _getInAndAdjacentHexes(
    hexes: Set<HexType>,
    playerSlot: PlayerSlot
  ): Set<HexType> {
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

  _getNonBlockadedShips(
    ships: Array<UnitPlastic>,
    blockadingPlayerSlots: Set<PlayerSlot>
  ): Array<UnitPlastic> {
    return ships.filter((ship) => {
      const owner: PlayerSlot = ship.getOwningPlayerSlot();
      return !blockadingPlayerSlots.has(owner);
    });
  }
}
