import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardAction extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.secret:")
      .setSnapPointTag("discard-secret")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
