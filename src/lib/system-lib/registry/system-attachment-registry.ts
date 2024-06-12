import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { NSID } from "ttpg-darrell";

export class SystemAttachmentRegistry {
  private readonly _nsidToSystemAttachment: Map<string, SystemAttachment> =
    new Map();

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const systemAttachment: SystemAttachment | undefined =
      this._nsidToSystemAttachment.get(nsid);
    if (systemAttachment) {
      systemAttachment.setAttachmentObjId(obj.getId());
    }
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const systemAttachment: SystemAttachment | undefined =
      this._nsidToSystemAttachment.get(nsid);
    if (systemAttachment) {
      systemAttachment.setAttachmentObjId(undefined);
    }
  };

  constructor() {
    globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
    globalEvents.onObjectDestroyed.add(this._onObjectDestroyedHandler);
  }

  destroy() {
    globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
    globalEvents.onObjectDestroyed.remove(this._onObjectDestroyedHandler);
  }
}
