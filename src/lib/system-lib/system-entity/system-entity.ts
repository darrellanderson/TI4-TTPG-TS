import { Vector } from "@tabletop-playground/api";
import { SystemEntityType } from "./system-entity-schema";
import { PlanetEntityType } from "../planet-entity/planet-entity-schema";

/**
 * Something linked to a system, e.g. a wormhole, anomaly, planet, etc.
 * Could be intrisic to the system tile, or an attachment/token.
 */
export class SystemEntity {
  private readonly _name: string;
  private readonly _nsid: string | undefined;
  private readonly _tile: number | undefined;
  private readonly _isHome: boolean | undefined;
  private readonly _isHyperlane: boolean | undefined;
  private readonly _anomalies: Array<string>;
  private readonly _wormholes: Array<string>;
  private readonly _img: string | undefined;
  private readonly _imgPackageId: string | undefined;
  private readonly _planetEntityTypes: Array<PlanetEntityType> = [];
  private _localPosition: Vector = new Vector(0, 0, 0);

  constructor(params: SystemEntityType) {
    this._name = params.name;
    this._nsid = params.nsid;
    this._tile = params.tile;
    this._isHome = params.isHome;
    this._isHyperlane = params.isHyperlane;
    this._anomalies = params.anomalies ?? [];
    this._wormholes = params.wormholes ?? [];
    this._img = params.img;
    this._imgPackageId = params.imgPackageId;
    if (params.position) {
      this._localPosition = new Vector(params.position.x, params.position.y, 0);
    }
    if (params.planets) {
      for (const planetEntityType of params.planets) {
        this._planetEntityTypes.push(planetEntityType);
      }
    }
  }

  getAnomalies(): string[] {
    return this._anomalies;
  }

  getClass(): string {
    return "map";
  }

  getImg(): string | undefined {
    return this._img;
  }

  getImgPackageId(): string | undefined {
    return this._imgPackageId;
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

  getPlanetEntityTypes(): Array<PlanetEntityType> {
    return this._planetEntityTypes;
  }

  getTile(): number | undefined {
    return this._tile;
  }

  getWormholes(): string[] {
    return this._wormholes;
  }

  isHome(): boolean | undefined {
    return this._isHome;
  }

  isHyperlane(): boolean | undefined {
    return this._isHyperlane;
  }

  setLocalPosition(localPosition: Vector): this {
    this._localPosition = localPosition.clone();
    return this;
  }
}
