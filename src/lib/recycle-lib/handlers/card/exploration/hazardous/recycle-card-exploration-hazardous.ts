import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardExplorationHazardous extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.exploration.hazardous:")
      .setFaceUp(true)
      .setSnapPointTag("discard-exploration-hazardous");
  }
}
