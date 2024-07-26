import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardAction extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.action:")
      .setFaceUp(true)
      .setSnapPointTag("discard-action");
  }
}
