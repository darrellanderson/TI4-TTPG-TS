import {
  GameObject,
  globalEvents,
  Vector,
  world,
} from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { NsidNameSchema } from "../schema/basic-types-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import {
  PlanetAttachmentSchema,
  PlanetAttachmentSchemaType,
} from "../schema/planet-attachment-schema";
import { System } from "../system/system";
import { Planet } from "../planet/planet";

type SchemaAndSource = {
  schema: PlanetAttachmentSchemaType;
  source: string;
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

  private _initCalled: boolean = false;

  private readonly _onObjectCreatedHandler = (obj: GameObject): void => {
    const nsid: string = NSID.get(obj);
    const schemaAndSource: SchemaAndSource | undefined =
      this._nsidToSchemaAndSource.get(nsid);
    if (schemaAndSource) {
      // Register a fresh system object for this system tile object.
      const planetAttachment: PlanetAttachment = new PlanetAttachment(
        schemaAndSource.schema,
        schemaAndSource.source
      );
      planetAttachment.setAttachmentObjId(obj.getId());
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
    // Remove attachment from planet.
  };

  private readonly _onReleasedHandler = (obj: GameObject): void => {
    // Add attachment to planet.
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
   */
  init() {
    this._initCalled = true;

    // If any attachments are not yet attached, attach them.
    for (const planetAttachment of this._attachmentObjIdToPlanetAttachment.values()) {
      const nsid: string = planetAttachment.getNsid();
      const obj: GameObject | undefined = planetAttachment.getAttachmentObj();
      if (obj) {
        const pos: Vector = obj.getPosition();
        const system: System | undefined =
          TI4.systemRegistry.getByPosition(pos);
        if (system) {
          const planet: Planet | undefined = system.getPlanetClosest(pos);
          if (planet && !planet.hasAttachment(nsid)) {
            planet.addAttachment(planetAttachment);
          }
        }
      }
    }
  }

  public load(
    planetAttachmentSchemaTypes: Array<PlanetAttachmentSchemaType>,
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

    for (const planetAttachmentSchemaType of planetAttachmentSchemaTypes) {
      // Validate schema (oterhwise not validated until used).
      try {
        PlanetAttachmentSchema.parse(planetAttachmentSchemaType);
        NsidNameSchema.parse(source);
      } catch (e) {
        const msg = `error: ${e.message}\nparsing: ${JSON.stringify(
          planetAttachmentSchemaType
        )}`;
        throw new Error(msg);
      }

      // Register (create temporary attachment for nsid generation).
      const attachment = new PlanetAttachment(
        planetAttachmentSchemaType,
        source
      );
      this._nsidToSchemaAndSource.set(attachment.getNsid(), {
        schema: planetAttachmentSchemaType,
        source,
      });

      // Instantiate for any existing objects.
      const objIds: Array<string> =
        nsidToObjIds.get(attachment.getNsid()) ?? [];
      for (const objId of objIds) {
        const obj: GameObject | undefined = world.getObjectById(objId);
        if (obj && obj.isValid()) {
          const attachment = new PlanetAttachment(
            planetAttachmentSchemaType,
            source
          );
          attachment.setAttachmentObjId(objId);
          this._attachmentObjIdToPlanetAttachment.set(objId, attachment);

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
}
