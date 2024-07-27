import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardLegendaryPlanet extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.legendary-planet:")
      .setFaceUp(false)
      .setSnapPointTag("deck-legendary-planet");
  }
}
