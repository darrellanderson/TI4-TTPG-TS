import { GameObject, Vector } from "@tabletop-playground/api";
import { Facing } from "ttpg-darrell";
import {
  PlanetAttachmentSchema,
  PlanetAttachmentSchemaType,
} from "../schema/planet-attachment-schema";
import { Planet } from "../planet/planet";
import { System } from "../system/system";
import {
  SourceAndPackageIdSchemaType,
  SourceAndPackageIdSchema,
} from "../schema/basic-types-schema";
import { PlanetAttachmentLayout } from "./planet-attachment-layout";

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
  private readonly _sourceAndPackageId: SourceAndPackageIdSchemaType;
  private readonly _params: PlanetAttachmentSchemaType;
  private _planet: Planet | undefined;

  /**
   * Get the planet attachment token NSID.
   *
   * @param source
   * @param schema
   * @returns
   */
  static schemaToNsid(
    source: string,
    schema: PlanetAttachmentSchemaType
  ): string {
    return `token.attachment.planet:${source}/${schema.nsidName}`;
  }

  /**
   * Create a planet attachment.
   *
   * @param {PlanetAttachmentSchemaType} params - The planet attachment parameters.
   */
  constructor(
    obj: GameObject,
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    params: PlanetAttachmentSchemaType
  ) {
    try {
      PlanetAttachmentSchema.parse(params); // validate the schema
      SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
    } catch (e) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    this._obj = obj;
    this._sourceAndPackageId = sourceAndPackageId;
    this._params = params;

    obj.onGrab.add(() => {
      this.detach();
    });
    obj.onReleased.add(() => {
      this.attach();

      // Place token under other things.
      if (this._planet) {
        new PlanetAttachmentLayout().layout(this._planet);
      }
    });
  }

  /**
   * Attach the planet attachment to a planet.
   * May fail if no planet, already attached, etc.
   *
   * @returns {boolean} True if the attachment was added to a planet.
   */
  attach(): boolean {
    const pos: Vector = this._obj.getPosition();
    const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
    if (system) {
      this._planet = system.getPlanetClosest(pos);
      if (this._planet) {
        return this._planet.addAttachment(this);
      }
    }
    return false;
  }

  /**
   * Detach the planet attachment from a planet.
   * May fail if no planet, not attached, etc.
   *
   * @returns {boolean} True if the attachment was removed from a system.
   */
  detach(): boolean {
    const pos: Vector = this._obj.getPosition();
    if (this._planet) {
      if (this._planet.delAttachment(this)) {
        this._planet = undefined;
        return true;
      }
    }
    return false;
  }

  /**
   * Get the token image file.
   *
   * @returns {string | undefined} The image of the planet attachment.
   */
  getImg(forceBack?: boolean): string {
    const useBack: boolean =
      forceBack ||
      (this._params.imgFaceDown && !Facing.isFaceUp(this._obj)) ||
      false;
    const filename: string = `${this._params.nsidName}${
      useBack ? ".back" : ""
    }.png`;

    let img = "token/attachment/planet";

    // Homebrew puts source first to group all related files.
    // "Official" puts source deeper in the path to collect in a single
    // folder for easier Object Library usage.
    const source: string = this._sourceAndPackageId.source;
    if (source.startsWith("homebrew")) {
      img = `${source}/${img}/${filename}`;
    } else {
      img = `${img}/${source}/${filename}`;
    }

    return img;
  }

  /**
   * Get the package id.
   *
   * @returns
   */
  getImgPackageId(): string {
    return this._sourceAndPackageId.packageId;
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
    const source: string = this._sourceAndPackageId.source;
    return `card.legendary_planet:${source}/${this._params.legendaryNsidName}`;
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
   * Get the planet attachment token game object.
   *
   * @returns
   */
  public getObj(): GameObject {
    return this._obj;
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
