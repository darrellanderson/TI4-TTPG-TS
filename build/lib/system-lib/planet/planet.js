"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Planet = void 0;
const api_1 = require("@tabletop-playground/api");
const planet_schema_1 = require("../schema/planet-schema");
const system_defaults_1 = require("../data/system-defaults");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Represent a single planet.
 *
 * Planets can have multiple attachments, add by placing the planet attachment
 * token on the planet and delete by removing the token.
 *
 * A token-less planet attachment is possible, see it for details.
 */
class Planet {
    constructor(obj, sourceAndPackageId, params) {
        this._attachments = [];
        this._localPosition = new api_1.Vector(0, 0, 0);
        try {
            planet_schema_1.PlanetSchema.parse(params); // validate the schema
            basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
            throw new Error(msg);
        }
        const objNsid = ttpg_darrell_1.NSID.get(obj);
        if (!objNsid.startsWith("tile.system:") &&
            !objNsid.startsWith("token.attachment.system:")) {
            throw new Error(`invalid object: "${objNsid}", expect either "tile.system:" or "token.attachment.system:" prefix`);
        }
        this._obj = obj;
        this._sourceAndPackageId = sourceAndPackageId;
        this._params = params;
        if (params.localPosition) {
            this._localPosition = new api_1.Vector(params.localPosition.x, params.localPosition.y, 0);
        }
        if (params.localPositionFaceDown) {
            this._localPositionFaceDown = new api_1.Vector(params.localPositionFaceDown.x, params.localPositionFaceDown.y, 0);
        }
    }
    /**
     * Add an attachment to the planet.
     * Allow multiple attachments with the same NSID.
     *
     * @param planetAttachment
     * @returns
     */
    addAttachment(attachment) {
        if (!this.hasAttachment(attachment)) {
            this._attachments.push(attachment);
            return true;
        }
        return false;
    }
    /**
     * Remove an attachment from the planet.
     *
     * @param nsid
     * @returns
     */
    delAttachment(attachment) {
        const index = this._attachments.indexOf(attachment);
        if (index >= 0) {
            this._attachments.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Does the planet have an attachment with the given NSID?
     *
     * @param nsid
     * @returns
     */
    hasAttachment(attachment) {
        const index = this._attachments.indexOf(attachment);
        return index >= 0;
    }
    getAttachments() {
        return [...this._attachments];
    }
    /**
     * Get influence of the planet and all attachments.
     *
     * @returns
     */
    getInfluence() {
        var _a;
        let result = (_a = this._params.influence) !== null && _a !== void 0 ? _a : 0;
        for (const attachment of this._attachments) {
            result += attachment.getInfluence();
        }
        return result;
    }
    /**
     * Get legendary card NSID of the planet and all attachments.
     *
     * @returns
     */
    getLegendaryCardNsids() {
        const result = [];
        if (this._params.legendaryNsidName) {
            const source = this._sourceAndPackageId.source;
            const nsid = `card.legendary-planet:${source}/${this._params.legendaryNsidName}`;
            result.push(nsid);
        }
        for (const attachment of this._attachments) {
            const nsid = attachment.getLegendaryCardNsid();
            if (nsid) {
                result.push(nsid);
            }
        }
        return result;
    }
    /**
     * Get the name of the planet.
     *
     * @returns
     */
    getName() {
        return this._params.name;
    }
    /**
     * Get the system tile or system attachment token game object.
     *
     * @returns
     */
    getObj() {
        return this._obj;
    }
    /**
     * Get planet card NSID.
     *
     * @returns {string} The NSID of the planet card.
     */
    getPlanetCardNsid() {
        const source = this._sourceAndPackageId.source;
        return `card.planet:${source}/${this._params.nsidName}`;
    }
    /**
     * Get the global position of the planet.
     *
     * @returns
     */
    getPosition() {
        let localPosition = this._localPosition;
        if (this._localPositionFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            localPosition = this._localPositionFaceDown;
        }
        return this._obj.localPositionToWorld(localPosition);
    }
    getPositionAsCircle() {
        const points = [];
        const center = this.getPosition();
        const r = this.getRadius();
        const numPoints = 32;
        const localZ = this.getObj().getExtent(false, false).z + 0.01;
        const deltaPhi = (Math.PI * 2) / numPoints;
        for (let phi = 0; phi <= Math.PI * 2 + 0.01; phi += deltaPhi) {
            const p = new api_1.Vector(Math.cos(phi) * r, Math.sin(phi) * r, localZ);
            points.push(p.add(center));
        }
        return points;
    }
    /**
     * Get the radius of the planet, in world units.
     *
     * @returns
     */
    getRadius() {
        var _a;
        const localRadius = (_a = this._params.radius) !== null && _a !== void 0 ? _a : system_defaults_1.SystemDefaults.PLANET_RADIUS;
        const worldRadius = this._obj.getScale().x * localRadius;
        return worldRadius;
    }
    /**
     * Get resources of the planet and all attachments.
     *
     * @returns
     */
    getResources() {
        var _a;
        let result = (_a = this._params.resources) !== null && _a !== void 0 ? _a : 0;
        for (const attachment of this._attachments) {
            result += attachment.getResources();
        }
        return result;
    }
    /**
     * Get techs of the planet and all attachments.
     *
     * @returns
     */
    getTechs() {
        const result = [];
        if (this._params.techs) {
            result.push(...this._params.techs);
        }
        for (const attachment of this._attachments) {
            result.push(...attachment.getTechs());
        }
        return result;
    }
    /**
     * Get traits of the planet and all attachments.
     *
     * @returns
     */
    getTraits() {
        const result = [];
        if (this._params.traits) {
            result.push(...this._params.traits);
        }
        for (const attachment of this._attachments) {
            result.push(...attachment.getTraits());
        }
        return result;
    }
    /**
     * Is the planet destroyed?  An attachment can destroy a planet.
     *
     * @returns
     */
    isDestroyedPlanet() {
        let result = false;
        for (const attachment of this._attachments) {
            result = result || attachment.isDestroyPlanet();
        }
        return result;
    }
    /**
     * Is the planet legendary?  An attachment can make a planet legendary.
     *
     * @returns
     */
    isLegendary() {
        var _a;
        let result = (_a = this._params.isLegendary) !== null && _a !== void 0 ? _a : false;
        for (const attachment of this._attachments) {
            result = result || attachment.isLegendary();
        }
        return result;
    }
    /**
     * Set planet local position.
     *
     * @param pos
     * @returns
     */
    setLocalPosition(pos) {
        this._localPosition = pos;
        return this;
    }
}
exports.Planet = Planet;
//# sourceMappingURL=planet.js.map