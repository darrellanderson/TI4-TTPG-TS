import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardObjectiveStage1 extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.objective.stage-1:")
      .setFaceUp(false)
      .setSnapPointTag("deck-objective-stage-1");
  }
}
