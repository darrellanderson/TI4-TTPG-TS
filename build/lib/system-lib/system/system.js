"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_schema_1 = require("../schema/system-schema");
const planet_1 = require("../planet/planet");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const system_defaults_1 = require("../data/system-defaults");
/**
 * Represent a single system with a corresponding system tile game object.
 *
 * Systems can have multiple attachments, add by placing a system attachment
 * token game object (e.g. "alpha wormhole") and delete by removing the token.
 */
class System {
    /**
     * Parse the system tile number from an NSID.
     *
     * @param nsid
     * @returns
     */
    static nsidToSystemTileNumber(nsid) {
        if (nsid.startsWith("tile.system:")) {
            const parsed = ttpg_darrell_1.NSID.parse(nsid);
            if (parsed) {
                const name = parsed.nameParts[0];
                if (name !== undefined) {
                    const systemTileNumber = Number.parseInt(name);
                    if (!Number.isNaN(systemTileNumber)) {
                        return systemTileNumber;
                    }
                }
            }
        }
        return undefined;
    }
    static schemaToImg(schema, useBack) {
        const filename = `tile-${schema.tile.toString().padStart(3, "0")}${useBack ? ".back" : ""}.png`;
        const img = `tile/system/${filename}`;
        return img;
    }
    /**
     * Generate the NSID for a system tile from its source and schema.
     *
     * @param source
     * @param schema
     * @returns
     */
    static schemaToNsid(source, schema) {
        return `tile.system:${source}/${schema.tile}`;
    }
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
    static standardLocalPosition(entityIndex, entityCount, isHome) {
        // Apply standard position.
        const map = isHome
            ? system_defaults_1.SystemDefaults.HOME_PLANET_POS
            : system_defaults_1.SystemDefaults.PLANET_POS;
        const key = `POS_${entityIndex + 1}_OF_${entityCount}`;
        const pos = map[key];
        if (!pos) {
            throw new Error(`Invalid planet position: ${key}`);
        }
        return pos;
    }
    constructor(obj, sourceAndPackageId, params) {
        var _a, _b, _c, _d;
        this._planets = [];
        this._wormholes = [];
        this._attachments = [];
        try {
            basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId); // validate the schema
            system_schema_1.SystemSchema.parse(params); // validate the schema
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            const msg = `error: ${e.message}\nparsing: ${JSON.stringify(params)}`;
            throw new Error(msg);
        }
        const nsid = System.schemaToNsid(sourceAndPackageId.source, params);
        const objNsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid !== objNsid) {
            throw new Error(`NSID mismatch: expected "${nsid}", got "${objNsid}"`);
        }
        this._obj = obj;
        this._sourceAndPackageId = sourceAndPackageId;
        this._params = params;
        // Wormholes also use default-position slots.
        // Do not apply wormholes with position overrides, those systems differ.
        const numPlanets = (_b = (_a = params.planets) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        const numWormholes = (_d = (_c = params.wormholes) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
        const numPositionEntities = numPlanets + numWormholes;
        // Planets.  Apply default positions if not specified.
        if (params.planets) {
            for (let i = 0; i < params.planets.length; i++) {
                const planetParams = params.planets[i];
                if (planetParams) {
                    const planet = new planet_1.Planet(this._obj, this._sourceAndPackageId, planetParams);
                    if (!planetParams.localPosition) {
                        const pos = System.standardLocalPosition(i, numPositionEntities, this.isHome());
                        planet.setLocalPosition(pos);
                    }
                    this._planets.push(planet);
                }
            }
        }
        // Wormholes (face up and face down, as well as with positions)
        // Apply default positions for position-less wormholes.
        if (params.wormholes) {
            for (let i = 0; i < params.wormholes.length; i++) {
                const wormhole = params.wormholes[i];
                if (wormhole) {
                    const localPosition = System.standardLocalPosition(i + numPlanets, numPositionEntities, this.isHome());
                    const wormholeWithLocalPosition = {
                        wormhole,
                        localPosition,
                    };
                    this._wormholes.push(wormholeWithLocalPosition);
                }
            }
        }
        if (params.wormholesWithPositions) {
            for (const wormholeWithPosition of params.wormholesWithPositions) {
                const localPosition = new api_1.Vector(wormholeWithPosition.localPosition.x, wormholeWithPosition.localPosition.y, 0);
                const wormholeWithLocalPosition = {
                    wormhole: wormholeWithPosition.wormhole,
                    localPosition,
                };
                this._wormholes.push(wormholeWithLocalPosition);
            }
        }
        const wormholesFaceDown = [];
        if (params.wormholesFaceDown) {
            for (const wormhole of params.wormholesFaceDown) {
                const localPosition = new api_1.Vector(0, 0, 0);
                const wormholeWithLocalPosition = {
                    wormhole,
                    localPosition,
                };
                wormholesFaceDown.push(wormholeWithLocalPosition);
            }
        }
        if (params.wormholesWithPositionsFaceDown) {
            for (const wormholeWithPosition of params.wormholesWithPositionsFaceDown) {
                const localPosition = new api_1.Vector(wormholeWithPosition.localPosition.x, wormholeWithPosition.localPosition.y, 0);
                const wormholeWithLocalPosition = {
                    wormhole: wormholeWithPosition.wormhole,
                    localPosition,
                };
                wormholesFaceDown.push(wormholeWithLocalPosition);
            }
        }
        if (wormholesFaceDown.length > 0) {
            this._wormholesFaceDown = wormholesFaceDown;
        }
        this._obj.onReleased.add(() => {
            // Snap to hex.
            const hex = TI4.hex.fromPosition(this._obj.getPosition());
            const pos = TI4.hex.toPosition(hex);
            pos.z = this._obj.getPosition().z;
            this._obj.setPosition(pos);
        });
    }
    /**
     * Add an attachment to the system.  Allow multiple copies.
     *
     * @param attachment
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
     * Remove an attachment from the system.
     *
     * @param attachment
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
     * Does the system have an attachment with the given NSID?
     *
     * @param attachment
     * @returns
     */
    hasAttachment(attachment) {
        const index = this._attachments.indexOf(attachment);
        return index >= 0;
    }
    /**
     * Get anomalies of the system and all attachments.
     *
     * @returns {Array<string>} The anomalies of the system attachment.
     */
    getAnomalies() {
        const result = [];
        if (this._params.anomalies) {
            result.push(...this._params.anomalies);
        }
        for (const attachment of this._attachments) {
            result.push(...attachment.getAnomalies());
        }
        return result;
    }
    /**
     * Get the system attachments (not planet attachments).
     *
     * @returns
     */
    getAttachments() {
        return [...this._attachments];
    }
    /**
     * Get the class of the system attachment.
     *
     * Systems are neighbor-adjacent to other systems of the same class, with
     * the exception of "off-map" which are never adjacent to any other system.
     *
     * @returns {string} The class of the system attachment.
     */
    getClass() {
        var _a;
        return (_a = this._params.class) !== null && _a !== void 0 ? _a : "map";
    }
    /**
     * Get hyperlanes, may differ based on face up or face down.
     *
     * @returns
     */
    getHyperlanes() {
        var _a;
        if (this._params.hyperlanesFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            return this._params.hyperlanesFaceDown;
        }
        return (_a = this._params.hyperlanes) !== null && _a !== void 0 ? _a : {};
    }
    /**
     * Get the system tile image file.  This is the "UI" version, a square PNG
     * with the system image centered vertically and fully filling horizontally.
     *
     * @returns {string} The image of the system attachment.
     */
    getImg() {
        const useBack = (this._params.imgFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) || false;
        return System.schemaToImg(this._params, useBack);
    }
    /**
     * Get the package id.
     *
     * @returns
     */
    getImgPackageId() {
        return this._sourceAndPackageId.packageId;
    }
    getName() {
        ttpg_darrell_1.locale.inject({ "system.name": "System {tile}: {entities}" });
        const tile = this.getSystemTileNumber();
        const entities = [];
        for (const planet of this._planets) {
            entities.push(planet.getName());
        }
        for (const wormhole of this.getWormholes()) {
            entities.push(wormhole);
        }
        if (entities.length === 0) {
            entities.push("<>");
        }
        return (0, ttpg_darrell_1.locale)("system.name", { tile, entities: entities.join(", ") });
    }
    /**
     * Get the system tile game object.
     *
     * @returns
     */
    getObj() {
        return this._obj;
    }
    /**
     * Get planet closest to a position.
     *
     * @param position
     * @returns
     */
    getPlanetClosest(position) {
        let closestPlanet = undefined;
        let closestDsq = Number.MAX_VALUE;
        for (const planet of this._planets) {
            const planetPosition = planet.getPosition();
            const dSq = position.subtract(planetPosition).magnitudeSquared();
            if (dSq < closestDsq) {
                closestPlanet = planet;
                closestDsq = dSq;
            }
        }
        return closestPlanet;
    }
    /**
     * Get planet containing a position (not just closest).
     *
     * @param position
     * @returns
     */
    getPlanetExact(position) {
        const planet = this.getPlanetClosest(position);
        if (planet) {
            const planetPos = planet.getPosition();
            const distance = position.distance(planetPos); // radius is world space
            if (distance <= planet.getRadius()) {
                return planet;
            }
        }
        return undefined;
    }
    /**
     * Get planets of the system and all attachments.
     * Excludes destroyed planets.
     *
     * @returns {Array<Planet>}
     */
    getPlanets() {
        const result = [];
        result.push(...this._planets);
        for (const attachment of this._attachments) {
            result.push(...attachment.getPlanets());
        }
        return result.filter((planet) => !planet.isDestroyedPlanet());
    }
    getSource() {
        return this._sourceAndPackageId.source;
    }
    /**
     * Get system tile number.
     *
     * @returns {number}
     */
    getSystemTileNumber() {
        return this._params.tile;
    }
    /**
     * Get the wormholes of the system and all attachments.
     *
     * @returns {Array<string>}
     */
    getWormholes() {
        const result = [];
        // Includes attachments.
        for (const wormholeWithLocalPosition of this.getWormholesWithPositions()) {
            result.push(wormholeWithLocalPosition.wormhole);
        }
        return result;
    }
    /**
     * Get the wormholes with global positions of the system and all attachments.
     * If missing system tile object positions are origin.
     *
     * @returns {Array<WormholeWithGlobalPosition>}
     */
    getWormholesWithPositions() {
        const result = [];
        // Wormholes in the raw system.
        let thisLocalWormholes = [];
        if (this._wormholesFaceDown && !ttpg_darrell_1.Facing.isFaceUp(this._obj)) {
            thisLocalWormholes = this._wormholesFaceDown;
        }
        else {
            thisLocalWormholes = this._wormholes;
        }
        for (const localWormhole of thisLocalWormholes) {
            const position = this._obj.localPositionToWorld(localWormhole.localPosition);
            const wormholeWithPosition = {
                wormhole: localWormhole.wormhole,
                position,
            };
            result.push(wormholeWithPosition);
        }
        // Wormholes in attachments.
        for (const attachment of this._attachments) {
            result.push(...attachment.getWormholesWithPositions());
        }
        // Attachment can destroy closest wormhole.
        for (const attachment of this._attachments) {
            if (attachment.isDestroyWormhole()) {
                let closestIndex = -1;
                let closestDsq = Number.MAX_VALUE;
                for (let i = 0; i < result.length; i++) {
                    const wormholeWithPosition = result[i];
                    if (wormholeWithPosition) {
                        const dSq = this._obj
                            .getPosition()
                            .subtract(wormholeWithPosition.position)
                            .magnitudeSquared();
                        if (dSq < closestDsq) {
                            closestIndex = i;
                            closestDsq = dSq;
                        }
                    }
                }
                if (closestIndex >= 0) {
                    result.splice(closestIndex, 1);
                }
            }
        }
        return result;
    }
    /**
     * exlude from draft?
     *
     * @returns {boolean}
     */
    isExcludeFromDraft() {
        return (this.getClass() !== "map" ||
            this.isHome() ||
            this.isHyperlane() ||
            this._params.isExcludeFromDraft === true);
    }
    /**
     * Is this a home system?
     *
     * @returns {boolean}
     */
    isHome() {
        var _a;
        return (_a = this._params.isHome) !== null && _a !== void 0 ? _a : false;
    }
    /**
     * Is this a hyperlane system?
     *
     * @returns {boolean}
     */
    isHyperlane() {
        var _a;
        return (_a = this._params.isHyperlane) !== null && _a !== void 0 ? _a : false;
    }
    isLegendary() {
        for (const planet of this._planets) {
            if (planet.isLegendary()) {
                return true;
            }
        }
        return false;
    }
}
exports.System = System;
//# sourceMappingURL=system.js.map