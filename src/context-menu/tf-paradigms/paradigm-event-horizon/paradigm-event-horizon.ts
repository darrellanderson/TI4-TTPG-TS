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
 * Vuil'Raith Paradigm Event Horizon
 *
 * ACTION: Each other player rolls a die for each of their non-fighter ships
 * that are in or adjacent to a system that contains a gravity rift; on a
 * 1-5, return that unit to their reinforcements.
 *
 * Then, purge this card.
 */
export class ParadigmEventHorizon extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.tf-paradigm:twilights-fall/event-horizon";
    const customActionName: string = "*Event Horizon";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._paradigmEventHorizon(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _paradigmEventHorizon(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Event Horizon!`;
    Broadcast.chatAll(msg, color);

    // Hero applies to all gravity rifts, including all dimensional tears.
    const dimensionalTearHexes: Set<HexType> =
      this._getDimensionalTearHexes(true); // include Nekro
    const gravityRiftHexes: Set<HexType> = this._getGravityRiftHexes();
    const allRiftHexes: Set<HexType> =
      new Set([...dimensionalTearHexes, ...gravityRiftHexes]);
    const inAndAdjacentHexes: Set<HexType> = this._getInAndAdjacentHexes(
      allRiftHexes,
      playerSlot
    );

    const hexToNonFighterShips: Map<HexType, Array<UnitPlastic>> =
      this._getHexToNonFighterShips();

    // Get non-fighter ships that don't belong to the player
    const allNonFighterShips: Array<UnitPlastic> = [];
    for (const hex of inAndAdjacentHexes) {
      const ships: Array<UnitPlastic> | undefined =
        hexToNonFighterShips.get(hex);
      if (ships) {
        const opponentShips = ships.filter(
          (ship) => ship.getOwningPlayerSlot() !== playerSlot
        );
        allNonFighterShips.push(...opponentShips);
      }
    }

    for (const nonFighterShip of allNonFighterShips) {
      const obj: GameObject = nonFighterShip.getObj();
      const rollResult: number = Math.floor(Math.random() * 10) + 1;
      RightClickRift.applyRiftResult(obj, rollResult, 6); // ships are returned on 1-5, which is <= 6
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
   * Get hexes with gravity rifts.
   *
   * @returns
   */
  _getGravityRiftHexes(): Set<HexType> {
    const hexes: Set<HexType> = new Set();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (RightClickRift.isRiftSystemTile(obj)) {
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
   * Only includes non-fighter ships.
   *
   * @returns
   */
  _getHexToNonFighterShips(): Map<HexType, Array<UnitPlastic>> {
    const hexToShips: Map<HexType, Array<UnitPlastic>> = new Map();
    const unitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll();
    for (const unitPlastic of unitPlastics) {
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
        unitPlastic.getUnit()
      );
      if (unitAttrs && unitAttrs.isShip() && unitPlastic.getUnit() !== "fighter") {
        const hex: HexType = unitPlastic.getHex();
        let ships: Array<UnitPlastic> | undefined = hexToShips.get(hex);
        if (!ships) {
          ships = [];
          hexToShips.set(hex, ships);
        }
        ships.push(unitPlastic);
      }
    }
    return hexToShips;
  }
}
