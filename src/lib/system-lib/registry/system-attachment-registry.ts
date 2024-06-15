import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { SystemAttachment } from "../system-attachment/system-attachment";
import {
  NsidNameSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";

type SchemaAndSource = {
  schema: SystemAttachmentSchemaType;
  sourceAndPackageId: SourceAndPackageIdSchemaType;
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

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const schemaAndSource: SchemaAndSource | undefined =
      this._nsidToSchemaAndSource.get(nsid);
    if (schemaAndSource) {
      // Register a fresh system object for this system tile object.
      const systemAttachment: SystemAttachment = new SystemAttachment(
        obj,
        schemaAndSource.sourceAndPackageId,
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
   *
   * Global takes care of calling init, but if any homebrew loads new content
   * it must also be sure to call init to attach any existing tokens.
   */
  init() {
    // Attach (will not re-attach if already attached) system attachments.
    for (const systemAttachment of this._attachmentObjIdToSystemAttachment.values()) {
      systemAttachment.attach();
    }
  }

  /**
   * Define new system attachment types.
   * Call init to attach to existing tokens.
   *
   * @param systemAttachmentSchemaTypes
   * @param source
   * @returns
   */
  public load(
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    systemAttachmentSchemaTypes: Array<SystemAttachmentSchemaType>
  ): this {
    // Find all system attachment objects.
    const nsidToObjIds: Map<string, Array<string>> = new Map();
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("token.attachment.system:")) {
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
        NsidNameSchema.parse(sourceAndPackageId);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          systemAttachmentSchemaType
        )}`;
        throw new Error(msg);
      }

      // Register (create temporary attachment for nsid generation).
      const nsid: string = SystemAttachment.schemaToNsid(
        sourceAndPackageId.source,
        systemAttachmentSchemaType
      );
      this._nsidToSchemaAndSource.set(nsid, {
        sourceAndPackageId,
        schema: systemAttachmentSchemaType,
      });

      // Instantiate for any existing objects.
      const objIds: Array<string> = nsidToObjIds.get(nsid) ?? [];
      for (const objId of objIds) {
        const obj: GameObject | undefined = world.getObjectById(objId);
        if (obj && obj.isValid()) {
          const attachment = new SystemAttachment(
            obj,
            sourceAndPackageId,
            systemAttachmentSchemaType
          );
          this._attachmentObjIdToSystemAttachment.set(objId, attachment);

          // Add grab/release event listeners.
          obj.onGrab.remove(this._onGrabHandler);
          obj.onGrab.add(this._onGrabHandler);
          obj.onReleased.remove(this._onReleasedHandler);
          obj.onReleased.add(this._onReleasedHandler);
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
