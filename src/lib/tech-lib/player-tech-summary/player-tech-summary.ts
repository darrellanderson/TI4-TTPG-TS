import { Vector, world } from "@tabletop-playground/api";
import { CardUtil, Find, NSID } from "ttpg-darrell";
import { Tech } from "../tech/tech";
import { TechColorType } from "../schema/tech-schema";

export class PlayerTechSummary {
  private readonly _cardUtil: CardUtil = new CardUtil();
  private readonly _find: Find = new Find();

  private readonly _ownedTechNsids: Set<string>;
  private readonly _techColorToOwnedCount: Map<TechColorType, number>;

  static _getOwnedTechs(playerSlot: number): Array<Tech> {
    const cardUtil: CardUtil = new CardUtil();
    const find: Find = new Find();

    // Get techs owned by the player.
    const techs: Array<Tech> = [];
    const skipContained: boolean = true;
    const allowFaceDown: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("card.technology.") &&
        cardUtil.isLooseCard(obj, allowFaceDown)
      ) {
        const pos: Vector = obj.getPosition();
        const owner: number = find.closestOwnedCardHolderOwner(pos);
        if (owner === playerSlot) {
          const tech: Tech | undefined = TI4.techRegistry.getByNsid(nsid);
          if (tech) {
            techs.push(tech);
          }
        }
      }
    }
    return techs;
  }

  constructor(playerSlot: number) {
    // Get all owned techs for the player.
    const techs: Array<Tech> = PlayerTechSummary._getOwnedTechs(playerSlot);
    const techNsids: Array<string> = techs.map((tech: Tech): string => {
      return tech.getNsid();
    });

    this._ownedTechNsids = new Set<string>(techNsids);

    this._techColorToOwnedCount = new Map<TechColorType, number>();
    for (const tech of techs) {
      const color: TechColorType = tech.getColor();
      const count: number = this._techColorToOwnedCount.get(color) ?? 0;
      this._techColorToOwnedCount.set(color, count + 1);
    }
  }

  isOwned(techNsid: string): boolean {
    return this._ownedTechNsids.has(techNsid);
  }

  getOwnedCount(color: TechColorType): number {
    return this._techColorToOwnedCount.get(color) ?? 0;
  }
}
