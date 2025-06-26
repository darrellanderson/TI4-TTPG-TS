import { GameObject } from "@tabletop-playground/api";
import { PlanetAttachmentSchemaType } from "../schema/planet-attachment-schema";
import { Planet } from "../planet/planet";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
/**
 * A planet attachment is a token game object placed on a planet to add
 * attributes such as resources, techs, etc.  Removing the token removes the
 * attachment.
 *
 * In some rare cases a game effect rather than a token game object may want to
 * create an attachment.  It is possible to create a `new GameObject()` which
 * does not exist in the world (not world methods will find it).
 */
export declare class PlanetAttachment {
    private readonly _obj;
    private readonly _sourceAndPackageId;
    private readonly _params;
    private _planet;
    /**
     * Get the planet attachment token NSID.
     *
     * @param source
     * @param schema
     * @returns
     */
    static schemaToNsid(source: string, schema: PlanetAttachmentSchemaType): string;
    static schemaToImg(sourceAndPackageId: SourceAndPackageIdSchemaType, schema: PlanetAttachmentSchemaType, useBack: boolean): string;
    /**
     * Create a planet attachment.
     *
     * @param {PlanetAttachmentSchemaType} params - The planet attachment parameters.
     */
    constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: PlanetAttachmentSchemaType);
    /**
     * Attach the planet attachment to a planet.
     * May fail if no planet, already attached, etc.
     *
     * @returns {boolean} True if the attachment was added to a planet.
     */
    attach(): boolean;
    /**
     * Detach the planet attachment from a planet.
     * May fail if no planet, not attached, etc.
     *
     * @returns {boolean} True if the attachment was removed from a system.
     */
    detach(): boolean;
    doLayout(): void;
    doLayoutCard(planet: Planet): void;
    /**
     * Get the token image file.
     *
     * @returns {string | undefined} The image of the planet attachment.
     */
    getImg(forceBack?: boolean): string;
    /**
     * Get the package id.
     *
     * @returns
     */
    getImgPackageId(): string;
    /**
     * Get the influence of the planet attachment.
     * Supports face up/down influence.
     *
     * @returns
     */
    getInfluence(): number;
    /**
     * Get the legendary card NSID of the planet attachment.
     *
     * @returns
     */
    getLegendaryCardNsid(): string | undefined;
    /**
     * Get the name of the planet attachment.
     *
     * @returns
     */
    getName(): string;
    /**
     * Get NSID name.
     *
     * @returns
     */
    getNsidName(): string;
    /**
     * Get the planet attachment token game object.
     *
     * @returns
     */
    getObj(): GameObject;
    /**
     * Get the resources of the planet attachment.
     *
     * @returns
     */
    getResources(): number;
    /**
     * Get the techs of the planet attachment.
     *
     * @returns
     */
    getTechs(): Array<string>;
    /**
     * Get the traits of the planet attachment.
     *
     * @returns
     */
    getTraits(): Array<string>;
    /**
     * Is the planet attachment a destroyer of planets?
     *
     * @returns
     */
    isDestroyPlanet(): boolean;
    /**
     * Is the planet attachment legendary?
     *
     * @returns
     */
    isLegendary(): boolean;
}
