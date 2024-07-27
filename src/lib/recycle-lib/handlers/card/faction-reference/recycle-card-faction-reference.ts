import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardFactionReference extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.faction-reference:")
      .setFaceUp(false)
      .setSnapPointTag("deck-faction-reference");
  }
}
