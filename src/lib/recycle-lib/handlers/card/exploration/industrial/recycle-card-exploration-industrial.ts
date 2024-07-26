import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardExplorationIndustrial extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.exploration.industrial:")
      .setFaceUp(true)
      .setSnapPointTag("discard-exploration-industrial");
  }
}
