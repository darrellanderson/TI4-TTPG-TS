import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardTfAbility extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.tf-ability:")
      .setSnapPointTag("deck-tf-ability")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
