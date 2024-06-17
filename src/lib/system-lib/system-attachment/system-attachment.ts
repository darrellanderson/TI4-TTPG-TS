import { GameObject, Vector } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";

import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import { Planet } from "../planet/planet";
import { System, WormholeWithPosition } from "../system/system";
import {
  SystemAttachmentSchema,
  SystemAttachmentSchemaType,
} from "../schema/system-attachment-schema";
import { SystemReserveSpace } from "../system/system-reserve-space";

/**
 * A system attachment is a token game object placed in a system to add
 * attributes such as planets or wormholes.  Removing the token removes the
 * attachment.
 *
 * In some rare cases a game effect rather than a token game object may want to
 * create an attachment.  It is possible to create a `new GameObject()` which
 * does not exist in the world (not world methods will find it).
 */
export class SystemAttachment {
  private readonly _obj: GameObject;
  private readonly _sourceAndPackageId: SourceAndPackageIdSchemaType;
  private readonly _params: SystemAttachmentSchemaType;
  private readonly _planets: Array<Planet> = [];
  private _system: System | undefined;

  /**
   * Get the system attachment token NSID.
   *
   * @param source
   * @param schema
   * @returns
   */
  static schemaToNsid(
    source: string,
    schema: SystemAttachmentSchemaType
  ): string {
    return `token.attachment.system:${source}/${schema.nsidName}`;
  }

  /**
   * Create a system attachment.
   *
   * @param {SystemAttachmentSchemaType} params - The system attachment parameters.
   */
  constructor(
    obj: GameObject,
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    params: SystemAttachmentSchemaType
  ) {
    try {
      SystemAttachmentSchema.parse(params); // validate the schema
      SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._obj = obj;
    this._sourceAndPackageId = sourceAndPackageId;
    this._params = params;
    if (params.planets) {
      this._planets = params.planets.map(
        (planet) => new Planet(this._obj, this._sourceAndPackageId, planet)
      );
    }

    this._obj.onGrab.add(() => {
      this.detach();
    });
    this._obj.onReleased.add(() => {
      this.attach();
      this.doLayout();
    });
  }

  /**
   * Attach the system attachment to a system.
   * May fail if no system, already attached, etc.
   *
   * @returns {boolean} True if the attachment was added to a system.
   */
  attach(): boolean {
    const pos: Vector = this._obj.getPosition();
    this._system = TI4.systemRegistry.getByPosition(pos);
    if (this._system) {
      return this._system.addAttachment(this);
    }
    return false;
  }

  /**
   * Detach the system attachment from a system.
   * May fail if no system, not attached, etc.
   *
   * @returns {boolean} True if the attachment was removed from a system.
   */
  detach(): boolean {
    const pos: Vector = this._obj.getPosition();
    if (this._system && this._system.hasAttachment(this)) {
      if (this._system.delAttachment(this)) {
        this._system = undefined;
        return true;
      }
    }
    return false;
  }

  doLayout(): void {
    if (this._system) {
      const reserve = new SystemReserveSpace(this._system.getObj()).lift();
      const pos = this._obj.getPosition();
      pos.z = this._system.getObj().getPosition().z + 3;
      this._obj.setPosition(pos);
      this._obj.snapToGround();
      reserve.drop();
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
   * Get the token image file.
   *
   * @returns {string}
   */
  getImg(forceBack?: boolean): string {
    const useBack: boolean =
      forceBack ||
      (this._params.imgFaceDown && !Facing.isFaceUp(this._obj)) ||
      false;
    const filename: string = `${this._params.nsidName}${
      useBack ? ".back" : ""
    }.png`;

    let img = "token/attachment/system";

    // Homebrew puts source first to group all related files.
    // "Official" puts source deeper in the path to collect in a single
    // folder for easier Object Library usage.
    const source: string = this._sourceAndPackageId.source;
    if (source.startsWith("homebrew")) {
      img = `${source}/${img}/${filename}`;
    } else {
      img = `${img}/${source}/${filename}`;
    }

    return img;
  }

  /**
   * Get the package id.
   *
   * @returns
   */
  getImgPackageId(): string {
    return this._sourceAndPackageId.packageId;
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
   * Get the system attachment token game object.
   *
   * @returns
   */
  public getObj(): GameObject {
    return this._obj;
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
   * Get the wormholes with world positions.
   * System attachment may generate different results if face up/down.
   *
   * @returns {Array<WormholeWithPosition>} The wormholes with global positions.
   */
  getWormholesWithPositions(): Array<WormholeWithPosition> {
    const result: Array<WormholeWithPosition> = [];
    const position: Vector = this._obj.getPosition();
    for (const wormhole of this.getWormholes()) {
      result.push({
        position,
        wormhole,
      });
    }
    return result;
  }

  /**
   * Check if the system attachment destroys wormholes.
   *
   * @returns {boolean} True if the system attachment destroys wormholes.
   */
  isDestroyWormhole(): boolean {
    return this._params.isDestroyWormhole || false;
  }
}
