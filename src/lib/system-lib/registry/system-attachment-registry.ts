import {
  GameObject,
  globalEvents,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { NSID, ParsedNSID } from "ttpg-darrell";

import { SystemAttachment } from "../system-attachment/system-attachment";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";
import { ValidateImages } from "../validate/validate-images";
import { SOURCE_TO_SYSTEM_ATTACHMENT_DATA } from "../data/system-attachment.data";

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
        SourceAndPackageIdSchema.parse(sourceAndPackageId);
        SystemAttachmentSchema.parse(systemAttachmentSchemaType);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          systemAttachmentSchemaType
        )}`;
        throw new Error(msg);
      }

      // Skip "do not attach" entries (used to create inert tokens).
      if (systemAttachmentSchemaType.doNotAttach) {
        continue;
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
        }
      }
    }
    return this;
  }

  /**
   * Load the game data (base plus codices and expansions).
   *
   * @returns
   */
  public loadDefaultData(): this {
    for (const [source, systemAttachmentSchemas] of Object.entries(
      SOURCE_TO_SYSTEM_ATTACHMENT_DATA
    )) {
      const sourceAndPackageId: SourceAndPackageIdSchemaType = {
        source,
        packageId: refPackageId,
      };
      this.load(sourceAndPackageId, systemAttachmentSchemas);
    }
    return this;
  }

  _maybeRewriteCardNsidName(cardNsidName: string): string {
    // Multiple cards connect to the same system attachment.
    if (cardNsidName === "gamma-relay" || cardNsidName === "gamma-wormhole") {
      return "wormhole-gamma";
    }
    return cardNsidName;
  }

  /**
   * Find the attachment by the linked card.
   * Only finds attachments inside a container, not loose on the table.
   *
   * @param cardNsid
   * @returns
   */
  getByCardNsid(cardNsid: string): SystemAttachment | undefined {
    const cardParsed: ParsedNSID | undefined = NSID.parse(cardNsid);
    if (cardParsed) {
      const cardNsidName = this._maybeRewriteCardNsidName(
        cardParsed.nameParts.join(".")
      );
      for (const systemAttachment of this._attachmentObjIdToSystemAttachment.values()) {
        if (
          systemAttachment.getNsidName() === cardNsidName &&
          systemAttachment.getObj().getContainer()
        ) {
          return systemAttachment;
        }
      }
    }
    return undefined;
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

  public rawByNsid(nsid: string): SystemAttachmentSchemaType | undefined {
    return this._nsidToSchemaAndSource.get(nsid)?.schema;
  }

  public rawByCardNsid(
    cardNsid: string
  ): SystemAttachmentSchemaType | undefined {
    const cardParsed: ParsedNSID | undefined = NSID.parse(cardNsid);
    if (cardParsed) {
      const cardNsidName = this._maybeRewriteCardNsidName(
        cardParsed.nameParts.join(".")
      );
      for (const systemAttachmentSchema of this._nsidToSchemaAndSource.values()) {
        if (systemAttachmentSchema.schema.nsidName === cardNsidName) {
          return systemAttachmentSchema.schema;
        }
      }
    }
    return undefined;
  }

  public validateImages(): this {
    const validateImages = new ValidateImages();
    for (const schemaAndSource of this._nsidToSchemaAndSource.values()) {
      const source: SourceAndPackageIdSchemaType =
        schemaAndSource.sourceAndPackageId;
      const schema: SystemAttachmentSchemaType = schemaAndSource.schema;
      let img: string = SystemAttachment.schemaToImg(source, schema, false);
      validateImages.add(img, source.packageId);
      if (schema.imgFaceDown) {
        img = SystemAttachment.schemaToImg(source, schema, true);
        validateImages.add(img, source.packageId);
      }
    }
    validateImages.validateOrThrow();
    return this;
  }
}
