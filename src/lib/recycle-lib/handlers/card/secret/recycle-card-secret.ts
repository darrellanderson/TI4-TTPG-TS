import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardSecret extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.secret:")
      .setSnapPointTag("deck-secret")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
