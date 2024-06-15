import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { SystemAttachment } from "../system-attachment/system-attachment";
import { NsidNameSchema } from "../schema/basic-types-schema";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";

type SchemaAndSource = {
  schema: SystemAttachmentSchemaType;
  source: string;
};

export class SystemAttachmentRegistry {
  private readonly _nsidToSchemaAndSource: Map<string, SchemaAndSource> =
    new Map();

  // Instantiate per relevant game object.  There "shoud not" be duplicates,
  // but that cannot be enforced.  If a copy exists, have a separate instance.
  private readonly _attachmentObjIdToSystemAttachment: Map<
    string,
    SystemAttachment
  > = new Map();

  private _initCalled: boolean = false;

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const schemaAndSource: SchemaAndSource | undefined =
      this._nsidToSchemaAndSource.get(nsid);
    if (schemaAndSource) {
      // Register a fresh system object for this system tile object.
      const systemAttachment: SystemAttachment = new SystemAttachment(
        obj,
        schemaAndSource.source,
        schemaAndSource.schema
      );
      this._attachmentObjIdToSystemAttachment.set(
        obj.getId(),
        systemAttachment
      );

      // Add grab/release event listeners.
      obj.onGrab.remove(this._onGrabHandler);
      obj.onGrab.add(this._onGrabHandler);
      obj.onReleased.remove(this._onReleasedHandler);
      obj.onReleased.add(this._onReleasedHandler);
    }
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const objId: string = obj.getId();
    if (this._attachmentObjIdToSystemAttachment.has(objId)) {
      this._attachmentObjIdToSystemAttachment.delete(objId);
      obj.onGrab.remove(this._onGrabHandler);
      obj.onReleased.remove(this._onReleasedHandler);
    }
  };

  private readonly _onGrabHandler = (obj: GameObject): void => {
    // Remove attachment from system.
    const systemAttachment: SystemAttachment | undefined =
      this._attachmentObjIdToSystemAttachment.get(obj.getId());
    if (systemAttachment) {
      systemAttachment.detach();
    }
  };

  private readonly _onReleasedHandler = (obj: GameObject): void => {
    // Add attachment to system.
    const systemAttachment: SystemAttachment | undefined =
      this._attachmentObjIdToSystemAttachment.get(obj.getId());
    if (systemAttachment) {
      systemAttachment.attach();
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

  /**
   * Add system attachments to systems.
   *
   * Init runs after setting up other objects, in this case we need system
   * registry to have loaded system data for finding by positon.
   */
  init() {
    this._initCalled = true;

    // If any attachments are not yet attached, attach them.
    for (const systemAttachment of this._attachmentObjIdToSystemAttachment.values()) {
      systemAttachment.attach();
    }
  }

  public load(
    systemAttachmentSchemaTypes: Array<SystemAttachmentSchemaType>,
    source: string
  ): this {
    // Find all system attachment objects.
    const nsidToObjIds: Map<string, Array<string>> = new Map();
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("token.attachment:")) {
        let objIds: Array<string> | undefined = nsidToObjIds.get(nsid);
        if (!objIds) {
          objIds = [];
          nsidToObjIds.set(nsid, objIds);
        }
        objIds.push(obj.getId());
      }
    }

    for (const systemAttachmentSchemaType of systemAttachmentSchemaTypes) {
      // Validate schema (oterhwise not validated until used).
      try {
        SystemAttachmentSchema.parse(systemAttachmentSchemaType);
        NsidNameSchema.parse(source);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          systemAttachmentSchemaType
        )}`;
        throw new Error(msg);
      }

      // Register (create temporary attachment for nsid generation).

      this._nsidToSchemaAndSource.set(attachment.getNsid(), {
        schema: systemAttachmentSchemaType,
        source,
      });

      // Instantiate for any existing objects.
      const objIds: Array<string> =
        nsidToObjIds.get(attachment.getNsid()) ?? [];
      for (const objId of objIds) {
        const obj: GameObject | undefined = world.getObjectById(objId);
        if (obj && obj.isValid()) {
          const attachment = new SystemAttachment(
            systemAttachmentSchemaType,
            source
          );
          attachment.setAttachmentObjId(objId);
          this._attachmentObjIdToSystemAttachment.set(objId, attachment);

          // Add grab/release event listeners.
          obj.onGrab.remove(this._onGrabHandler);
          obj.onGrab.add(this._onGrabHandler);
          obj.onReleased.remove(this._onReleasedHandler);
          obj.onReleased.add(this._onReleasedHandler);

          // Init attaches tokens (other systems have had a chance to load).
          // If init has already been called, attach now.
          if (this._initCalled) {
            attachment.attach();
          }
        }
      }
    }
    return this;
  }

  /**
   * Lookup system attachment by system attachment token object nsid.
   * Duplicate tokens for the "same" attachment have separate instances.
   *
   * @param objId
   * @returns
   */
  public getBySystemAttachmentObjId(
    objId: string
  ): SystemAttachment | undefined {
    return this._attachmentObjIdToSystemAttachment.get(objId);
  }
}
