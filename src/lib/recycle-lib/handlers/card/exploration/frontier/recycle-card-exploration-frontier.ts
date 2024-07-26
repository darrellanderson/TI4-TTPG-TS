import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardExplorationFrontier extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.exploration.frontier:")
      .setFaceUp(true)
      .setSnapPointTag("discard-exploration-frontier");
  }
}
