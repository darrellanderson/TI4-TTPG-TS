import { SystemAttachment } from "../system-attachment/system-attachment";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
import { SystemAttachmentSchemaType } from "../schema/system-attachment-schema";
export declare class SystemAttachmentRegistry {
    private readonly _nsidToSchemaAndSource;
    private readonly _attachmentObjIdToSystemAttachment;
    private readonly _onObjectCreatedHandler;
    private readonly _onObjectDestroyedHandler;
    constructor();
    destroy(): void;
    /**
     * Add system attachments to systems.
     *
     * Init runs after setting up other objects, in this case we need system
     * registry to have loaded system data for finding by positon.
     *
     * Global takes care of calling init, but if any homebrew loads new content
     * it must also be sure to call init to attach any existing tokens.
     */
    init(): void;
    /**
     * Define new system attachment types.
     * Call init to attach to existing tokens.
     *
     * @param systemAttachmentSchemaTypes
     * @param source
     * @returns
     */
    load(sourceAndPackageId: SourceAndPackageIdSchemaType, systemAttachmentSchemaTypes: Array<SystemAttachmentSchemaType>): this;
    /**
     * Load the game data (base plus codices and expansions).
     *
     * @returns
     */
    loadDefaultData(): this;
    _maybeRewriteCardNsidName(cardNsidName: string): string;
    getAllNsids(): Array<string>;
    /**
     * Find the attachment by the linked card.
     * Only finds attachments inside a container, not loose on the table.
     *
     * @param cardNsid
     * @returns
     */
    getByCardNsid(cardNsid: string): SystemAttachment | undefined;
    /**
     * Lookup system attachment by system attachment token object nsid.
     * Duplicate tokens for the "same" attachment have separate instances.
     *
     * @param objId
     * @returns
     */
    getBySystemAttachmentObjId(objId: string): SystemAttachment | undefined;
    rawByNsid(nsid: string): SystemAttachmentSchemaType | undefined;
    rawByCardNsid(cardNsid: string): SystemAttachmentSchemaType | undefined;
}
