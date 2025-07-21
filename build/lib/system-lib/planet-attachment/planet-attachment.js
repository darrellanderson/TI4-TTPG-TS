"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetAttachment = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const planet_attachment_schema_1 = require("../schema/planet-attachment-schema");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const planet_attachment_layout_1 = require("./planet-attachment-layout");
const planet_card_layout_1 = require("./planet-card-layout");
/**
 * A planet attachment is a token game object placed on a planet to add
 * attributes such as resources, techs, etc.  Removing the token removes the
 * attachment.
 *
 * In some rare cases a game effect rather than a token game object may want to
 * create an attachment.  It is possible to create a `new GameObject()` which
 * does not exist in the world (not world methods will find it).
 */
class PlanetAttachment {
    /**
     * Get the planet attachment token NSID.
     *
     * @param source
     * @param schema
     * @returns
     */
    static schemaToNsid(source, schema) {
        return `token.attachment.planet:${source}/${schema.nsidName}`;
    }
    static schemaToImg(sourceAndPackageId, schema, useBack) {
        const filename = `${schema.nsidName}${useBack ? ".back" : ""}.png`;
        let img = `token/attachment/planet/${filename}`;
        // Homebrew prepends source first to group all related files.
        const source = sourceAndPackageId.source;
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
    constructor(obj, sourceAndPackageId, params) {
        try {
            planet_attachment_schema_1.PlanetAttachmentSchema.parse(params); // validate the schema
            basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
            throw new Error(msg);
        }
        const nsid = PlanetAttachment.schemaToNsid(sourceAndPackageId.source, params);
        const objNsid = ttpg_darrell_1.NSID.get(obj);
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
    attach() {
        const pos = this._obj.getPosition();
        const system = TI4.systemRegistry.getByPosition(pos);
        if (system) {
            this._planet = system.getPlanetClosest(pos);
            if (this._planet) {
                if (this._params.flipIfNoPlanetTech) {
                    const hasTech = this._planet.getTechs().length > 0;
                    this._obj.setRotation([0, 0, hasTech ? 0 : 180]);
                }
                const success = this._planet.addAttachment(this);
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
    detach() {
        if (this._planet) {
            if (this._planet.delAttachment(this)) {
                this.doLayoutCard(this._planet);
                this._planet = undefined;
                const pos = this._obj.getPosition();
                const system = TI4.systemRegistry.getByPosition(pos);
                if (system) {
                    TI4.events.onSystemChanged.trigger(system);
                }
                return true;
            }
        }
        return false;
    }
    doLayout() {
        if (this._planet) {
            new planet_attachment_layout_1.PlanetAttachmentLayout().layout(this._planet);
        }
    }
    doLayoutCard(planet) {
        new planet_card_layout_1.PlanetCardLayout().layout(planet);
    }
    /**
     * Get the token image file.
     *
     * @returns {string | undefined} The image of the planet attachment.
     */
    getImg(forceBack) {
        const useBack = forceBack ||
            (this._params.imgFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) ||
            false;
        return PlanetAttachment.schemaToImg(this._sourceAndPackageId, this._params, useBack);
    }
    /**
     * Get the package id.
     *
     * @returns
     */
    getImgPackageId() {
        return this._sourceAndPackageId.packageId;
    }
    /**
     * Get the influence of the planet attachment.
     * Supports face up/down influence.
     *
     * @returns
     */
    getInfluence() {
        var _a;
        if (this._params.influenceFaceDown !== undefined &&
            !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            return this._params.influenceFaceDown;
        }
        return (_a = this._params.influence) !== null && _a !== void 0 ? _a : 0;
    }
    /**
     * Get the legendary card NSID of the planet attachment.
     *
     * @returns
     */
    getLegendaryCardNsid() {
        const source = this._sourceAndPackageId.source;
        return `card.legendary-planet:${source}/${this._params.legendaryNsidName}`;
    }
    /**
     * Get the name of the planet attachment.
     *
     * @returns
     */
    getName() {
        return this._params.name;
    }
    /**
     * Get NSID name.
     *
     * @returns
     */
    getNsidName() {
        return this._params.nsidName;
    }
    /**
     * Get the planet attachment token game object.
     *
     * @returns
     */
    getObj() {
        return this._obj;
    }
    /**
     * Get the resources of the planet attachment.
     *
     * @returns
     */
    getResources() {
        var _a;
        if (this._params.resourcesFaceDown !== undefined &&
            !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            return this._params.resourcesFaceDown;
        }
        return (_a = this._params.resources) !== null && _a !== void 0 ? _a : 0;
    }
    /**
     * Get the techs of the planet attachment.
     *
     * @returns
     */
    getTechs() {
        const result = [];
        if (this._params.techsFaceDown !== undefined &&
            !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            result.push(...this._params.techsFaceDown);
        }
        else if (this._params.techs) {
            result.push(...this._params.techs);
        }
        return result;
    }
    /**
     * Get the traits of the planet attachment.
     *
     * @returns
     */
    getTraits() {
        const result = [];
        if (this._params.traitsFaceDown !== undefined &&
            !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            result.push(...this._params.traitsFaceDown);
        }
        else if (this._params.traits) {
            result.push(...this._params.traits);
        }
        return result;
    }
    /**
     * Is the planet attachment a destroyer of planets?
     *
     * @returns
     */
    isDestroyPlanet() {
        var _a;
        return (_a = this._params.isDestroyPlanet) !== null && _a !== void 0 ? _a : false;
    }
    /**
     * Is the planet attachment legendary?
     *
     * @returns
     */
    isLegendary() {
        var _a;
        return (_a = this._params.isLegendary) !== null && _a !== void 0 ? _a : false;
    }
}
exports.PlanetAttachment = PlanetAttachment;
//# sourceMappingURL=planet-attachment.js.map