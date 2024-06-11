import { Vector } from "ttpg-mock";
import { PlanetSchemaType } from "../schema/planet-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SystemDefaults } from "../data/system-defaults";

export class Planet {
  private readonly _params: PlanetSchemaType;
  private readonly _attachments: Array<PlanetAttachment> = [];
  private _localPosition: Vector = new Vector(0, 0, 0);

  constructor(planetSchemaType: PlanetSchemaType) {
    this._params = planetSchemaType;
  }

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

  getInfluence(): number {
    let result: number = this._params.influence ?? 0;
    for (const attachment of this._attachments) {
      result += attachment.getInfluence();
    }
    return result;
  }

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

  getName(): string {
    return this._params.name;
  }

  getLocalPosition(): Vector {
    return this._localPosition.clone();
  }

  getRadius(): number {
    return this._params.radius ?? SystemDefaults.PLANET_RADIUS;
  }

  getResources(): number {
    let result: number = this._params.resources ?? 0;
    for (const attachment of this._attachments) {
      result += attachment.getResources();
    }
    return result;
  }

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

  isDestroyedPlanet(): boolean {
    let result: boolean = false;
    for (const attachment of this._attachments) {
      result = result || attachment.isDestroyPlanet();
    }
    return result;
  }

  isLegendary(): boolean {
    let result: boolean = this._params.isLegendary ?? false;
    for (const attachment of this._attachments) {
      result = result || attachment.isLegendary();
    }
    return result;
  }

  setLocalPosition(localPosition: Vector): this {
    this._localPosition = localPosition.clone();
    return this;
  }

  setLocalPositionFromStandard(entityIndex: number, entityCount: number): this {
    // TODO
    // TODO apply offset
    return this;
  }
}
