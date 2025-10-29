import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardTfUnitUpgrade extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.tf-unit-upgrade:")
      .setSnapPointTag("deck-tf-unit-upgrade")
      .setFaceUp(false)
      .setShuffleAfterDiscard(true);
  }
}
