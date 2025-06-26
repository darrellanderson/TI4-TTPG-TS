import { GameObject, Vector } from "@tabletop-playground/api";
import { PlanetSchemaType } from "../schema/planet-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
/**
 * Represent a single planet.
 *
 * Planets can have multiple attachments, add by placing the planet attachment
 * token on the planet and delete by removing the token.
 *
 * A token-less planet attachment is possible, see it for details.
 */
export declare class Planet {
    private readonly _obj;
    private readonly _sourceAndPackageId;
    private readonly _params;
    private readonly _attachments;
    private _localPosition;
    private _localPositionFaceDown;
    constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: PlanetSchemaType);
    /**
     * Add an attachment to the planet.
     * Allow multiple attachments with the same NSID.
     *
     * @param planetAttachment
     * @returns
     */
    addAttachment(attachment: PlanetAttachment): boolean;
    /**
     * Remove an attachment from the planet.
     *
     * @param nsid
     * @returns
     */
    delAttachment(attachment: PlanetAttachment): boolean;
    /**
     * Does the planet have an attachment with the given NSID?
     *
     * @param nsid
     * @returns
     */
    hasAttachment(attachment: PlanetAttachment): boolean;
    getAttachments(): Array<PlanetAttachment>;
    /**
     * Get influence of the planet and all attachments.
     *
     * @returns
     */
    getInfluence(): number;
    /**
     * Get legendary card NSID of the planet and all attachments.
     *
     * @returns
     */
    getLegendaryCardNsids(): Array<string>;
    /**
     * Get the name of the planet.
     *
     * @returns
     */
    getName(): string;
    /**
     * Get the system tile or system attachment token game object.
     *
     * @returns
     */
    getObj(): GameObject;
    /**
     * Get planet card NSID.
     *
     * @returns {string} The NSID of the planet card.
     */
    getPlanetCardNsid(): string;
    /**
     * Get the global position of the planet.
     *
     * @returns
     */
    getPosition(): Vector;
    getPositionAsCircle(): Array<Vector>;
    /**
     * Get the radius of the planet, in world units.
     *
     * @returns
     */
    getRadius(): number;
    /**
     * Get resources of the planet and all attachments.
     *
     * @returns
     */
    getResources(): number;
    /**
     * Get techs of the planet and all attachments.
     *
     * @returns
     */
    getTechs(): Array<string>;
    /**
     * Get traits of the planet and all attachments.
     *
     * @returns
     */
    getTraits(): Array<string>;
    /**
     * Is the planet destroyed?  An attachment can destroy a planet.
     *
     * @returns
     */
    isDestroyedPlanet(): boolean;
    /**
     * Is the planet legendary?  An attachment can make a planet legendary.
     *
     * @returns
     */
    isLegendary(): boolean;
    /**
     * Set planet local position.
     *
     * @param pos
     * @returns
     */
    setLocalPosition(pos: Vector): this;
}
