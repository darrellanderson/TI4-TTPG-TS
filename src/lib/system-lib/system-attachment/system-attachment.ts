import { GameObject, Vector, refPackageId } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import { NsidNameSchema } from "../schema/basic-types-schema";
import { Planet } from "../planet/planet";
import { System, WormholeWithWorldPosition } from "../system/system";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";

/**
 * A system attachment is normally a token placed in a system to add attributes
 * such as planets or wormholes.  Removing the token removes the attachment.
 *
 * It is legal to have a system "attachment" without a corresponding token, for
 * example for a game effect to add something.
 */
export class SystemAttachment {
  private readonly _obj: GameObject;
  private readonly _source: string;
  private readonly _params: SystemAttachmentSchemaType;
  private readonly _planets: Array<Planet> = [];

  /**
   * Create a system attachment.
   * If there is a token, call setAttachmentObjId() to link it.
   *
   * @param {SystemAttachmentSchemaType} params - The system attachment parameters.
   */
  constructor(
    obj: GameObject,
    source: string,
    params: SystemAttachmentSchemaType
  ) {
    try {
      SystemAttachmentSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._obj = obj;
    this._source = source;
    this._params = params;
    if (params.planets) {
      this._planets = params.planets.map(
        (planet) => new Planet(this._obj, this._source, planet)
      );
    }
  }

  attach(): boolean {
    const pos: Vector = this._obj.getPosition();
    const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
    if (system) {
      system.addAttachment(this);
      return true;
    }
    return false;
  }

  detach(): boolean {
    const pos: Vector = this._obj.getPosition();
    const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
    if (system && system.hasAttachment(this)) {
      system.delAttachment(this);
      return true;
    }
    return false;
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
   * Get the token image, if any.
   * Image is in the form of "image:packageId".
   *
   * @returns {string | undefined} The image of the system attachment.
   */
  getImg(): string | undefined {
    const useBack: boolean =
      (this._params.imgFaceDown && !Facing.isFaceUp(this._obj)) || false;
    const filename: string = `${this._params.nsidName}${
      useBack ? ".back" : ""
    }.png`;

    let img = "token/attachment/system/";

    // Homebrew puts source first to group all related files.
    // "Official" puts source deeper in the path to collect in a single
    // folder for easier Object Library usage.
    if (this._source.startsWith("homebrew")) {
      img = `${this._source}/${img}/${filename}`;
    } else {
      img = `${img}/${this._source}/${filename}`;
    }

    // Attach package id.
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
    if (this._params.wormholesFaceDown && !Facing.isFaceUp(this._obj)) {
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
  getWormholesWithPositions(): Array<WormholeWithWorldPosition> {
    const result: Array<WormholeWithWorldPosition> = [];

    const globalPosition: Vector = this._obj.getPosition();
    for (const wormhole of this.getWormholes()) {
      result.push({
        globalPosition,
        wormhole,
      });
    }

    return result;
  }
}
