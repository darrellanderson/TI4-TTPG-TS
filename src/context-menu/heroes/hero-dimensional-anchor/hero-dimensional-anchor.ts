import {
  Color,
  GameObject,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { AbstractRightClickCard, Broadcast, HexType, NSID } from "ttpg-darrell";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { RightClickPurge } from "../../right-click-purge/right-click-purge";
import { SystemAdjacency } from "../../../lib/system-lib/system-adjacency/system-adjacency";

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

  _getAdjacentHexes(hexes: Set<HexType>, playerSlot: number): Set<HexType> {
    const adjHexes: Set<HexType> = new Set();
    const systemAdjacency: SystemAdjacency = new SystemAdjacency();
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    for (const hex of hexes) {
      const adjHexes: Set<HexType> = systemAdjacency.getAdjHexes(hex, faction);
      for (const adjHex of adjHexes) {
        adjHexes.add(adjHex);
      }
    }
    return adjHexes;
  }
}
