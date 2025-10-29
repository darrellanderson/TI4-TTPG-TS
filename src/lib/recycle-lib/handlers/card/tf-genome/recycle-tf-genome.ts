import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardTfGenome extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.tf-genome:")
      .setSnapPointTag("deck-tf-genome")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
