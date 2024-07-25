import { SimpleToContainerHandler } from "ttpg-darrell";

export class RecycleCommandToken extends SimpleToContainerHandler {
  constructor() {
    super();
    this.addRecycleObjectNsid("token:base/command")
      .setContainerNsid("container.token:base/command")
      .setRequireOwningPlayerSlot(true);
  }
}
