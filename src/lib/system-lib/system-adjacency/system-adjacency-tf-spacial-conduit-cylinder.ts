import { Card, Vector } from "@tabletop-playground/api";
import { Adjacency, Find, HexType } from "ttpg-darrell";
import { System } from "../system/system";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";

/**
 * After you activate a system containing your unit(s):
 * That system is adjacent to all systems with your unit(s).
 */
export class SystemAdjacencyTFSpacialConduitCylinder {
  private readonly _find: Find = new Find();

  public addTags(adjacency: Adjacency): void {
    const nsid: string =
      "card.tf-ability:twilights-fall/spatial-conduit-cylinder";
    TI4.findTracking.trackNsid(nsid);
    const card: Card | undefined = TI4.findTracking.findCard(nsid);

    if (!card) {
      return; // card not in play
    }

    // Is it this player's tactical action?
    const pos: Vector = card.getPosition();
    const owner: number = this._find.closestOwnedCardHolderOwner(pos);
    const activePlayerSlot: number | undefined = TI4.turnOrder.getCurrentTurn();
    if (activePlayerSlot !== owner) {
      return; // active player does not own the card
    }

    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    if (!system) {
      return; // no system activated
    }
    const systemPos: Vector = system.getObj().getPosition();
    const systemHex: HexType = TI4.hex.fromPosition(systemPos);

    const myUnitHexes: Set<HexType> = new Set();
    UnitPlastic.getAll()
      .filter((plastic: UnitPlastic): boolean => {
        const plasticOwner: number = plastic.getOwningPlayerSlot();
        return plasticOwner === owner;
      })
      .forEach((plastic: UnitPlastic): void => {
        const hex: HexType = plastic.getHex();
        myUnitHexes.add(hex);
      });

    if (!myUnitHexes.has(systemHex)) {
      return; // activated system does not contain owner's units
    }
    myUnitHexes.delete(systemHex); // only other systems

    // Activated system contains my units; link to all other systems with my units.
    for (const hex of myUnitHexes) {
      adjacency.addLink({
        src: hex,
        dst: systemHex,
        distance: 1,
        isTransit: false,
      });
      adjacency.addLink({
        src: systemHex,
        dst: hex,
        distance: 1,
        isTransit: false,
      });
    }
  }
}
