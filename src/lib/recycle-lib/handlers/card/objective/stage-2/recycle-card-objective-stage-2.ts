import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardObjectiveStage2 extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.objective.public-2:")
      .setFaceUp(false)
      .setSnapPointTag("deck-objective-2");
  }
}
