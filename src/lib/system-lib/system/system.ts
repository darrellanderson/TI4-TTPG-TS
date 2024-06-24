import { GameObject, Vector } from "@tabletop-playground/api";
import { Facing, HexType, NSID, ParsedNSID, locale } from "ttpg-darrell";
import { SystemSchema, SystemSchemaType } from "../schema/system-schema";
import { Planet } from "../planet/planet";
import { SystemAttachment } from "../system-attachment/system-attachment";
import {
  SourceAndPackageIdSchema,
  SourceAndPackageIdSchemaType,
} from "../schema/basic-types-schema";
import { PlanetSchemaType } from "../schema/planet-schema";
import { SystemDefaults } from "../data/system-defaults";

export type WormholeWithPosition = {
  wormhole: string;
  position: Vector;
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
  private readonly _sourceAndPackageId: SourceAndPackageIdSchemaType;
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

  static schemaToImg(
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    schema: SystemSchemaType,
    useBack: boolean
  ): string {
    const filename: string = `tile-${schema.tile.toString().padStart(3, "0")}${
      useBack ? ".back" : ""
    }.png`;
    let img: string = `tile/system/${filename}`;

    // Homebrew prepends source to group all related files.
    const source: string = sourceAndPackageId.source;
    if (source.startsWith("homebrew")) {
      img = `${source}/${img}`;
    }

    return img;
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

  constructor(
    obj: GameObject,
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    params: SystemSchemaType
  ) {
    try {
      SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
      SystemSchema.parse(params); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    const nsid: string = System.schemaToNsid(sourceAndPackageId.source, params);
    const objNsid: string = NSID.get(obj);
    if (nsid !== objNsid) {
      throw new Error(`NSID mismatch: expected "${nsid}", got "${objNsid}"`);
    }

    this._obj = obj;
    this._sourceAndPackageId = sourceAndPackageId;
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
            this._sourceAndPackageId,
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

    this._obj.onReleased.add(() => {
      // Snap to hex.
      const hex: HexType = TI4.hex.fromPosition(this._obj.getPosition());
      const pos: Vector = TI4.hex.toPosition(hex);
      pos.z = this._obj.getPosition().z;
      this._obj.setPosition(pos);
    });
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
   * Get the system attachments (not planet attachments).
   *
   * @returns
   */
  getAttachments(): Array<SystemAttachment> {
    return [...this._attachments];
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
   * Get hyperlanes, may differ based on face up or face down.
   *
   * @returns
   */
  getHyperlanes(): Record<string, Array<string>> {
    if (this._params.hyperlanesFaceDown && !Facing.isFaceUp(this._obj)) {
      return this._params.hyperlanesFaceDown;
    }
    return this._params.hyperlanes ?? {};
  }

  /**
   * Get the system tile image file.  This is the "UI" version, a square PNG
   * with the system image centered vertically and fully filling horizontally.
   *
   * @returns {string} The image of the system attachment.
   */
  getImg(): string {
    const useBack: boolean =
      (this._params.imgFaceDown && !Facing.isFaceUp(this._obj)) || false;
    return System.schemaToImg(this._sourceAndPackageId, this._params, useBack);
  }

  /**
   * Get the package id.
   *
   * @returns
   */
  getImgPackageId(): string {
    return this._sourceAndPackageId.packageId;
  }

  getName(): string {
    locale.inject({ "system.name": "System {tile}: {entities}" });
    const tile: number = this.getSystemTileNumber();
    const entities: Array<string> = [];
    for (const planet of this._planets) {
      entities.push(planet.getName());
    }
    for (const wormhole of this.getWormholes()) {
      entities.push(wormhole);
    }
    if (entities.length === 0) {
      entities.push("<>");
    }
    return locale("system.name", { tile, entities: entities.join(", ") });
  }

  /**
   * Get the system tile game object.
   *
   * @returns
   */
  public getObj(): GameObject {
    return this._obj;
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
    if (planet) {
      const planetPos: Vector = planet.getPosition();
      const distance: number = position.distance(planetPos); // radius is world space
      if (distance <= planet.getRadius()) {
        return planet;
      }
    }
    return undefined;
  }

  /**
   * Get planets of the system and all attachments.
   * Excludes destroyed planets.
   *
   * @returns {Array<Planet>}
   */
  getPlanets(): Array<Planet> {
    const result: Array<Planet> = [];
    result.push(...this._planets);
    for (const attachment of this._attachments) {
      result.push(...attachment.getPlanets());
    }
    return result.filter((planet) => !planet.isDestroyedPlanet());
  }

  /**
   * Get system tile number.
   *
   * @returns {number}
   */
  getSystemTileNumber(): number {
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
  getWormholesWithPositions(): Array<WormholeWithPosition> {
    const result: Array<WormholeWithPosition> = [];

    // Wormholes in the raw system.
    let thisLocalWormholes: Array<WormholeWithLocalPosition> = [];
    if (this._wormholesFaceDown && !Facing.isFaceUp(this._obj)) {
      thisLocalWormholes = this._wormholesFaceDown;
    } else {
      thisLocalWormholes = this._wormholes;
    }
    for (const localWormhole of thisLocalWormholes) {
      const position: Vector = this._obj.localPositionToWorld(
        localWormhole.localPosition
      );
      const wormholeWithPosition: WormholeWithPosition = {
        wormhole: localWormhole.wormhole,
        position,
      };
      result.push(wormholeWithPosition);
    }

    // Wormholes in attachments.
    for (const attachment of this._attachments) {
      result.push(...attachment.getWormholesWithPositions());
    }

    // Attachment can destroy closest wormhole.
    for (const attachment of this._attachments) {
      if (attachment.isDestroyWormhole()) {
        let closestIndex: number = -1;
        let closestDsq: number = Number.MAX_VALUE;
        for (let i = 0; i < result.length; i++) {
          const wormholeWithPosition: WormholeWithPosition | undefined =
            result[i];
          if (wormholeWithPosition) {
            const dSq: number = this._obj
              .getPosition()
              .subtract(wormholeWithPosition.position)
              .magnitudeSquared();
            if (dSq < closestDsq) {
              closestIndex = i;
              closestDsq = dSq;
            }
          }
        }
        if (closestIndex >= 0) {
          result.splice(closestIndex, 1);
        }
      }
    }

    return result;
  }

  /**
   * exlude from draft?
   *
   * @returns {boolean}
   */
  isExcludeFromDraft(): boolean {
    return this._params.isExcludeFromDraft ?? false;
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
