import { GameObject } from "@tabletop-playground/api";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
import { Planet } from "../planet/planet";
import { WormholeWithPosition } from "../system/system";
import { SystemAttachmentSchemaType } from "../schema/system-attachment-schema";
/**
 * A system attachment is a token game object placed in a system to add
 * attributes such as planets or wormholes.  Removing the token removes the
 * attachment.
 *
 * In some rare cases a game effect rather than a token game object may want to
 * create an attachment.  It is possible to create a `new GameObject()` which
 * does not exist in the world (not world methods will find it).
 */
export declare class SystemAttachment {
    private readonly _obj;
    private readonly _sourceAndPackageId;
    private readonly _params;
    private readonly _planets;
    private _system;
    /**
     * Get the system attachment token NSID.
     *
     * @param source
     * @param schema
     * @returns
     */
    static schemaToNsid(source: string, schema: SystemAttachmentSchemaType): string;
    static schemaToImg(sourceAndPackageId: SourceAndPackageIdSchemaType, schema: SystemAttachmentSchemaType, useBack: boolean): string;
    /**
     * Create a system attachment.
     *
     * @param {SystemAttachmentSchemaType} params - The system attachment parameters.
     */
    constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: SystemAttachmentSchemaType);
    /**
     * Attach the system attachment to a system.
     * May fail if no system, already attached, etc.
     *
     * @returns {boolean} True if the attachment was added to a system.
     */
    attach(): boolean;
    /**
     * Detach the system attachment from a system.
     * May fail if no system, not attached, etc.
     *
     * @returns {boolean} True if the attachment was removed from a system.
     */
    detach(): boolean;
    doLayout(): void;
    /**
     * Get any anomalies added by the system attachment.
     *
     * @return {Array<string>} The anomalies of the system attachment.
     */
    getAnomalies(): Array<string>;
    /**
     * Get the token image file.
     *
     * @returns {string}
     */
    getImg(forceBack?: boolean): string;
    /**
     * Get the package id.
     *
     * @returns
     */
    getImgPackageId(): string;
    /**
     * Human-readable name of the system attachment.
     *
     * @returns {string} The name of the system attachment.
     */
    getName(): string;
    getNsidName(): string;
    /**
     * Get the system attachment token game object.
     *
     * @returns
     */
    getObj(): GameObject;
    /**
     * Get any planets added by the system attachment.
     *
     * @returns {Array<Planet>} The planets of the system attachment.
     */
    getPlanets(): Array<Planet>;
    /**
     * Get any wormholes added by the system attachment.
     * System attachment may generate different results if face up/down.
     *
     * @returns {Array<string>} The wormholes of the system attachment.
     */
    getWormholes(): Array<string>;
    /**
     * Get the wormholes with world positions.
     * System attachment may generate different results if face up/down.
     *
     * @returns {Array<WormholeWithPosition>} The wormholes with global positions.
     */
    getWormholesWithPositions(): Array<WormholeWithPosition>;
    /**
     * Check if the system attachment destroys wormholes.
     *
     * @returns {boolean} True if the system attachment destroys wormholes.
     */
    isDestroyWormhole(): boolean;
    isIngress(): boolean;
    isEgress(): boolean;
}
