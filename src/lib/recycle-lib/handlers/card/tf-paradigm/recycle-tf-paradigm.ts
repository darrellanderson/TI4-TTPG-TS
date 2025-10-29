import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardTfParadigm extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.tf-paradigm:")
      .setSnapPointTag("deck-tf-paradigm")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
