import { SimpleToContainerHandler } from "ttpg-darrell";

export class RecycleTokenControl extends SimpleToContainerHandler {
  constructor() {
    super();
    this.addRecycleObjectNsid("token:base/control")
      .setContainerNsid("container.token:base/control")
      .setRequireOwningPlayerSlot(true);
  }
}
