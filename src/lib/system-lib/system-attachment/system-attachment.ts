import {
  GameObject,
  Vector,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { Planet } from "../planet/planet";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";
import { WormholeWithGlobalPosition } from "../system/system";
import { NsidNameSchema } from "../schema/basic-types-schema";

/**
 * A system attachment is normally a token placed in a system to add attributes
 * such as planets or wormholes.  Removing the token removes the attachment.
 *
 * It is legal to have a system "attachment" without a corresponding token, for
 * example for a game effect to add something.
 */
export class SystemAttachment {
  private readonly _params: SystemAttachmentSchemaType;
  private readonly _source: string;
  private readonly _planets: Array<Planet> = [];
  private _attachmentObjId: string | undefined;

  /**
   * Create a system attachment.
   * If there is a token, call setAttachmentObjId() to link it.
   *
   * @param {SystemAttachmentSchemaType} params - The system attachment parameters.
   */
  constructor(params: SystemAttachmentSchemaType, source: string) {
    try {
      SystemAttachmentSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._params = params;
    this._source = source;
    if (params.planets) {
      this._planets = params.planets.map(
        (planet) => new Planet(planet, this._source)
      );
    }
  }

  /**
   * Get any anomalies added by the system attachment.
   *
   * @return {Array<string>} The anomalies of the system attachment.
   */
  getAnomalies(): Array<string> {
    const result: Array<string> = [];
    if (this._params.anomalies) {
      result.push(...this._params.anomalies);
    }
    return result;
  }

  /**
   * Get the attachment object, if any.
   *
   * @return {GameObject | undefined} The attachment object or undefined.
   */
  getAttachmentObj(): GameObject | undefined {
    if (!this._attachmentObjId) {
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
   * Get the token image, if any.
   * Image is in the form of "image:packageId".
   *
   * @returns {string | undefined} The image of the system attachment.
   */
  getImg(): string | undefined {
    const img: string | undefined = this._params.img;
    if (!img) {
      return undefined;
    }
    const packageId: string = this._params.imgPackageId ?? refPackageId;
    return `${img}:${packageId}`;
  }

  /**
   * Human-readable name of the system attachment.
   *
   * @returns {string} The name of the system attachment.
   */
  getName(): string {
    return this._params.name;
  }

  /**
   * Each system attachment has a unique NSID, normally the same as the token.
   * A no-token system attachment can specify a relevant NSID not linked to any
   * game object.
   *
   * @returns {string} The NSID of the system attachment.
   */
  getNsid(): string {
    return `token.attachment:${this._source}/${this._params.nsidName}`;
  }

  /**
   * Get any planets added by the system attachment.
   *
   * @returns {Array<Planet>} The planets of the system attachment.
   */
  getPlanets(): Array<Planet> {
    return [...this._planets];
  }

  /**
   * Get any wormholes added by the system attachment.
   * System attachment may generate different results if face up/down.
   *
   * @returns {Array<string>} The wormholes of the system attachment.
   */
  getWormholes(): Array<string> {
    let result: Array<string> = [];
    if (this._params.wormholesFaceDown && !this.isAttachmentFaceUp()) {
      result.push(...this._params.wormholesFaceDown);
    } else if (this._params.wormholes) {
      result.push(...this._params.wormholes);
    }
    return result;
  }

  /**
   * Get the wormholes with global positions.
   * Given as origin if no attachment object.
   * System attachment may generate different results if face up/down.
   *
   * @returns {Array<WormholeWithGlobalPosition>} The wormholes with global positions.
   */
  getWormholesWithGlobalPositions(): Array<WormholeWithGlobalPosition> {
    const result: Array<WormholeWithGlobalPosition> = [];

    const attachmentObj: GameObject | undefined = this.getAttachmentObj();

    const globalPosition: Vector =
      attachmentObj?.getPosition() ?? new Vector(0, 0, 0);
    for (const wormhole of this.getWormholes()) {
      result.push({
        globalPosition,
        wormhole,
      });
    }

    return result;
  }

  /**
   * Is the attachment object face up?  True if no attachment object.
   *
   * @returns {boolean} True if the attachment object is face up.
   */
  isAttachmentFaceUp(): boolean {
    const obj: GameObject | undefined = this.getAttachmentObj();
    if (!obj) {
      return true;
    }
    return Facing.isFaceUp(obj);
  }

  /**
   * Link the system attachment to a token's game object.
   *
   * @param objId
   * @returns
   */
  setAttachmentObjId(objId: string | undefined): this {
    this._attachmentObjId = objId;
    return this;
  }
}
