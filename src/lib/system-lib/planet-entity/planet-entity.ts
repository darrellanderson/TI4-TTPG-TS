import { Vector } from "@tabletop-playground/api";
import { PlanetEntityType } from "./planet-entity-schema";

export class PlanetEntity {
  private readonly _name: string;
  private readonly _nsid: string | undefined;
  private readonly _radius: number | undefined;
  private readonly _influence: number;
  private readonly _resources: number;
  private readonly _techs: string[];
  private readonly _traits: string[];
  private readonly _isLegendary: boolean;
  private readonly _isDestroyPlanet: boolean;
  private readonly _img: string | undefined;
  private readonly _imgPackageId: string | undefined;
  private _localPosition: Vector = new Vector(0, 0, 0);

  constructor(params: PlanetEntityType) {
    this._name = params.name;
    this._nsid = params.nsid;
    this._influence = params.influence ?? 0;
    this._resources = params.resources ?? 0;
    this._traits = params.traits ?? [];
    this._techs = params.techs ?? [];
    this._isLegendary = params.isLegendary ?? false;
    this._radius = params.radius;
    this._isDestroyPlanet = params.isDestroyPlanet ?? false;
    this._img = params.img;
    this._imgPackageId = params.imgPackageId;
    if (params.position) {
      this._localPosition = new Vector(params.position.x, params.position.y, 0);
    }
  }

  getImg(): string | undefined {
    return this._img;
  }

  getImgPackageId(): string | undefined {
    return this._imgPackageId;
  }

  getInfluence(): number {
    return this._influence;
  }

  getLocalPosition(): Vector {
    return this._localPosition.clone();
  }

  getName(): string {
    return this._name;
  }

  getNSID(): string | undefined {
    return this._nsid;
  }

  getRadius(): number | undefined {
    return this._radius;
  }

  getResources(): number {
    return this._resources;
  }

  getTechs(): string[] {
    return this._techs;
  }

  getTraits(): string[] {
    return this._traits;
  }

  isLegendary(): boolean {
    return this._isLegendary;
  }

  isDestroyPlanet(): boolean {
    return this._isDestroyPlanet;
  }

  setLocalPosition(localPosition: Vector): this {
    this._localPosition = localPosition.clone();
    return this;
  }
}
