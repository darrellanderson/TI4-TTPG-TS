import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardEvent extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.event:")
      .setFaceUp(false)
      .setSnapPointTag("deck-event");
  }
}
