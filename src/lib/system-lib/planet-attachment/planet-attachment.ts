import {
  GameObject,
  Vector,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import {
  PlanetAttachmentSchema,
  PlanetAttachmentSchemaType,
} from "../schema/planet-attachment-schema";
import { NsidNameSchema } from "../schema/basic-types-schema";

/**
 * A planet attachment is normally a token placed on a planet to add attributes
 * such as resources, techs, etc.  Removing the token removes the attachment.
 *
 * It is legal to have a planet "attachment" without a corresponding token, for
 * example for a game effect to add something.
 */
export class PlanetAttachment {
  private readonly _params: PlanetAttachmentSchemaType;
  private readonly _source: string;
  private _attachmentObjId: string | undefined;

  /**
   * Create a planet attachment.
   * If there is a token, call setAttachmentObjId() to link it.
   *
   * @param {PlanetAttachmentSchemaType} params - The planet attachment parameters.
   */
  constructor(params: PlanetAttachmentSchemaType, source: string) {
    try {
      PlanetAttachmentSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._params = params;
    this._source = source;
  }

  /**
   * Get the attachment object, if any.
   *
   * @return {GameObject | undefined} The attachment object or undefined.
   */
  public getAttachmentObj(): GameObject | undefined {
    if (this._attachmentObjId === undefined) {
      return undefined;
    }
    const obj: GameObject | undefined = world.getObjectById(
      this._attachmentObjId
    );
    if (!obj || !obj.isValid()) {
      return undefined;
    }
    return obj;
  }

  /**
   * Get the attachment object ID, if any.
   *
   * @return {string | undefined} The attachment object ID or undefined.
   */
  public getAttachmentObjId(): string | undefined {
    return this._attachmentObjId;
  }

  /**
   * Get the influence of the planet attachment.
   * Supports face up/down influence.
   *
   * @returns
   */
  public getInfluence(): number {
    if (
      this._params.influenceFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      return this._params.influenceFaceDown;
    }
    return this._params.influence ?? 0;
  }

  /**
   * Get the legendary card NSID of the planet attachment.
   *
   * @returns
   */
  getLegendaryCardNsid(): string | undefined {
    return `card.legendary_planet:${this._source}/${this._params.legendaryNsidName}`;
  }

  /**
   * Get the name of the planet attachment.
   *
   * @returns
   */
  public getName(): string {
    return this._params.name;
  }

  /**
   * Get the NSID of the planet attachment, normally the token's.
   *
   * @returns
   */
  public getNsid(): string {
    return `token.attachment:${this._source}/${this._params.nsidName}`;
  }

  /**
   * Get the resources of the planet attachment.
   *
   * @returns
   */
  public getResources(): number {
    if (
      this._params.resourcesFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      return this._params.resourcesFaceDown;
    }
    return this._params.resources ?? 0;
  }

  /**
   * Get the techs of the planet attachment.
   *
   * @returns
   */
  public getTechs(): Array<string> {
    const result: Array<string> = [];
    if (
      this._params.techsFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      result.push(...this._params.techsFaceDown);
    } else if (this._params.techs) {
      result.push(...this._params.techs);
    }
    return result;
  }

  /**
   * Get the traits of the planet attachment.
   *
   * @returns
   */
  public getTraits(): Array<string> {
    const result: Array<string> = [];
    if (
      this._params.traitsFaceDown !== undefined &&
      !this.isAttachmentFaceUp()
    ) {
      result.push(...this._params.traitsFaceDown);
    } else if (this._params.traits) {
      result.push(...this._params.traits);
    }
    return result;
  }

  /**
   * Is the planet attachment face up?
   * True if no attachment object.
   *
   * @returns
   */
  public isAttachmentFaceUp(): boolean {
    const obj = this.getAttachmentObj();
    if (!obj) {
      return true;
    }
    return Facing.isFaceUp(obj);
  }

  /**
   * Is the planet attachment a destroyer of planets?
   *
   * @returns
   */
  public isDestroyPlanet(): boolean {
    return this._params.isDestroyPlanet ?? false;
  }

  /**
   * Is the planet attachment legendary?
   *
   * @returns
   */
  public isLegendary(): boolean {
    return this._params.isLegendary ?? false;
  }

  /**
   * Link the attachment to a token's game object.
   *
   * @returns
   */
  public setAttachmentObjId(objId: string | undefined): this {
    this._attachmentObjId = objId;
    return this;
  }
}
