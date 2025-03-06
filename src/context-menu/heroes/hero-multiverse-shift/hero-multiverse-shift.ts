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
  Spawn,
} from "ttpg-darrell";
import { RightClickPurge } from "../../right-click-purge/right-click-purge";
import { UnitAttrs } from "../../../lib/unit-lib/unit-attrs/unit-attrs";
import { UnitAttrsSet } from "../../../lib/unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitPlastic } from "../../../lib/unit-lib/unit-plastic/unit-plastic";
import { GlowingToken } from "../../../ui/glowing-token/glowing-token";

/**
 * Empyrean hero Conservator Procyon
 *
 * ACTION: Place 1 frontier token in each system that does not contain any
 * planets and does not already have a frontier token.
 *
 * Then, explore each frontier token that is in a system that contains 1
 * or more of your ships.
 *
 * Then, purge this card.
 */
export class HeroMultiverseShift extends AbstractRightClickCard {
  constructor() {
    const cardNsidPrefix: string = "card.leader.hero:pok/conservator-procyon";
    const customActionName: string = "*Multiverse Shift";
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === customActionName) {
        this._multiverseShift(object, player.getSlot());
      }
    };
    super(cardNsidPrefix, customActionName, customActionHandler);
  }

  _multiverseShift(object: GameObject, playerSlot: number): void {
    const playerName: string = TI4.playerName.getBySlot(playerSlot);
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = `${playerName} executing Multiverse Shift!`;
    Broadcast.chatAll(msg, color);

    const zeroPlanetHexes: Set<HexType> = this._getZeroPlanetHexes();
    const shipHexes: Set<HexType> = this._getShipHexes(playerSlot);
    const alreadyHaveFrontierTokenHexes: Set<HexType> =
      this._getAlreadyHaveFrontierTokenHexes();

    // Prune to only the hexes that contain the player's ships.
    for (const hex of zeroPlanetHexes) {
      if (!shipHexes.has(hex)) {
        zeroPlanetHexes.delete(hex);
      }
    }

    // Add frontier tokens to systems that need them.
    const z = world.getTableHeight() + 10;
    for (const hex of zeroPlanetHexes) {
      if (!alreadyHaveFrontierTokenHexes.has(hex)) {
        const pos: Vector = TI4.hex.toPosition(hex).add([0, -2.5, 0]);
        pos.z = z;
        const obj: GameObject = Spawn.spawnOrThrow(
          "token.attachment.system:pok/frontier",
          pos
        );
        obj.snapToGround();
      }
    }

    // Visualize the frontier tokens that need exploring.
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "token.attachment.system:pok/frontier") {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        if (zeroPlanetHexes.has(hex)) {
          // Visualize the frontier token.
          new GlowingToken(obj);
        }
      }
    }

    new RightClickPurge()._purge(object, playerSlot);
  }

  /**
   * Get all system hexes that do not contain any planets.
   */
  _getZeroPlanetHexes(): Set<HexType> {
    const zeroPlanetHexes: Set<HexType> = new Set();
    const skipContained: boolean = true;
    for (const system of TI4.systemRegistry.getAllSystemsWithObjs(
      skipContained
    )) {
      if (system.getPlanets().length === 0) {
        const obj: GameObject = system.getObj();
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        zeroPlanetHexes.add(hex);
      }
    }
    return zeroPlanetHexes;
  }

  /**
   * Get hexes that already contain frontier tokens.
   */
  _getAlreadyHaveFrontierTokenHexes(): Set<HexType> {
    const alreadyHaveFrontierTokenHexes: Set<HexType> = new Set();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === "token.attachment.system:pok/frontier") {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        alreadyHaveFrontierTokenHexes.add(hex);
      }
    }
    return alreadyHaveFrontierTokenHexes;
  }

  /**
   * Get all system hexes that contain 1 or more of the player's ships.
   *
   * @param playerSlot
   */
  _getShipHexes(playerSlot: number): Set<HexType> {
    const shipHexes: Set<HexType> = new Set();
    const unitAttrsSet: UnitAttrsSet =
      TI4.unitAttrsRegistry.defaultUnitAttrsSet();
    for (const unitPlastic of UnitPlastic.getAll()) {
      const unitAttrs: UnitAttrs | undefined = unitAttrsSet.get(
        unitPlastic.getUnit()
      );
      if (
        unitPlastic.getOwningPlayerSlot() === playerSlot &&
        unitAttrs &&
        unitAttrs.isShip()
      ) {
        const hex: HexType = unitPlastic.getHex();
        shipHexes.add(hex);
      }
    }
    return shipHexes;
  }
}
