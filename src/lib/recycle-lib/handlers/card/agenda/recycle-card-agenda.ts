import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardAgenda extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.agenda:")
      .setFaceUp(true)
      .setSnapPointTag("discard-agenda");
  }
}
