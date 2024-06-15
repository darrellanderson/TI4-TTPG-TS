import { GameObject, Vector } from "@tabletop-playground/api";
import { PlanetSchema, PlanetSchemaType } from "../schema/planet-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SystemDefaults } from "../data/system-defaults";
import { NsidNameSchema } from "../schema/basic-types-schema";

/**
 * Represent a single planet.
 *
 * Planets can have multiple attachments, normally add by placing a token on
 * the planet and delete by removing the token.
 *
 * A token-less planet attachment is possible, see it for details.
 */
export class Planet {
  private readonly _obj: GameObject;
  private readonly _source: string;
  private readonly _params: PlanetSchemaType;
  private readonly _attachments: Array<PlanetAttachment> = [];
  private _localPosition: Vector = new Vector(0, 0, 0);

  constructor(obj: GameObject, source: string, params: PlanetSchemaType) {
    try {
      PlanetSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._obj = obj;
    this._source = source;
    this._params = params;

    if (params.localPosition) {
      this._localPosition = new Vector(
        params.localPosition.x,
        params.localPosition.y,
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
  addAttachment(attachment: PlanetAttachment): this {
    this._attachments.push(attachment);
    return this;
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
      const nsid: string = `card.legendary_planet:${this._source}/${this._params.legendaryNsidName}`;
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
   * Get planet card NSID.
   *
   * @returns {string} The NSID of the planet card.
   */
  getPlanetCardNsid(): string {
    return `card.planet:${this._source}/${this._params.nsidName}`;
  }

  /**
   * Get the global position of the planet.
   *
   * @returns
   */
  getPosition(): Vector {
    return this._obj.localPositionToWorld(this._localPosition);
  }

  /**
   * Get the radius of the planet.
   *
   * @returns
   */
  getRadius(): number {
    return this._params.radius ?? SystemDefaults.PLANET_RADIUS;
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
   * Set the local position of the planet from a standard position.
   * The standard position is based on the entity index and count, entities
   * can include wormholes as well.
   *
   * @param entityIndex
   * @param entityCount
   * @param isHome
   * @returns
   */
  setLocalPositionFromStandard(
    entityIndex: number,
    entityCount: number,
    isHome: boolean
  ): this {
    // Apply standard position.
    const map: { [key: string]: Vector } = isHome
      ? SystemDefaults.HOME_PLANET_POS
      : SystemDefaults.PLANET_POS;
    const key: string = `POS_${entityIndex + 1}_OF_${entityCount}`;
    const pos: Vector | undefined = map[key];
    if (!pos) {
      throw new Error(`Invalid planet position: ${key}`);
    }
    this._localPosition = pos;
    return this;
  }
}
