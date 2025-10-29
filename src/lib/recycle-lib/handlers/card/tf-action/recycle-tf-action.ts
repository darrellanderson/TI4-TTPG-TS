import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardTfAction extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.tf-action:")
      .setFaceUp(true)
      .setSnapPointTag("discard-action");
  }
}
