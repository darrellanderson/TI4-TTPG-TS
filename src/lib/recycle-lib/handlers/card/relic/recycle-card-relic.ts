import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardRelic extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.relic:")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true)
      .setSnapPointTag("deck-relic");
  }
}
