import { GameObject } from "@tabletop-playground/api";
import { GarbageHandler, NSID } from "ttpg-darrell";

import { ReturnStrategyCard } from "../../../strategy-card-lib/return-strategy-card/return-strategy-card";

export class RecycleStrategyCard extends GarbageHandler {
  private readonly _returnStrategyCard: ReturnStrategyCard =
    new ReturnStrategyCard();

  canRecycle(obj: GameObject): boolean {
    const nsid: string = NSID.get(obj);
    return nsid.startsWith("tile.strategy:");
  }

  recycle(obj: GameObject): boolean {
    return this._returnStrategyCard.returnStrategyCard(obj);
  }
}
