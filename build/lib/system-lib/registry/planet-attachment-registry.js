"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetAttachmentRegistry = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const planet_attachment_1 = require("../planet-attachment/planet-attachment");
const planet_attachment_schema_1 = require("../schema/planet-attachment-schema");
const planet_attachment_data_1 = require("../data/planet-attachment.data");
const packageId = api_1.refPackageId;
class PlanetAttachmentRegistry {
    constructor() {
        this._nsidToSchemaAndSource = new Map();
        // Instantiate per relevant game object.  There "shoud not" be duplicates,
        // but that cannot be enforced.  If a copy exists, have a separate instance.
        this._attachmentObjIdToPlanetAttachment = new Map();
        this._onObjectCreatedHandler = (obj) => {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const schemaAndSource = this._nsidToSchemaAndSource.get(nsid);
            if (schemaAndSource) {
                // Register a fresh system object for this system tile object.
                const planetAttachment = new planet_attachment_1.PlanetAttachment(obj, schemaAndSource.sourceAndPackageId, schemaAndSource.schema);
                this._attachmentObjIdToPlanetAttachment.set(obj.getId(), planetAttachment);
            }
        };
        this._onObjectDestroyedHandler = (obj) => {
            const objId = obj.getId();
            if (this._attachmentObjIdToPlanetAttachment.has(objId)) {
                this._attachmentObjIdToPlanetAttachment.delete(objId);
            }
        };
        api_1.globalEvents.onObjectCreated.add(this._onObjectCreatedHandler);
        api_1.globalEvents.onObjectDestroyed.add(this._onObjectDestroyedHandler);
    }
    destroy() {
        api_1.globalEvents.onObjectCreated.remove(this._onObjectCreatedHandler);
        api_1.globalEvents.onObjectDestroyed.remove(this._onObjectDestroyedHandler);
    }
    /**
     * Add planet attachments to planets.
     *
     * Init runs after setting up other objects, in this case we need system
     * registry to have loaded system data for finding by positon.
     *
     * Global takes care of calling init, but if any homebrew loads new content
     * it must also be sure to call init to attach any existing tokens.
     */
    init() {
        // If any attachments are not yet attached, attach them.
        for (const planetAttachment of this._attachmentObjIdToPlanetAttachment.values()) {
            planetAttachment.attach();
        }
    }
    load(sourceAndPackageId, planetAttachmentSchemaTypes) {
        var _a;
        // Find all system attachment objects.
        const nsidToObjIds = new Map();
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("token.attachment.planet:")) {
                let objIds = nsidToObjIds.get(nsid);
                if (!objIds) {
                    objIds = [];
                    nsidToObjIds.set(nsid, objIds);
                }
                objIds.push(obj.getId());
            }
        }
        for (const planetAttachmentSchemaType of planetAttachmentSchemaTypes) {
            // Validate schema (oterhwise not validated until used).
            try {
                basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId);
                planet_attachment_schema_1.PlanetAttachmentSchema.parse(planetAttachmentSchemaType);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(planetAttachmentSchemaType)}`;
                throw new Error(msg);
            }
            // Skip "do not attach" entries (used to create inert tokens).
            if (planetAttachmentSchemaType.doNotAttach) {
                continue;
            }
            // Register.
            const nsid = planet_attachment_1.PlanetAttachment.schemaToNsid(sourceAndPackageId.source, planetAttachmentSchemaType);
            this._nsidToSchemaAndSource.set(nsid, {
                sourceAndPackageId,
                schema: planetAttachmentSchemaType,
            });
            // Instantiate for any existing objects.
            const objIds = (_a = nsidToObjIds.get(nsid)) !== null && _a !== void 0 ? _a : [];
            for (const objId of objIds) {
                const obj = api_1.world.getObjectById(objId);
                if (obj && obj.isValid()) {
                    const attachment = new planet_attachment_1.PlanetAttachment(obj, sourceAndPackageId, planetAttachmentSchemaType);
                    this._attachmentObjIdToPlanetAttachment.set(objId, attachment);
                }
            }
        }
        return this;
    }
    /**
     * Load the game data (base plus codices and expansions).
     *
     * @returns
     */
    loadDefaultData() {
        for (const [source, planetAttachmentSchemas] of Object.entries(planet_attachment_data_1.SOURCE_TO_PLANET_ATTACHMENT_DATA)) {
            const sourceAndPackageId = {
                source,
                packageId,
            };
            this.load(sourceAndPackageId, planetAttachmentSchemas);
        }
        return this;
    }
    getAllNsids() {
        return Array.from(this._nsidToSchemaAndSource.keys());
    }
    /**
     * Find the attachment by the linked card.
     * Only finds attachments inside a container, not loose on the table.
     *
     * @param cardNsid
     * @returns
     */
    getByCardNsid(cardNsid) {
        const cardParsed = ttpg_darrell_1.NSID.parse(cardNsid);
        if (cardParsed) {
            const cardNsidName = cardParsed.nameParts.join(".");
            for (const planetAttachment of this._attachmentObjIdToPlanetAttachment.values()) {
                if (planetAttachment.getNsidName() === cardNsidName &&
                    planetAttachment.getObj().getContainer()) {
                    return planetAttachment;
                }
            }
        }
        return undefined;
    }
    /**
     * Lookup planet attachment by planet attachment token object nsid.
     * Duplicate tiles for the "same" attachment have separate instances.
     *
     * @param objId
     * @returns
     */
    getByPlanetAttachmentObjId(objId) {
        return this._attachmentObjIdToPlanetAttachment.get(objId);
    }
    rawByNsid(nsid) {
        var _a;
        return (_a = this._nsidToSchemaAndSource.get(nsid)) === null || _a === void 0 ? void 0 : _a.schema;
    }
    rawByCardNsid(cardNsid) {
        const cardParsed = ttpg_darrell_1.NSID.parse(cardNsid);
        if (cardParsed) {
            const cardNsidName = cardParsed.nameParts.join(".");
            for (const planetAttachmentSchema of this._nsidToSchemaAndSource.values()) {
                if (planetAttachmentSchema.schema.nsidName === cardNsidName) {
                    return planetAttachmentSchema.schema;
                }
            }
        }
        return undefined;
    }
}
exports.PlanetAttachmentRegistry = PlanetAttachmentRegistry;
//# sourceMappingURL=planet-attachment-registry.js.map