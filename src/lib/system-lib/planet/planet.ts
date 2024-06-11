import { Vector } from "ttpg-mock";
import { PlanetSchemaType } from "../schema/planet-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SystemDefaults } from "../data/system-defaults";

/**
 * Represent a single planet.
 *
 * Planets can have multiple attachments, normally add by placing a token on
 * the planet and delete by removing the token.
 *
 * A token-less planet attachment is possible, see it for details.
 */
export class Planet {
  private readonly _params: PlanetSchemaType;
  private readonly _attachments: Array<PlanetAttachment> = [];
  private _localPosition: Vector = new Vector(0, 0, 0);

  constructor(planetSchemaType: PlanetSchemaType) {
    this._params = planetSchemaType;
  }

  /**
   * Add an attachment to the planet.
   * Allow multiple attachments with the same NSID.
   *
   * @param planetAttachment
   * @returns
   */
  addAttachment(planetAttachment: PlanetAttachment): this {
    this._attachments.push(planetAttachment);
    return this;
  }

  /**
   * Remove an attachment from the planet.
   * Fails silently if the attachment is not found.
   *
   * @param nsid
   * @returns
   */
  delAttachment(nsid: string): this {
    const index: number = this._attachments.findIndex((attachment) => {
      return attachment.getNsid() === nsid;
    });
    if (index >= 0) {
      this._attachments.splice(index, 1);
    }
    return this;
  }

  /**
   * Does the planet have an attachment with the given NSID?
   *
   * @param nsid
   * @returns
   */
  hasAttachment(nsid: string): boolean {
    return this._attachments.some((attachment) => {
      return attachment.getNsid() === nsid;
    });
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
    if (this._params.legendaryCardNsid) {
      result.push(this._params.legendaryCardNsid);
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
   * Get the local position of the planet relative to a system tile.
   *
   * @returns
   */
  getLocalPosition(): Vector {
    return this._localPosition.clone();
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
   * Set planet local position relative to a system tile.
   *
   * @returns
   */
  setLocalPosition(localPosition: Vector): this {
    this._localPosition = localPosition.clone();
    return this;
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
    let pos: Vector | undefined = map[key];
    if (!pos) {
      throw new Error(`Invalid planet position: ${key}`);
    }

    // Apply offset.
    if (this._params.offset) {
      pos = pos.add([this._params.offset.x, this._params.offset.y, 0]);
    }
    this._localPosition = pos;
    return this;
  }
}
