import { GameObject, Vector, refPackageId } from "@tabletop-playground/api";
import { Facing, NSID, ParsedNSID } from "ttpg-darrell";
import { SystemSchema, SystemSchemaType } from "../schema/system-schema";
import { Planet } from "../planet/planet";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { NsidNameSchema } from "../schema/basic-types-schema";
import { PlanetSchemaType } from "../schema/planet-schema";
import { SystemDefaults } from "../data/system-defaults";

export type WormholeWithWorldPosition = {
  wormhole: string;
  globalPosition: Vector;
};

export type WormholeWithLocalPosition = {
  wormhole: string;
  localPosition: Vector;
};

/**
 * Represent a single system with a corresponding system tile game object.
 *
 * Systems can have multiple attachments, add by placing a system attachment
 * token game object (e.g. "alpha wormhole") and delete by removing the token.
 */
export class System {
  private readonly _obj: GameObject;
  private readonly _source: string;
  private readonly _params: SystemSchemaType;
  private readonly _planets: Array<Planet> = [];
  private readonly _wormholes: Array<WormholeWithLocalPosition> = [];
  private readonly _wormholesFaceDown:
    | Array<WormholeWithLocalPosition>
    | undefined;
  private readonly _attachments: Array<SystemAttachment> = [];

  /**
   * Parse the system tile number from an NSID.
   *
   * @param nsid
   * @returns
   */
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
    return undefined;
  }

  /**
   * Generate the NSID for a system tile from its source and schema.
   *
   * @param source
   * @param schema
   * @returns
   */
  public static schemaToNsid(source: string, schema: SystemSchemaType): string {
    return `tile.system:${source}/${schema.tile}`;
  }

  /**
   * Get the local position of the planet from a standard position.
   * The standard position is based on the entity index and count, entities
   * can include wormholes as well.
   *
   * @param entityIndex
   * @param entityCount
   * @param isHome
   * @returns
   */
  public static standardLocalPosition(
    entityIndex: number,
    entityCount: number,
    isHome: boolean
  ): Vector {
    // Apply standard position.
    const map: { [key: string]: Vector } = isHome
      ? SystemDefaults.HOME_PLANET_POS
      : SystemDefaults.PLANET_POS;
    const key: string = `POS_${entityIndex + 1}_OF_${entityCount}`;
    const pos: Vector | undefined = map[key];
    if (!pos) {
      throw new Error(`Invalid planet position: ${key}`);
    }
    return pos;
  }

  constructor(obj: GameObject, source: string, params: SystemSchemaType) {
    try {
      SystemSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._obj = obj;
    this._source = source;
    this._params = params;

    // Wormholes also use default-position slots.
    // Do not apply wormholes with position overrides, those systems differ.
    const numPlanets: number = params.planets?.length ?? 0;
    const numWormholes: number = params.wormholes?.length ?? 0;
    const numPositionEntities: number = numPlanets + numWormholes;

    // Planets.  Apply default positions if not specified.
    if (params.planets) {
      for (let i = 0; i < params.planets.length; i++) {
        const planetParams: PlanetSchemaType | undefined = params.planets[i];
        if (planetParams) {
          const planet: Planet = new Planet(
            this._obj,
            this._source,
            planetParams
          );
          if (!planetParams.localPosition) {
            const pos: Vector = System.standardLocalPosition(
              i,
              numPositionEntities,
              this.isHome()
            );
            planet.setLocalPosition(pos);
          }

          this._planets.push(planet);
        }
      }
    }

    // Wormholes (face up and face down, as well as with positions)
    // Apply default positions for position-less wormholes.
    if (params.wormholes) {
      for (let i = 0; i < params.wormholes.length; i++) {
        const wormhole: string | undefined = params.wormholes[i];
        if (wormhole) {
          const localPosition: Vector = System.standardLocalPosition(
            i + numPlanets,
            numPositionEntities,
            this.isHome()
          );
          const wormholeWithLocalPosition: WormholeWithLocalPosition = {
            wormhole,
            localPosition,
          };
          this._wormholes.push(wormholeWithLocalPosition);
        }
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
  addAttachment(attachment: SystemAttachment): boolean {
    if (!this.hasAttachment(attachment)) {
      this._attachments.push(attachment);
      return true;
    }
    return false;
  }

  /**
   * Remove an attachment from the system.
   *
   * @param attachment
   * @returns
   */
  delAttachment(attachment: SystemAttachment): boolean {
    const index: number = this._attachments.indexOf(attachment);
    if (index >= 0) {
      this._attachments.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Does the system have an attachment with the given NSID?
   *
   * @param attachment
   * @returns
   */
  hasAttachment(attachment: SystemAttachment): boolean {
    const index: number = this._attachments.indexOf(attachment);
    return index >= 0;
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
   * Get the class of the system attachment.
   *
   * Systems are neighbor-adjacent to other systems of the same class, with
   * the exception of "off-map" which are never adjacent to any other system.
   *
   * @returns {string} The class of the system attachment.
   */
  getClass(): string {
    return this._params.class ?? "map";
  }

  /**
   * Get the system tile image, if any.  This is the "UI" version, a square PNG
   * with the system image centered vertically and fully filling horizontally.
   * Image is in the form of "image:packageId".
   *
   * @returns {string} The image of the system attachment.
   */
  getImg(): string {
    const useBack: boolean =
      (this._params.imgFaceDown && !Facing.isFaceUp(this._obj)) || false;
    const filename: string = `tile-${this._params.tile
      .toString()
      .padStart(3, "0")}${useBack ? ".back" : ""}.png`;

    let img: string = "tile/system";

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
   * Get planet closest to a position.
   *
   * @param position
   * @returns
   */
  getPlanetClosest(position: Vector): Planet | undefined {
    let closestPlanet: Planet | undefined = undefined;
    let closestDsq: number = Number.MAX_VALUE;
    for (const planet of this._planets) {
      const planetPosition: Vector = planet.getPosition();
      const dSq: number = position.subtract(planetPosition).magnitudeSquared();
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
    const planet: Planet | undefined = this.getPlanetClosest(position);
    if (!planet) {
      return undefined;
    }

    const planetLocal: Vector = this._obj.worldPositionToLocal(
      planet.getPosition()
    );
    const distance: number = position.distance(planetLocal);
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
   * Get system tile number.
   *
   * @returns {number | undefined}
   */
  getSystemTileNumber(): number | undefined {
    return this._params.tile;
  }

  /**
   * Get the wormholes of the system and all attachments.
   *
   * @returns {Array<string>}
   */
  getWormholes(): Array<string> {
    const result: Array<string> = [];
    // Includes attachments.
    for (const wormholeWithLocalPosition of this.getWormholesWithPositions()) {
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
  getWormholesWithPositions(): Array<WormholeWithWorldPosition> {
    const result: Array<WormholeWithWorldPosition> = [];

    // Wormholes in the raw system.
    let thisLocalWormholes: Array<WormholeWithLocalPosition> = [];
    if (this._wormholesFaceDown && !Facing.isFaceUp(this._obj)) {
      thisLocalWormholes = this._wormholesFaceDown;
    } else {
      thisLocalWormholes = this._wormholes;
    }
    for (const localWormhole of thisLocalWormholes) {
      const globalPosition: Vector = this._obj.localPositionToWorld(
        localWormhole.localPosition
      );
      const wormholeWithGlobalPosition: WormholeWithWorldPosition = {
        wormhole: localWormhole.wormhole,
        globalPosition,
      };
      result.push(wormholeWithGlobalPosition);
    }

    // Wormholes in attachments.
    for (const attachment of this._attachments) {
      result.push(...attachment.getWormholesWithPositions());
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
}
