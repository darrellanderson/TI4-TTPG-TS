import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Atop, Direction, Find, NSID, ParsedNSID } from "ttpg-darrell";

import {
  PlayerSeats,
  PlayerSeatType,
} from "../../player-lib/player-seats/player-seats";
import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";

const STRATEGY_CARD_TO_INITIATIVE: Record<NsidNameSchemaType, number> = {
  leadership: 1,
  diplomacy: 2,
  politics: 3,
  construction: 4,
  trade: 5,
  warfare: 6,
  technology: 7,
  imperial: 8,

  "1-lux": 1,
  "2-noctis": 2,
  "3-tyrannus": 3,
  "4-civitas": 4,
  "5-amicus": 5,
  "6-calamitas": 6,
  "7-magus": 7,
  "8-aeterna": 8,
};

const OTHER_NSID_TO_INITIATIVE: Record<string, number> = {
  "token:base/naalu-zero": 0,
};

export type InitiativeEntry = {
  playerSlot: number;
  initiative: number;
  strategyCards: Array<GameObject>; // all strategy cards in player area
};

export class InitiativeOrder {
  private readonly _find: Find = new Find();
  private readonly _playerSeats: PlayerSeats = new PlayerSeats();

  static getStrategyCardNsidNameFirst(
    obj: GameObject
  ): NsidNameSchemaType | undefined {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.strategy-card:")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed) {
        const nameFirst: string | undefined = parsed.nameParts[0];
        if (nameFirst !== undefined) {
          if (nameFirst in STRATEGY_CARD_TO_INITIATIVE) {
            return nameFirst;
          }
        }
      }
    }
    return undefined;
  }

  _isAtopStrategyCardMat(strategyCard: GameObject): boolean {
    const mat: GameObject | undefined = this._find.findGameObject(
      "mat:base/strategy-card"
    );
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

    let initiative: number | undefined;
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      // Check if strategy card.
      const strategyCardNsidNameFirst: NsidNameSchemaType | undefined =
        InitiativeOrder.getStrategyCardNsidNameFirst(obj);
      if (strategyCardNsidNameFirst) {
        initiative = STRATEGY_CARD_TO_INITIATIVE[strategyCardNsidNameFirst];
        if (initiative !== undefined) {
          if (!this._isAtopStrategyCardMat(obj)) {
            const pos: Vector = obj.getPosition();
            const playerSlot: number =
              this._find.closestOwnedCardHolderOwner(pos);
            addToEntry(playerSlot, initiative, obj);
          }
        }
      }

      // Check if other.
      const nsid: string = NSID.get(obj);
      initiative = OTHER_NSID_TO_INITIATIVE[nsid];
      if (initiative !== undefined) {
        const pos: Vector = obj.getPosition();
        const playerSlot: number = this._find.closestOwnedCardHolderOwner(pos);
        addToEntry(playerSlot, initiative, undefined);
      }
    }

    const result: Array<InitiativeEntry> = [...playerSlotToEntry.values()];
    return result.sort((a, b) => a.initiative - b.initiative);
  }

  setTurnOrderFromStrategyCards(): void {
    const entries: Array<InitiativeEntry> = this.get();
    const order: Array<number> = entries.map((entry) => entry.playerSlot);

    // Any missing player slots.
    const seats: Array<PlayerSeatType> = this._playerSeats.getAllSeats();
    for (const seat of seats) {
      if (!order.includes(seat.playerSlot)) {
        order.push(seat.playerSlot);
      }
    }

    const direction: Direction = "forward";
    const currentTurn: number | undefined = order[0];
    if (currentTurn) {
      TI4.turnOrder.setTurnOrder(order, direction, currentTurn);
    }
  }
}
