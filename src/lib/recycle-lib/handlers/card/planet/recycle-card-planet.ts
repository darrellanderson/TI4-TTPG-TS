import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardPlanet extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.planet:")
      .setFaceUp(false)
      .setSnapPointTag("deck-planet");
  }
}
