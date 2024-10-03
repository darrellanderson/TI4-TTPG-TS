import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardSecret extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.objective.secret:")
      .setSnapPointTag("deck-objective-secret")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
