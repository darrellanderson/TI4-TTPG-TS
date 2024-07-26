import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardExplorationCultural extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.exploration.cultural:")
      .setFaceUp(true)
      .setSnapPointTag("discard-exploration-cultural");
  }
}
