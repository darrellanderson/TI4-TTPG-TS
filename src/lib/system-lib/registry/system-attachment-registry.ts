import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { NSID } from "ttpg-darrell";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";
import { NsidNameSchema } from "../schema/basic-types-schema";

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

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const schemaAndSource: SchemaAndSource | undefined =
      this._nsidToSchemaAndSource.get(nsid);
    if (schemaAndSource) {
      // Register a fresh system object for this system tile object.
      const systemAttachment: SystemAttachment = new SystemAttachment(
        schemaAndSource.schema,
        schemaAndSource.source
      );
      systemAttachment.setAttachmentObjId(obj.getId());
      this._attachmentObjIdToSystemAttachment.set(
        obj.getId(),
        systemAttachment
      );
    }
  };

  private readonly _onObjectDestroyedHandler = (obj: GameObject): void => {
    const objId: string = obj.getId();
    if (this._attachmentObjIdToSystemAttachment.has(objId)) {
      this._attachmentObjIdToSystemAttachment.delete(objId);
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

  public load(
    systemAttachmentSchemaTypes: Array<SystemAttachmentSchemaType>,
    source: string
  ): this {
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
    }

    return this;
  }
}
