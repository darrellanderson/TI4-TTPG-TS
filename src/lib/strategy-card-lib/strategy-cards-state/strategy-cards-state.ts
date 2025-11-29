import { GameObject, Player, world } from "@tabletop-playground/api";
import {
  NamespaceId,
  NSID,
  ParsedNSID,
  PlayerSlot,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";
import z from "zod";

const StrategyCardNumberAndStateSchema = z
  .object({
    n: z.number(), // strategy card number
    s: z.string(), // opaque (likely empty or JSON)
  })
  .strict();

export type StrategyCardNumberAndState = z.infer<
  typeof StrategyCardNumberAndStateSchema
>;

const StrategyCardsPersistentDataSchema = z
  .object({
    playerSlotActive: z.array(
      // map would be better but serialization issues
      z
        .object({
          p: z.number(), // player slot
          a: z.array(StrategyCardNumberAndStateSchema), // active
        })
        .strict()
    ),
    strategyCardLastPlayed: z.array(
      z
        .object({
          n: z.number(), // strategy card number
          p: z.number(), // player slot
        })
        .strict()
    ),
  })
  .strict();
type StrategyCardsPersistentData = z.infer<
  typeof StrategyCardsPersistentDataSchema
>;

/**
 * Per-player set of active strategy cards, in order of play.
 */
export class StrategyCardsState {
  public readonly onStrategyCardsStateChanged: TriggerableMulticastDelegate<
    () => void
  > = new TriggerableMulticastDelegate<() => void>();

  private readonly _persistenceKey: NamespaceId;
  private _data: StrategyCardsPersistentData = {
    playerSlotActive: [],
    strategyCardLastPlayed: [],
  };

  private readonly onStrategyCardPlayedHandler = (
    strategyCard: GameObject,
    player: Player
  ): void => {
    const playingPlayerSlot: PlayerSlot = player.getSlot();
    const strategyCardNumber: number | undefined =
      StrategyCardsState.strategyCardToNumber(strategyCard);
    if (strategyCardNumber !== undefined) {
      this.setLastPlayerSlotPlayed(strategyCardNumber, playingPlayerSlot);
      for (const playerSeat of TI4.playerSeats.getAllSeats()) {
        const playerSlot: PlayerSlot = playerSeat.playerSlot;
        this.addOrUpdate(playerSlot, strategyCardNumber, "");
      }
    }
  };

  static strategyCardToNumber(strategyCard: GameObject): number | undefined {
    const nsid: string = NSID.get(strategyCard);
    const parsed: ParsedNSID | undefined = NSID.parse(nsid);
    const firstNamePart: string | undefined = parsed?.nameParts[0];
    if (firstNamePart === "leadership") {
      return 1;
    } else if (firstNamePart === "diplomacy") {
      return 2;
    } else if (firstNamePart === "politics") {
      return 3;
    } else if (firstNamePart === "construction") {
      return 4;
    } else if (firstNamePart === "trade") {
      return 5;
    } else if (firstNamePart === "warfare") {
      return 6;
    } else if (firstNamePart === "technology") {
      return 7;
    } else if (firstNamePart === "imperial") {
      return 8;
    } else if (firstNamePart === "1-lux") {
      return -1;
    } else if (firstNamePart === "2-noctis") {
      return -2;
    } else if (firstNamePart === "3-tyrannus") {
      return -3;
    } else if (firstNamePart === "4-civitas") {
      return -4;
    } else if (firstNamePart === "5-amicus") {
      return -5;
    } else if (firstNamePart === "6-calamitas") {
      return -6;
    } else if (firstNamePart === "7-magus") {
      return -7;
    } else if (firstNamePart === "8-aeterna") {
      return -8;
    }

    return undefined;
  }

  constructor(persistenceKey: NamespaceId) {
    this._persistenceKey = persistenceKey;
    this._load();

    TI4.events.onStrategyCardPlayed.add(this.onStrategyCardPlayedHandler);
  }

  destroy(): void {
    TI4.events.onStrategyCardPlayed.remove(this.onStrategyCardPlayedHandler);
  }

  _save(): void {
    const json: string = JSON.stringify(this._data);
    world.setSavedData(json, this._persistenceKey);
  }

  _load(): void {
    const json: string = world.getSavedData(this._persistenceKey);
    if (json && json.length > 0) {
      console.log("xxx", json);
      const parsed = JSON.parse(json);
      this._data = StrategyCardsPersistentDataSchema.parse(parsed);
    }
  }

  _getMutableActive(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState> {
    for (const entry of this._data.playerSlotActive) {
      if (entry.p === playerSlot) {
        return entry.a;
      }
    }

    const active: Array<StrategyCardNumberAndState> = [];
    this._data.playerSlotActive.push({ p: playerSlot, a: active });
    return active;
  }

  active(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState> {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    return active.map((entry) => {
      // clone
      return {
        n: entry.n,
        s: entry.s,
      };
    });
  }

  addOrUpdate(
    playerSlot: number,
    strategyCardNumber: number,
    state: string
  ): this {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    let strategyCardNumberAndState: StrategyCardNumberAndState | undefined =
      active.find(
        (entry: StrategyCardNumberAndState): boolean =>
          entry.n === strategyCardNumber
      );
    if (!strategyCardNumberAndState) {
      strategyCardNumberAndState = { n: strategyCardNumber, s: state };
      active.push(strategyCardNumberAndState);
    } else {
      strategyCardNumberAndState.s = state;
    }
    this._save();
    this.onStrategyCardsStateChanged.trigger();
    return this;
  }

  remove(playerSlot: number, strategyCardNumber: number): this {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    const index: number = active.findIndex(
      (entry: StrategyCardNumberAndState): boolean =>
        entry.n === strategyCardNumber
    );
    if (index > -1) {
      active.splice(index, 1);
    }
    this._save();
    this.onStrategyCardsStateChanged.trigger();
    return this;
  }

  clear(playerSlot: number): this {
    const active: Array<StrategyCardNumberAndState> =
      this._getMutableActive(playerSlot);
    while (active.length > 0) {
      active.pop();
    }
    this._save();
    this.onStrategyCardsStateChanged.trigger();
    return this;
  }

  setLastPlayerSlotPlayed(
    strategyCardNumber: number,
    playerSlot: PlayerSlot
  ): this {
    let found: boolean = false;
    for (const entry of this._data.strategyCardLastPlayed) {
      if (entry.n === strategyCardNumber) {
        entry.p = playerSlot;
        found = true;
      }
    }
    if (!found) {
      this._data.strategyCardLastPlayed.push({
        n: strategyCardNumber,
        p: playerSlot,
      });
    }
    this._save();
    this.onStrategyCardsStateChanged.trigger();
    return this;
  }

  getLastPlayerSlotPlayed(strategyCardNumber: number): PlayerSlot | undefined {
    for (const entry of this._data.strategyCardLastPlayed) {
      if (entry.n === strategyCardNumber) {
        return entry.p;
      }
    }
    return undefined;
  }
}
