import { GameObject, Vector } from "@tabletop-playground/api";
import { SystemSchemaType } from "../schema/system-schema";
import { Planet } from "../planet/planet";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
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
export declare class System {
    private readonly _obj;
    private readonly _sourceAndPackageId;
    private readonly _params;
    private readonly _planets;
    private readonly _wormholes;
    private readonly _wormholesFaceDown;
    private readonly _attachments;
    /**
     * Parse the system tile number from an NSID.
     *
     * @param nsid
     * @returns
     */
    static nsidToSystemTileNumber(nsid: string): number | undefined;
    static schemaToImg(schema: SystemSchemaType, useBack: boolean): string;
    /**
     * Generate the NSID for a system tile from its source and schema.
     *
     * @param source
     * @param schema
     * @returns
     */
    static schemaToNsid(source: string, schema: SystemSchemaType): string;
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
    static standardLocalPosition(entityIndex: number, entityCount: number, isHome: boolean): Vector;
    constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: SystemSchemaType);
    /**
     * Add an attachment to the system.  Allow multiple copies.
     *
     * @param attachment
     * @returns
     */
    addAttachment(attachment: SystemAttachment): boolean;
    /**
     * Remove an attachment from the system.
     *
     * @param attachment
     * @returns
     */
    delAttachment(attachment: SystemAttachment): boolean;
    /**
     * Does the system have an attachment with the given NSID?
     *
     * @param attachment
     * @returns
     */
    hasAttachment(attachment: SystemAttachment): boolean;
    /**
     * Get anomalies of the system and all attachments.
     *
     * @returns {Array<string>} The anomalies of the system attachment.
     */
    getAnomalies(): Array<string>;
    /**
     * Get the system attachments (not planet attachments).
     *
     * @returns
     */
    getAttachments(): Array<SystemAttachment>;
    /**
     * Get the class of the system attachment.
     *
     * Systems are neighbor-adjacent to other systems of the same class, with
     * the exception of "off-map" which are never adjacent to any other system.
     *
     * @returns {string} The class of the system attachment.
     */
    getClass(): string;
    /**
     * Get hyperlanes, may differ based on face up or face down.
     *
     * @returns
     */
    getHyperlanes(): Record<string, Array<string>>;
    /**
     * Get the system tile image file.  This is the "UI" version, a square PNG
     * with the system image centered vertically and fully filling horizontally.
     *
     * @returns {string} The image of the system attachment.
     */
    getImg(): string;
    /**
     * Get the package id.
     *
     * @returns
     */
    getImgPackageId(): string;
    getName(): string;
    /**
     * Get the system tile game object.
     *
     * @returns
     */
    getObj(): GameObject;
    /**
     * Get planet closest to a position.
     *
     * @param position
     * @returns
     */
    getPlanetClosest(position: Vector): Planet | undefined;
    /**
     * Get planet containing a position (not just closest).
     *
     * @param position
     * @returns
     */
    getPlanetExact(position: Vector): Planet | undefined;
    /**
     * Get planets of the system and all attachments.
     * Excludes destroyed planets.
     *
     * @returns {Array<Planet>}
     */
    getPlanets(): Array<Planet>;
    getSource(): string;
    /**
     * Get system tile number.
     *
     * @returns {number}
     */
    getSystemTileNumber(): number;
    /**
     * Get the wormholes of the system and all attachments.
     *
     * @returns {Array<string>}
     */
    getWormholes(): Array<string>;
    /**
     * Get the wormholes with global positions of the system and all attachments.
     * If missing system tile object positions are origin.
     *
     * @returns {Array<WormholeWithGlobalPosition>}
     */
    getWormholesWithPositions(): Array<WormholeWithPosition>;
    /**
     * exlude from draft?
     *
     * @returns {boolean}
     */
    isExcludeFromDraft(): boolean;
    /**
     * Is this a home system?
     *
     * @returns {boolean}
     */
    isHome(): boolean;
    /**
     * Is this a hyperlane system?
     *
     * @returns {boolean}
     */
    isHyperlane(): boolean;
    isLegendary(): boolean;
}
