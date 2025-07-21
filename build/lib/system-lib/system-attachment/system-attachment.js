"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAttachment = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const planet_1 = require("../planet/planet");
const system_attachment_schema_1 = require("../schema/system-attachment-schema");
const system_reserve_space_1 = require("../system/system-reserve-space");
/**
 * A system attachment is a token game object placed in a system to add
 * attributes such as planets or wormholes.  Removing the token removes the
 * attachment.
 *
 * In some rare cases a game effect rather than a token game object may want to
 * create an attachment.  It is possible to create a `new GameObject()` which
 * does not exist in the world (not world methods will find it).
 */
class SystemAttachment {
    /**
     * Get the system attachment token NSID.
     *
     * @param source
     * @param schema
     * @returns
     */
    static schemaToNsid(source, schema) {
        return `token.attachment.system:${source}/${schema.nsidName}`;
    }
    static schemaToImg(sourceAndPackageId, schema, useBack) {
        const filename = `${schema.nsidName}${useBack ? ".back" : ""}.png`;
        let img = `token/attachment/system/${filename}`;
        // Homebrew puts source first to group all related files.
        const source = sourceAndPackageId.source;
        if (source.startsWith("homebrew")) {
            img = `${source}/${img}`;
        }
        return img;
    }
    /**
     * Create a system attachment.
     *
     * @param {SystemAttachmentSchemaType} params - The system attachment parameters.
     */
    constructor(obj, sourceAndPackageId, params) {
        this._planets = [];
        try {
            system_attachment_schema_1.SystemAttachmentSchema.parse(params); // validate the schema
            basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
            throw new Error(msg);
        }
        const nsid = SystemAttachment.schemaToNsid(sourceAndPackageId.source, params);
        const objNsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid !== objNsid) {
            throw new Error(`NSID mismatch: expected "${nsid}", got "${objNsid}"`);
        }
        this._obj = obj;
        this._sourceAndPackageId = sourceAndPackageId;
        this._params = params;
        if (params.planets) {
            this._planets = params.planets.map((planet) => new planet_1.Planet(this._obj, this._sourceAndPackageId, planet));
        }
        this._obj.onGrab.add(() => {
            this.detach();
        });
        this._obj.onReleased.add(() => {
            this.attach();
            this.doLayout();
        });
    }
    /**
     * Attach the system attachment to a system.
     * May fail if no system, already attached, etc.
     *
     * @returns {boolean} True if the attachment was added to a system.
     */
    attach() {
        const pos = this._obj.getPosition();
        this._system = TI4.systemRegistry.getByPosition(pos);
        if (this._system) {
            const success = this._system.addAttachment(this);
            if (success) {
                TI4.events.onSystemChanged.trigger(this._system);
            }
            return success;
        }
        return false;
    }
    /**
     * Detach the system attachment from a system.
     * May fail if no system, not attached, etc.
     *
     * @returns {boolean} True if the attachment was removed from a system.
     */
    detach() {
        if (this._system && this._system.hasAttachment(this)) {
            if (this._system.delAttachment(this)) {
                TI4.events.onSystemChanged.trigger(this._system);
                this._system = undefined;
                return true;
            }
        }
        return false;
    }
    doLayout() {
        if (this._system) {
            const reserve = new system_reserve_space_1.SystemReserveSpace(this._system.getObj()).lift();
            const pos = this._obj.getPosition();
            pos.z = this._system.getObj().getPosition().z + 3;
            this._obj.setPosition(pos);
            this._obj.snapToGround();
            reserve.drop();
        }
    }
    /**
     * Get any anomalies added by the system attachment.
     *
     * @return {Array<string>} The anomalies of the system attachment.
     */
    getAnomalies() {
        const result = [];
        if (this._params.anomalies) {
            result.push(...this._params.anomalies);
        }
        return result;
    }
    /**
     * Get the token image file.
     *
     * @returns {string}
     */
    getImg(forceBack) {
        const useBack = forceBack ||
            (this._params.imgFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) ||
            false;
        return SystemAttachment.schemaToImg(this._sourceAndPackageId, this._params, useBack);
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
     * Human-readable name of the system attachment.
     *
     * @returns {string} The name of the system attachment.
     */
    getName() {
        return this._params.name;
    }
    getNsidName() {
        return this._params.nsidName;
    }
    /**
     * Get the system attachment token game object.
     *
     * @returns
     */
    getObj() {
        return this._obj;
    }
    /**
     * Get any planets added by the system attachment.
     *
     * @returns {Array<Planet>} The planets of the system attachment.
     */
    getPlanets() {
        return [...this._planets];
    }
    /**
     * Get any wormholes added by the system attachment.
     * System attachment may generate different results if face up/down.
     *
     * @returns {Array<string>} The wormholes of the system attachment.
     */
    getWormholes() {
        const result = [];
        if (this._params.wormholesFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            result.push(...this._params.wormholesFaceDown);
        }
        else if (this._params.wormholes) {
            result.push(...this._params.wormholes);
        }
        return result;
    }
    /**
     * Get the wormholes with world positions.
     * System attachment may generate different results if face up/down.
     *
     * @returns {Array<WormholeWithPosition>} The wormholes with global positions.
     */
    getWormholesWithPositions() {
        const result = [];
        const position = this._obj.getPosition();
        for (const wormhole of this.getWormholes()) {
            result.push({
                position,
                wormhole,
            });
        }
        return result;
    }
    /**
     * Check if the system attachment destroys wormholes.
     *
     * @returns {boolean} True if the system attachment destroys wormholes.
     */
    isDestroyWormhole() {
        return this._params.isDestroyWormhole || false;
    }
}
exports.SystemAttachment = SystemAttachment;
//# sourceMappingURL=system-attachment.js.map