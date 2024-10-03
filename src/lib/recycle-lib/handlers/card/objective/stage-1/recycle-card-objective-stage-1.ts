import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardObjectiveStage1 extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.objective.public-1:")
      .setFaceUp(false)
      .setSnapPointTag("deck-objective-1");
  }
}
