import { GameObject, globalEvents, world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import {
  PlanetAttachmentSchema,
  PlanetAttachmentSchemaType,
} from "../schema/planet-attachment-schema";
import { ValidateImages } from "../validate/validate-images";

type SchemaAndSource = {
  schema: PlanetAttachmentSchemaType;
  sourceAndPackageId: SourceAndPackageIdSchemaType;
};

export class PlanetAttachmentRegistry {
  private readonly _nsidToSchemaAndSource: Map<string, SchemaAndSource> =
    new Map();

  // Instantiate per relevant game object.  There "shoud not" be duplicates,
  // but that cannot be enforced.  If a copy exists, have a separate instance.
  private readonly _attachmentObjIdToPlanetAttachment: Map<
    string,
    PlanetAttachment
  > = new Map();

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const schemaAndSource: SchemaAndSource | undefined =
      this._nsidToSchemaAndSource.get(nsid);
    if (schemaAndSource) {
      // Register a fresh system object for this system tile object.
      const planetAttachment: PlanetAttachment = new PlanetAttachment(
        obj,
        schemaAndSource.sourceAndPackageId,
        schemaAndSource.schema
      );
      this._attachmentObjIdToPlanetAttachment.set(
        obj.getId(),
        planetAttachment
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
    if (this._attachmentObjIdToPlanetAttachment.has(objId)) {
      this._attachmentObjIdToPlanetAttachment.delete(objId);
      obj.onGrab.remove(this._onGrabHandler);
      obj.onReleased.remove(this._onReleasedHandler);
    }
  };

  private readonly _onGrabHandler = (obj: GameObject): void => {
    const planetAttachment: PlanetAttachment | undefined =
      this._attachmentObjIdToPlanetAttachment.get(obj.getId());
    if (planetAttachment) {
      planetAttachment.detach();
    }
  };

  private readonly _onReleasedHandler = (obj: GameObject): void => {
    const planetAttachment: PlanetAttachment | undefined =
      this._attachmentObjIdToPlanetAttachment.get(obj.getId());
    if (planetAttachment) {
      planetAttachment.attach();
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
   * Add planet attachments to planets.
   *
   * Init runs after setting up other objects, in this case we need system
   * registry to have loaded system data for finding by positon.
   *
   * Global takes care of calling init, but if any homebrew loads new content
   * it must also be sure to call init to attach any existing tokens.
   */
  init() {
    // If any attachments are not yet attached, attach them.
    for (const planetAttachment of this._attachmentObjIdToPlanetAttachment.values()) {
      planetAttachment.attach();
    }
  }

  public load(
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    planetAttachmentSchemaTypes: Array<PlanetAttachmentSchemaType>
  ): this {
    // Find all system attachment objects.
    const nsidToObjIds: Map<string, Array<string>> = new Map();
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("token.attachment.planet:")) {
        let objIds: Array<string> | undefined = nsidToObjIds.get(nsid);
        if (!objIds) {
          objIds = [];
          nsidToObjIds.set(nsid, objIds);
        }
        objIds.push(obj.getId());
      }
    }

    for (const planetAttachmentSchemaType of planetAttachmentSchemaTypes) {
      // Validate schema (oterhwise not validated until used).
      try {
        SourceAndPackageIdSchema.parse(sourceAndPackageId);
        PlanetAttachmentSchema.parse(planetAttachmentSchemaType);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          planetAttachmentSchemaType
        )}`;
        throw new Error(msg);
      }

      // Register (create temporary attachment for nsid generation).
      const nsid: string = PlanetAttachment.schemaToNsid(
        sourceAndPackageId.source,
        planetAttachmentSchemaType
      );
      this._nsidToSchemaAndSource.set(nsid, {
        sourceAndPackageId,
        schema: planetAttachmentSchemaType,
      });

      // Instantiate for any existing objects.
      const objIds: Array<string> = nsidToObjIds.get(nsid) ?? [];
      for (const objId of objIds) {
        const obj: GameObject | undefined = world.getObjectById(objId);
        if (obj && obj.isValid()) {
          const attachment = new PlanetAttachment(
            obj,
            sourceAndPackageId,
            planetAttachmentSchemaType
          );
          this._attachmentObjIdToPlanetAttachment.set(objId, attachment);

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
   * Lookup planet attachment by planet attachment token object nsid.
   * Duplicate tiles for the "same" attachment have separate instances.
   *
   * @param objId
   * @returns
   */
  public getByPlanetAttachmentObjId(
    objId: string
  ): PlanetAttachment | undefined {
    return this._attachmentObjIdToPlanetAttachment.get(objId);
  }

  public validateImages(): this {
    const validateImages = new ValidateImages();
    const obj: GameObject = new GameObject();
    for (const schemaAndSource of this._nsidToSchemaAndSource.values()) {
      const schema = schemaAndSource.schema;
      const attachment: PlanetAttachment = new PlanetAttachment(
        obj,
        schemaAndSource.sourceAndPackageId,
        schema
      );
      const packageId: string = attachment.getImgPackageId();
      obj.setRotation([0, 0, 0]);
      validateImages.add(attachment.getImg(), packageId);
      obj.setRotation([0, 0, 180]);
      validateImages.add(attachment.getImg(), packageId);
    }
    validateImages.validateOrThrow();
    return this;
  }
}
