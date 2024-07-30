import { GameObject, Vector, world } from "@tabletop-playground/api";
import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
import { Atop, Find, NSID, ParsedNSID } from "ttpg-darrell";

const STRATEGY_CARD_TO_INITIATIVE: Record<NsidNameSchemaType, number> = {
  leadership: 1,
  diplomacy: 2,
  politics: 3,
  construction: 4,
  trade: 5,
  warfare: 6,
  technology: 7,
  imperial: 8,
};

const OTHER_NSID_TO_INITIATIVE: Record<string, number> = {
  "token:base/naalu-zero": 0,
};

export type InitiativeEntry = {
  playerSlot: number;
  initiative: number;
  strategyCards: Array<GameObject>;
};

export class InitiativeOrder {
  private readonly _find: Find = new Find();

  static getStrategyCardNsidNameFirst(
    obj: GameObject
  ): NsidNameSchemaType | undefined {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.strategy:")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      const nameFirst: string | undefined = parsed?.nameParts[0];
      const known: boolean =
        nameFirst !== undefined && nameFirst in STRATEGY_CARD_TO_INITIATIVE;
      if (known) {
        return nameFirst;
      }
    }
    return undefined;
  }

  _isAtopStrategyCardMat(strategyCard: GameObject): boolean {
    const mat: GameObject | undefined =
      this._find.findGameObject("mat:base/strategy");
    if (mat) {
      const atop: Atop = new Atop(mat);
      const pos: Vector = strategyCard.getPosition();
      return atop.isAtop(pos);
    }
    return false;
  }

  get(): Array<InitiativeEntry> {
    const playerSlotToEntry: Map<number, InitiativeEntry> = new Map();
    const addToEntry = (
      playerSlot: number,
      initiative: number,
      strategyCard: GameObject | undefined
    ): void => {
      let entry: InitiativeEntry | undefined =
        playerSlotToEntry.get(playerSlot);
      if (!entry) {
        entry = {
          playerSlot,
          initiative,
          strategyCards: [],
        };
        playerSlotToEntry.set(playerSlot, entry);
      }
      entry.initiative = Math.min(entry.initiative, initiative);
      if (strategyCard) {
        entry.strategyCards.push(strategyCard);
      }
    };

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      // Check if strategy card.
      const strategyCardNsidNameFirst: NsidNameSchemaType | undefined =
        InitiativeOrder.getStrategyCardNsidNameFirst(obj);
      if (strategyCardNsidNameFirst) {
        const initiative: number | undefined =
          STRATEGY_CARD_TO_INITIATIVE[strategyCardNsidNameFirst];
        if (initiative) {
          const pos: Vector = obj.getPosition();
          const playerSlot: number =
            this._find.closestOwnedCardHolderOwner(pos);
          addToEntry(playerSlot, initiative, obj);
        }
      }

      // Check if other.
      const nsid: string = NSID.get(obj);
      const initiative: number | undefined = OTHER_NSID_TO_INITIATIVE[nsid];
      if (initiative !== undefined) {
        const pos: Vector = obj.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
        addToEntry(playerSlot, initiative, undefined);
      }
    }

    const result: Array<InitiativeEntry> = [...playerSlotToEntry.values()];
    return result.sort((a, b) => a.initiative - b.initiative);
  }
}
