import { GameObject, Vector } from "@tabletop-playground/api";
import { PlanetSchema, PlanetSchemaType } from "../schema/planet-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SystemDefaults } from "../data/system-defaults";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import { Facing, NSID } from "ttpg-darrell";

/**
 * Represent a single planet.
 *
 * Planets can have multiple attachments, add by placing the planet attachment
 * token on the planet and delete by removing the token.
 *
 * A token-less planet attachment is possible, see it for details.
 */
export class Planet {
  private readonly _obj: GameObject; // system tile or system attachment
  private readonly _sourceAndPackageId: SourceAndPackageIdSchemaType;
  private readonly _params: PlanetSchemaType;
  private readonly _attachments: Array<PlanetAttachment> = [];
  private _localPosition: Vector = new Vector(0, 0, 0);
  private _localPositionFaceDown: Vector | undefined;

  constructor(
    obj: GameObject,
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    params: PlanetSchemaType
  ) {
    try {
      PlanetSchema.parse(params); // validate the schema
      SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    const objNsid: string = NSID.get(obj);
    if (
      !objNsid.startsWith("tile.system:") &&
      !objNsid.startsWith("token.attachment.system:")
    ) {
      throw new Error(
        `invalid object: "${objNsid}", expect either "tile.system:" or "token.attachment.system:" prefix`
      );
    }

    this._obj = obj;
    this._sourceAndPackageId = sourceAndPackageId;
    this._params = params;

    if (params.localPosition) {
      this._localPosition = new Vector(
        params.localPosition.x,
        params.localPosition.y,
        0
      );
    }
    if (params.localPositionFaceDown) {
      this._localPositionFaceDown = new Vector(
        params.localPositionFaceDown.x,
        params.localPositionFaceDown.y,
        0
      );
    }
  }

  /**
   * Add an attachment to the planet.
   * Allow multiple attachments with the same NSID.
   *
   * @param planetAttachment
   * @returns
   */
  addAttachment(attachment: PlanetAttachment): boolean {
    if (!this.hasAttachment(attachment)) {
      this._attachments.push(attachment);
      return true;
    }
    return false;
  }

  /**
   * Remove an attachment from the planet.
   *
   * @param nsid
   * @returns
   */
  delAttachment(attachment: PlanetAttachment): boolean {
    const index: number = this._attachments.indexOf(attachment);
    if (index >= 0) {
      this._attachments.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Does the planet have an attachment with the given NSID?
   *
   * @param nsid
   * @returns
   */
  hasAttachment(attachment: PlanetAttachment): boolean {
    const index: number = this._attachments.indexOf(attachment);
    return index >= 0;
  }

  getAttachments(): Array<PlanetAttachment> {
    return [...this._attachments];
  }

  /**
   * Get influence of the planet and all attachments.
   *
   * @returns
   */
  getInfluence(): number {
    let result: number = this._params.influence ?? 0;
    for (const attachment of this._attachments) {
      result += attachment.getInfluence();
    }
    return result;
  }

  /**
   * Get legendary card NSID of the planet and all attachments.
   *
   * @returns
   */
  getLegendaryCardNsids(): Array<string> {
    const result: Array<string> = [];
    if (this._params.legendaryNsidName) {
      const source: string = this._sourceAndPackageId.source;
      const nsid: string = `card.legendary-planet:${source}/${this._params.legendaryNsidName}`;
      result.push(nsid);
    }
    for (const attachment of this._attachments) {
      const nsid = attachment.getLegendaryCardNsid();
      if (nsid) {
        result.push(nsid);
      }
    }
    return result;
  }

  /**
   * Get the name of the planet.
   *
   * @returns
   */
  getName(): string {
    return this._params.name;
  }

  /**
   * Get the system tile or system attachment token game object.
   *
   * @returns
   */
  public getObj(): GameObject {
    return this._obj;
  }
  /**
   * Get planet card NSID.
   *
   * @returns {string} The NSID of the planet card.
   */
  getPlanetCardNsid(): string {
    const source: string = this._sourceAndPackageId.source;
    return `card.planet:${source}/${this._params.nsidName}`;
  }

  /**
   * Get the global position of the planet.
   *
   * @returns
   */
  getPosition(): Vector {
    let localPosition = this._localPosition;
    if (this._localPositionFaceDown && !Facing.isFaceUp(this._obj)) {
      localPosition = this._localPositionFaceDown;
    }
    return this._obj.localPositionToWorld(localPosition);
  }

  getPositionAsCircle(): Array<Vector> {
    const points: Array<Vector> = [];
    const center: Vector = this.getPosition();
    const r: number = this.getRadius();
    const numPoints = 32;
    const localZ = this.getObj().getExtent(false, false).z + 0.01;
    const deltaPhi = (Math.PI * 2) / numPoints;
    for (let phi = 0; phi <= Math.PI * 2 + 0.01; phi += deltaPhi) {
      const p = new Vector(Math.cos(phi) * r, Math.sin(phi) * r, localZ);
      points.push(p.add(center));
    }
    return points;
  }

  /**
   * Get the radius of the planet, in world units.
   *
   * @returns
   */
  getRadius(): number {
    const localRadius: number =
      this._params.radius ?? SystemDefaults.PLANET_RADIUS;
    const worldRadius: number = this._obj.getScale().x * localRadius;
    return worldRadius;
  }

  /**
   * Get resources of the planet and all attachments.
   *
   * @returns
   */
  getResources(): number {
    let result: number = this._params.resources ?? 0;
    for (const attachment of this._attachments) {
      result += attachment.getResources();
    }
    return result;
  }

  /**
   * Get techs of the planet and all attachments.
   *
   * @returns
   */
  getTechs(): Array<string> {
    const result: Array<string> = [];
    if (this._params.techs) {
      result.push(...this._params.techs);
    }
    for (const attachment of this._attachments) {
      result.push(...attachment.getTechs());
    }
    return result;
  }

  /**
   * Get traits of the planet and all attachments.
   *
   * @returns
   */
  getTraits(): Array<string> {
    const result: Array<string> = [];
    if (this._params.traits) {
      result.push(...this._params.traits);
    }
    for (const attachment of this._attachments) {
      result.push(...attachment.getTraits());
    }
    return result;
  }

  /**
   * Is the planet destroyed?  An attachment can destroy a planet.
   *
   * @returns
   */
  isDestroyedPlanet(): boolean {
    let result: boolean = false;
    for (const attachment of this._attachments) {
      result = result || attachment.isDestroyPlanet();
    }
    return result;
  }

  /**
   * Is the planet legendary?  An attachment can make a planet legendary.
   *
   * @returns
   */
  isLegendary(): boolean {
    let result: boolean = this._params.isLegendary ?? false;
    for (const attachment of this._attachments) {
      result = result || attachment.isLegendary();
    }
    return result;
  }

  /**
   * Set planet local position.
   *
   * @param pos
   * @returns
   */
  setLocalPosition(pos: Vector): this {
    this._localPosition = pos;
    return this;
  }
}
