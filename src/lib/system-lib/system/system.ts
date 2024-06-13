import {
  GameObject,
  Vector,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Facing, NSID, ParsedNSID } from "ttpg-darrell";
import { SystemSchema, SystemSchemaType } from "../schema/system-schema";
import { Planet } from "../planet/planet";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { NsidNameSchema } from "../schema/basic-types-schema";

export type WormholeWithGlobalPosition = {
  wormhole: string;
  globalPosition: Vector;
};

export type WormholeWithLocalPosition = {
  wormhole: string;
  localPosition: Vector;
};

/**
 * Represent a single system, usually with a corresponding system tile game
 * object.  It can exist without a system tile object for data lookups, etc.
 *
 * Systems can have multiple attachments, normally add by placing a system
 * attachment token (e.g. "alpha wormhole") and delete by removing the token.
 *
 * A token-less system attachment is possible, see it for details.
 */
export class System {
  private readonly _params: SystemSchemaType;
  private readonly _source: string;
  private readonly _planets: Array<Planet> = [];
  private readonly _wormholes: Array<WormholeWithLocalPosition> = [];
  private readonly _wormholesFaceDown:
    | Array<WormholeWithLocalPosition>
    | undefined;
  private readonly _attachments: Array<SystemAttachment> = [];
  private _systemTileObjId: string | undefined = undefined;

  public static nsidToSystemTileNumber(nsid: string): number | undefined {
    if (nsid.startsWith("tile.system:")) {
      const parsed: ParsedNSID | undefined = NSID.parse(nsid);
      if (parsed) {
        const name: string | undefined = parsed.nameParts[0];
        if (name !== undefined) {
          const systemTileNumber: number = Number.parseInt(name);
          if (!Number.isNaN(systemTileNumber)) {
            return systemTileNumber;
          }
        }
      }
    }
  }

  constructor(params: SystemSchemaType, source: string) {
    try {
      SystemSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._params = params;
    this._source = source;

    // Planets.
    if (params.planets) {
      for (const planetParams of params.planets) {
        const planet: Planet = new Planet(planetParams, this._source);
        this._planets.push(planet);
      }
    }

    // Wormholes (face up and face down, as well as with positions)
    if (params.wormholes) {
      for (const wormhole of params.wormholes) {
        const localPosition: Vector = new Vector(0, 0, 0);
        const wormholeWithLocalPosition: WormholeWithLocalPosition = {
          wormhole,
          localPosition,
        };
        this._wormholes.push(wormholeWithLocalPosition);
      }
    }
    if (params.wormholesWithPositions) {
      for (const wormholeWithPosition of params.wormholesWithPositions) {
        const localPosition: Vector = new Vector(
          wormholeWithPosition.localPosition.x,
          wormholeWithPosition.localPosition.y,
          0
        );
        const wormholeWithLocalPosition: WormholeWithLocalPosition = {
          wormhole: wormholeWithPosition.wormhole,
          localPosition,
        };
        this._wormholes.push(wormholeWithLocalPosition);
      }
    }

    const wormholesFaceDown: Array<WormholeWithLocalPosition> = [];
    if (params.wormholesFaceDown) {
      for (const wormhole of params.wormholesFaceDown) {
        const localPosition: Vector = new Vector(0, 0, 0);
        const wormholeWithLocalPosition: WormholeWithLocalPosition = {
          wormhole,
          localPosition,
        };
        wormholesFaceDown.push(wormholeWithLocalPosition);
      }
    }
    if (params.wormholesWithPositionsFaceDown) {
      for (const wormholeWithPosition of params.wormholesWithPositionsFaceDown) {
        const localPosition: Vector = new Vector(
          wormholeWithPosition.localPosition.x,
          wormholeWithPosition.localPosition.y,
          0
        );
        const wormholeWithLocalPosition: WormholeWithLocalPosition = {
          wormhole: wormholeWithPosition.wormhole,
          localPosition,
        };
        wormholesFaceDown.push(wormholeWithLocalPosition);
      }
    }
    if (wormholesFaceDown.length > 0) {
      this._wormholesFaceDown = wormholesFaceDown;
    }
  }

  /**
   * Add an attachment to the system.  Allow multiple copies.
   *
   * @param attachment
   * @returns
   */
  addAttachment(attachment: SystemAttachment): this {
    this._attachments.push(attachment);
    return this;
  }

  /**
   * Remove an attachment from the system.
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
   * Does the system have an attachment with the given NSID?
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
   * Get anomalies of the system and all attachments.
   *
   * @returns {Array<string>} The anomalies of the system attachment.
   */
  getAnomalies(): Array<string> {
    const result: Array<string> = [];
    if (this._params.anomalies) {
      result.push(...this._params.anomalies);
    }
    for (const attachment of this._attachments) {
      result.push(...attachment.getAnomalies());
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
    let img: string | undefined = undefined;
    if (this._params.imgFaceDown && !this.isSystemFaceUp()) {
      img = this._params.imgFaceDown;
    } else if (this._params.img) {
      img = this._params.img;
    } else {
      return undefined;
    }
    const packageId: string = this._params.imgPackageId ?? refPackageId;
    return `${img}:${packageId}`;
  }

  /**
   * Get planet closest to a position.
   *
   * @param position
   * @returns
   */
  getPlanetClosest(position: Vector): Planet | undefined {
    const localPosition: Vector | undefined =
      this.worldPositionToLocal(position);
    if (!localPosition) {
      return undefined; // must have a system tile object
    }

    let closestPlanet: Planet | undefined = undefined;
    let closestDsq: number = Number.MAX_VALUE;
    for (const planet of this._planets) {
      const planetLocalPosition: Vector = planet.getLocalPosition();
      const dSq: number = localPosition
        .subtract(planetLocalPosition)
        .magnitudeSquared();
      if (dSq < closestDsq) {
        closestPlanet = planet;
        closestDsq = dSq;
      }
    }
    return closestPlanet;
  }

  /**
   * Get planet containing a position (not just closest).
   *
   * @param position
   * @returns
   */
  getPlanetExact(position: Vector): Planet | undefined {
    const localPosition: Vector | undefined =
      this.worldPositionToLocal(position);
    if (!localPosition) {
      return undefined; // must have a system tile object
    }

    const planet: Planet | undefined = this.getPlanetClosest(position);
    if (!planet) {
      return undefined;
    }

    const planetLocalPosition: Vector = planet.getLocalPosition();
    const distance: number = localPosition.distance(planetLocalPosition);
    if (distance > planet.getRadius()) {
      return undefined;
    }

    return planet;
  }

  /**
   * Get planets of the system and all attachments.
   *
   * @returns {Array<Planet>}
   */
  getPlanets(): Array<Planet> {
    const result: Array<Planet> = [];
    result.push(...this._planets);
    for (const attachment of this._attachments) {
      result.push(...attachment.getPlanets());
    }
    return result;
  }

  /**
   * Get the source (base, expansion, homebrew.x, etc.)
   *
   * @returns
   */
  getSource(): string {
    return this._source;
  }

  /**
   * Get the system tile NSID.
   *
   * @returns {string}
   */
  getSystemTileNsid(): string {
    return `tile.system:${this._source}/${this._params.tile}`;
  }

  /**
   * Get the system tile number.
   *
   * @returns
   */
  getSystemTileNumber(): number {
    return this._params.tile;
  }

  /**
   * Get the linked system tile object, if any.
   *
   * @returns {GameObject | undefined}
   */
  getSystemTileObj(): GameObject | undefined {
    if (!this._systemTileObjId) {
      return undefined;
    }
    const systemTileObj: GameObject | undefined = world.getObjectById(
      this._systemTileObjId
    );
    if (!systemTileObj || !systemTileObj.isValid()) {
      return undefined;
    }
    return systemTileObj;
  }

  /**
   * Get the linked system tile object ID, if any.
   *
   * @returns {string | undefined}
   */
  getSystemTileObjId(): string | undefined {
    return this._systemTileObjId;
  }

  /**
   * Get the wormholes of the system and all attachments.
   *
   * @returns {Array<string>}
   */
  getWormholes(): Array<string> {
    const result: Array<string> = [];
    // Includes attachments.
    for (const wormholeWithLocalPosition of this.getWormholesWithGlobalPositions()) {
      result.push(wormholeWithLocalPosition.wormhole);
    }
    return result;
  }

  /**
   * Get the wormholes with global positions of the system and all attachments.
   * If missing system tile object positions are origin.
   *
   * @returns {Array<WormholeWithGlobalPosition>}
   */
  getWormholesWithGlobalPositions(): Array<WormholeWithGlobalPosition> {
    const result: Array<WormholeWithGlobalPosition> = [];

    // Wormholes in the raw system.
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    let thisLocalWormholes: Array<WormholeWithLocalPosition> = [];
    if (this._wormholesFaceDown && !this.isSystemFaceUp()) {
      thisLocalWormholes = this._wormholesFaceDown;
    } else {
      thisLocalWormholes = this._wormholes;
    }
    for (const localWormhole of thisLocalWormholes) {
      const globalPosition: Vector =
        systemTileObj?.localPositionToWorld(localWormhole.localPosition) ??
        new Vector(0, 0, 0);
      const wormholeWithGlobalPosition: WormholeWithGlobalPosition = {
        wormhole: localWormhole.wormhole,
        globalPosition,
      };
      result.push(wormholeWithGlobalPosition);
    }

    // Wormholes in attachments.
    for (const attachment of this._attachments) {
      result.push(...attachment.getWormholesWithGlobalPositions());
    }

    return result;
  }

  /**
   * Is this a home system?
   *
   * @returns {boolean}
   */
  isHome(): boolean {
    return this._params.isHome ?? false;
  }

  /**
   * Is this a hyperlane system?
   *
   * @returns {boolean}
   */
  isHyperlane(): boolean {
    return this._params.isHyperlane ?? false;
  }

  /**
   * Is the system face up?
   * Matters for Mallice with different wormholes for face up/down.
   *
   * @returns {boolean}
   */
  isSystemFaceUp(): boolean {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return true;
    }
    return Facing.isFaceUp(systemTileObj);
  }

  /**
   * Link the system to a system tile game object.
   *
   * @param systemObjId
   * @returns
   */
  setSystemTileObjId(systemObjId: string | undefined): this {
    this._systemTileObjId = systemObjId;
    return this;
  }

  /**
   * Transform a system tile local position to a global position.
   *
   * @param localPosition
   * @returns
   */
  localPositionToWorld(localPosition: Vector): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const globalPosition: Vector =
      systemTileObj.localPositionToWorld(localPosition);
    return globalPosition;
  }

  /**
   * Transorm a global position to a system tile local position.
   *
   * @param globalPosition
   * @returns
   */
  worldPositionToLocal(globalPosition: Vector): Vector | undefined {
    const systemTileObj: GameObject | undefined = this.getSystemTileObj();
    if (!systemTileObj) {
      return undefined;
    }
    const localPosition: Vector =
      systemTileObj.worldPositionToLocal(globalPosition);
    return localPosition;
  }
}
