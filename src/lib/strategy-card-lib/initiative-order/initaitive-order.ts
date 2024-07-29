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
  strategyCardNsidNames: Array<NsidNameSchemaType>;
};

export class InitiativeOrder {
  private readonly _find: Find = new Find();

  _isAtopStrategyCardMat(strategyCard: GameObject): boolean {
    const mat: GameObject | undefined =
      this._find.findGameObject("mat:base/.strategy");
    if (mat) {
      const atop: Atop = new Atop(mat);
      const pos: Vector = strategyCard.getPosition();
      return atop.isAtop(pos);
    }
    return false;
  }

  _getStrategyCardNsidName(obj: GameObject): NsidNameSchemaType | undefined {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.strategy:")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed) {
        const nameFirst: string | undefined = parsed.nameParts[0];
        if (nameFirst) {
          if (nameFirst in STRATEGY_CARD_TO_INITIATIVE) {
            return nameFirst;
          }
        }
      }
    }
    return undefined;
  }

  get(): Array<InitiativeEntry> {
    const playerSlotToEntry: Map<number, InitiativeEntry> = new Map();

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const strategyCardNsidName: NsidNameSchemaType | undefined =
        this._getStrategyCardNsidName(obj);
      if (strategyCardNsidName) {
        const pos: Vector = obj.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
        let entry: InitiativeEntry | undefined = playerSlotToEntry.get(playerSlot)
        if (!entry) {
            entry = {
                playerSlot,
                initiative: STRATEGY_CARD_TO_INITIATIVE[strategyCardNsidName],
                strategyCardNsidNames: [strategyCardNsidName],
                };
            }
        }
        }
      }
    }

    const result: Array<InitiativeEntry> = [...playerSlotToEntry.values()];
    return result.sort((a, b) => a.initiative - b.initiative);
  }
}
