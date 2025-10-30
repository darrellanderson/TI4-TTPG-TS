import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardTfEdict extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.tf-edict:")
      .setFaceUp(true)
      .setShuffleAfterDiscard(true) // edicts shuffle back in
      .setSnapPointTag("deck-agenda");
  }
}
