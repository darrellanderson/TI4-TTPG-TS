"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAttachmentRegistry = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_attachment_1 = require("../system-attachment/system-attachment");
const basic_types_schema_1 = require("../schema/basic-types-schema");
const system_attachment_schema_1 = require("../schema/system-attachment-schema");
const system_attachment_data_1 = require("../data/system-attachment.data");
const packageId = api_1.refPackageId;
class SystemAttachmentRegistry {
    constructor() {
        this._nsidToSchemaAndSource = new Map();
        // Instantiate per relevant game object.  There "shoud not" be duplicates,
        // but that cannot be enforced.  If a copy exists, have a separate instance.
        this._attachmentObjIdToSystemAttachment = new Map();
        this._onObjectCreatedHandler = (obj) => {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const schemaAndSource = this._nsidToSchemaAndSource.get(nsid);
            if (schemaAndSource) {
                // Register a fresh system object for this system tile object.
                const systemAttachment = new system_attachment_1.SystemAttachment(obj, schemaAndSource.sourceAndPackageId, schemaAndSource.schema);
                this._attachmentObjIdToSystemAttachment.set(obj.getId(), systemAttachment);
            }
        };
        this._onObjectDestroyedHandler = (obj) => {
            const objId = obj.getId();
            if (this._attachmentObjIdToSystemAttachment.has(objId)) {
                this._attachmentObjIdToSystemAttachment.delete(objId);
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
     * Add system attachments to systems.
     *
     * Init runs after setting up other objects, in this case we need system
     * registry to have loaded system data for finding by positon.
     *
     * Global takes care of calling init, but if any homebrew loads new content
     * it must also be sure to call init to attach any existing tokens.
     */
    init() {
        // Attach (will not re-attach if already attached) system attachments.
        for (const systemAttachment of this._attachmentObjIdToSystemAttachment.values()) {
            systemAttachment.attach();
        }
    }
    /**
     * Define new system attachment types.
     * Call init to attach to existing tokens.
     *
     * @param systemAttachmentSchemaTypes
     * @param source
     * @returns
     */
    load(sourceAndPackageId, systemAttachmentSchemaTypes) {
        var _a;
        // Find all system attachment objects.
        const nsidToObjIds = new Map();
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("token.attachment.system:")) {
                let objIds = nsidToObjIds.get(nsid);
                if (!objIds) {
                    objIds = [];
                    nsidToObjIds.set(nsid, objIds);
                }
                objIds.push(obj.getId());
            }
        }
        for (const systemAttachmentSchemaType of systemAttachmentSchemaTypes) {
            // Validate schema (oterhwise not validated until used).
            try {
                basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId);
                system_attachment_schema_1.SystemAttachmentSchema.parse(systemAttachmentSchemaType);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(systemAttachmentSchemaType)}`;
                throw new Error(msg);
            }
            // Skip "do not attach" entries (used to create inert tokens).
            if (systemAttachmentSchemaType.doNotAttach) {
                continue;
            }
            // Register (create temporary attachment for nsid generation).
            const nsid = system_attachment_1.SystemAttachment.schemaToNsid(sourceAndPackageId.source, systemAttachmentSchemaType);
            this._nsidToSchemaAndSource.set(nsid, {
                sourceAndPackageId,
                schema: systemAttachmentSchemaType,
            });
            // Instantiate for any existing objects.
            const objIds = (_a = nsidToObjIds.get(nsid)) !== null && _a !== void 0 ? _a : [];
            for (const objId of objIds) {
                const obj = api_1.world.getObjectById(objId);
                if (obj && obj.isValid()) {
                    const attachment = new system_attachment_1.SystemAttachment(obj, sourceAndPackageId, systemAttachmentSchemaType);
                    this._attachmentObjIdToSystemAttachment.set(objId, attachment);
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
        for (const [source, systemAttachmentSchemas] of Object.entries(system_attachment_data_1.SOURCE_TO_SYSTEM_ATTACHMENT_DATA)) {
            const sourceAndPackageId = {
                source,
                packageId,
            };
            this.load(sourceAndPackageId, systemAttachmentSchemas);
        }
        return this;
    }
    _maybeRewriteCardNsidName(cardNsidName) {
        // Multiple cards connect to the same system attachment.
        if (cardNsidName === "gamma-relay" || cardNsidName === "gamma-wormhole") {
            return "wormhole-gamma";
        }
        return cardNsidName;
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
            const cardNsidName = this._maybeRewriteCardNsidName(cardParsed.nameParts.join("."));
            for (const systemAttachment of this._attachmentObjIdToSystemAttachment.values()) {
                if (systemAttachment.getNsidName() === cardNsidName &&
                    systemAttachment.getObj().getContainer()) {
                    return systemAttachment;
                }
            }
        }
        return undefined;
    }
    /**
     * Lookup system attachment by system attachment token object nsid.
     * Duplicate tokens for the "same" attachment have separate instances.
     *
     * @param objId
     * @returns
     */
    getBySystemAttachmentObjId(objId) {
        return this._attachmentObjIdToSystemAttachment.get(objId);
    }
    rawByNsid(nsid) {
        var _a;
        return (_a = this._nsidToSchemaAndSource.get(nsid)) === null || _a === void 0 ? void 0 : _a.schema;
    }
    rawByCardNsid(cardNsid) {
        const cardParsed = ttpg_darrell_1.NSID.parse(cardNsid);
        if (cardParsed) {
            const cardNsidName = this._maybeRewriteCardNsidName(cardParsed.nameParts.join("."));
            for (const systemAttachmentSchema of this._nsidToSchemaAndSource.values()) {
                if (systemAttachmentSchema.schema.nsidName === cardNsidName) {
                    return systemAttachmentSchema.schema;
                }
            }
        }
        return undefined;
    }
}
exports.SystemAttachmentRegistry = SystemAttachmentRegistry;
//# sourceMappingURL=system-attachment-registry.js.map