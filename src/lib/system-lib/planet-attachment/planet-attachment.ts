import { GameObject, Vector } from "@tabletop-playground/api";
import { Facing, NSID } from "ttpg-darrell";
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
import { PlanetCardLayout } from "./planet-card-layout";

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

  static schemaToImg(
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    schema: PlanetAttachmentSchemaType,
    useBack: boolean
  ) {
    const filename: string = `${schema.nsidName}${useBack ? ".back" : ""}.png`;
    let img = `token/attachment/planet/${filename}`;

    // Homebrew prepends source first to group all related files.
    const source: string = sourceAndPackageId.source;
    if (source.startsWith("homebrew")) {
      img = `${source}/${img}`;
    }

    return img;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
      throw new Error(msg);
    }

    const nsid: string = PlanetAttachment.schemaToNsid(
      sourceAndPackageId.source,
      params
    );
    const objNsid: string = NSID.get(obj);
    if (nsid !== objNsid) {
      throw new Error(`NSID mismatch: expected "${nsid}", got "${objNsid}"`);
    }

    this._obj = obj;
    this._sourceAndPackageId = sourceAndPackageId;
    this._params = params;

    obj.onGrab.add(() => {
      this.detach(); // planet card updated during detach
    });
    obj.onReleased.add(() => {
      this.attach(); // planet card updated during attach
      this.doLayout();
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
        if (this._params.flipIfNoPlanetTech) {
          const hasTech: boolean = this._planet.getTechs().length > 0;
          this._obj.setRotation([0, 0, hasTech ? 0 : 180]);
        }
        const success: boolean = this._planet.addAttachment(this);
        if (success) {
          this.doLayoutCard(this._planet);
          TI4.events.onSystemChanged.trigger(system);
        }
        return success;
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
    if (this._planet) {
      if (this._planet.delAttachment(this)) {
        this.doLayoutCard(this._planet);
        this._planet = undefined;
        const pos: Vector = this._obj.getPosition();
        const system: System | undefined =
          TI4.systemRegistry.getByPosition(pos);
        if (system) {
          TI4.events.onSystemChanged.trigger(system);
        }
        return true;
      }
    }
    return false;
  }

  doLayout(): void {
    if (this._planet) {
      new PlanetAttachmentLayout().layout(this._planet);
    }
  }

  doLayoutCard(planet: Planet): void {
    new PlanetCardLayout().layout(planet);
  }

  getDoNotLayout(): boolean {
    return this._params.doNotLayout ?? false;
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
    return PlanetAttachment.schemaToImg(
      this._sourceAndPackageId,
      this._params,
      useBack
    );
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
    return `card.legendary-planet:${source}/${this._params.legendaryNsidName}`;
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
   * Get NSID name.
   *
   * @returns
   */
  public getNsidName(): string {
    return this._params.nsidName;
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
