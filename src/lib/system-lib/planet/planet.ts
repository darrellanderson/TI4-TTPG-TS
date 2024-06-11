import { Vector } from "ttpg-mock";
import { PlanetSchemaType } from "../schema/planet-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";

export class Planet {
  private readonly _params: PlanetSchemaType;
  private readonly _planetAttachment: Array<PlanetAttachment> = [];
  private _localPosition: Vector = new Vector(0, 0, 0);

  constructor(planetSchemaType: PlanetSchemaType) {
    this._params = planetSchemaType;
  }

  getInfluence(): number {
    let result: number = this._params.influence ?? 0;
    for (const attachment of this._planetAttachment) {
      result += attachment.getInfluence();
    }
    return result;
  }

  getLegendaryCardNsids(): Array<string> {
    const result: Array<string> = [];
    if (this._params.legendaryCardNsid) {
      result.push(this._params.legendaryCardNsid);
    }
    for (const attachment of this._planetAttachment) {
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
    return this._params.radius ?? 0;
  }

  getResources(): number {
    let result: number = this._params.resources ?? 0;
    for (const attachment of this._planetAttachment) {
      result += attachment.getResources();
    }
    return result;
  }

  getTechs(): Array<string> {
    const result: Array<string> = [];
    if (this._params.techs) {
      result.push(...this._params.techs);
    }
    for (const attachment of this._planetAttachment) {
      result.push(...attachment.getTechs());
    }
    return result;
  }

  getTraits(): Array<string> {
    const result: Array<string> = [];
    if (this._params.traits) {
      result.push(...this._params.traits);
    }
    for (const attachment of this._planetAttachment) {
      result.push(...attachment.getTraits());
    }
    return result;
  }

  isDestroyedPlanet(): boolean {
    let result: boolean = false;
    for (const attachment of this._planetAttachment) {
      result = result || attachment.isDestroyPlanet();
    }
    return result;
  }

  isLegendary(): boolean {
    let result: boolean = this._params.isLegendary ?? false;
    for (const attachment of this._planetAttachment) {
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
