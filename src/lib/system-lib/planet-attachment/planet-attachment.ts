import {
  GameObject,
  Vector,
  refPackageId,
  world,
} from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import {
  PlanetAttachmentSchema,
  PlanetAttachmentSchemaType,
} from "../schema/planet-attachment-schema";
import { NsidNameSchema } from "../schema/basic-types-schema";
import { Planet } from "../planet/planet";
import { System } from "../system/system";

/**
 * A planet attachment is a token game object placed on a planet to add
 * attributes such as resources, techs, etc.  Removing the token removes the
 * attachment.
 *
 * In some rare cases a game effect rather than a token game object may want to
 * create an attachment.  It is possible to create a `new GameObject()` which
 * does not exist in the world (not world methods will find it).
 */
export class PlanetAttachment {
  private readonly _obj: GameObject;
  private readonly _source: string;
  private readonly _params: PlanetAttachmentSchemaType;
  private _attachmentObjId: string | undefined;

  /**
   * Create a planet attachment.
   *
   * @param {PlanetAttachmentSchemaType} params - The planet attachment parameters.
   */
  constructor(
    obj: GameObject,
    source: string,
    params: PlanetAttachmentSchemaType
  ) {
    try {
      PlanetAttachmentSchema.parse(params); // validate the schema
      NsidNameSchema.parse(source); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._obj = obj;
    this._source = source;
    this._params = params;
  }

  attach(): boolean {
    const pos: Vector = this._obj.getPosition();
    const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
    if (system) {
      const planet: Planet | undefined = system.getPlanetClosest(pos);
      if (planet) {
        planet.addAttachment(this);
        return true;
      }
    }
    return false;
  }

  detach(): boolean {
    const pos: Vector = this._obj.getPosition();
    const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
    if (system) {
      const planet: Planet | undefined = system.getPlanetClosest(pos);
      if (planet) {
        planet.delAttachment(this);
        return true;
      }
    }
    return false;
  }

  getImg(): string {
    const useBack: boolean =
      (this._params.imgFaceDown && !Facing.isFaceUp(this._obj)) || false;
    const filename: string = `${this._params.nsidName}${
      useBack ? ".back" : ""
    }.png`;

    let img = "token/attachment/planet/";

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
   * Get the influence of the planet attachment.
   * Supports face up/down influence.
   *
   * @returns
   */
  public getInfluence(): number {
    if (
      this._params.influenceFaceDown !== undefined &&
      !Facing.isFaceUp(this._obj)
    ) {
      return this._params.influenceFaceDown;
    }
    return this._params.influence ?? 0;
  }

  /**
   * Get the legendary card NSID of the planet attachment.
   *
   * @returns
   */
  getLegendaryCardNsid(): string | undefined {
    return `card.legendary_planet:${this._source}/${this._params.legendaryNsidName}`;
  }

  /**
   * Get the name of the planet attachment.
   *
   * @returns
   */
  public getName(): string {
    return this._params.name;
  }

  /**
   * Get the resources of the planet attachment.
   *
   * @returns
   */
  public getResources(): number {
    if (
      this._params.resourcesFaceDown !== undefined &&
      !Facing.isFaceUp(this._obj)
    ) {
      return this._params.resourcesFaceDown;
    }
    return this._params.resources ?? 0;
  }

  /**
   * Get the techs of the planet attachment.
   *
   * @returns
   */
  public getTechs(): Array<string> {
    const result: Array<string> = [];
    if (
      this._params.techsFaceDown !== undefined &&
      !Facing.isFaceUp(this._obj)
    ) {
      result.push(...this._params.techsFaceDown);
    } else if (this._params.techs) {
      result.push(...this._params.techs);
    }
    return result;
  }

  /**
   * Get the traits of the planet attachment.
   *
   * @returns
   */
  public getTraits(): Array<string> {
    const result: Array<string> = [];
    if (
      this._params.traitsFaceDown !== undefined &&
      !Facing.isFaceUp(this._obj)
    ) {
      result.push(...this._params.traitsFaceDown);
    } else if (this._params.traits) {
      result.push(...this._params.traits);
    }
    return result;
  }

  /**
   * Is the planet attachment a destroyer of planets?
   *
   * @returns
   */
  public isDestroyPlanet(): boolean {
    return this._params.isDestroyPlanet ?? false;
  }

  /**
   * Is the planet attachment legendary?
   *
   * @returns
   */
  public isLegendary(): boolean {
    return this._params.isLegendary ?? false;
  }
}
