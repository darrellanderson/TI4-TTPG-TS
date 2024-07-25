import { SimpleCardGarbageHandler } from "ttpg-darrell";

export class RecycleCardAction extends SimpleCardGarbageHandler {
  constructor() {
    super();
    this.setCardNsidPrefix("card.action:").setSnapPointTag("discard-action");
  }
}
