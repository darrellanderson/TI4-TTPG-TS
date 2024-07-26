import { SimpleToContainerHandler } from "ttpg-darrell";

export class RecycleTokenCommand extends SimpleToContainerHandler {
  constructor() {
    super();
    this.addRecycleObjectNsid("token:base/command")
      .setContainerNsid("container.token:base/command")
      .setRequireOwningPlayerSlot(true);
  }
}
