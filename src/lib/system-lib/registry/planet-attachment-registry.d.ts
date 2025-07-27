import { GameObject } from "@tabletop-playground/api";
import { SourceAndPackageIdSchemaType } from "../schema/basic-types-schema";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";
import { PlanetAttachmentSchemaType } from "../schema/planet-attachment-schema";
export declare class PlanetAttachmentRegistry {
    private readonly _nsidToSchemaAndSource;
    private readonly _attachmentObjIdToPlanetAttachment;
    private readonly _onObjectCreatedHandler;
    private readonly _onObjectDestroyedHandler;
    _maybeRegister(obj: GameObject): void;
    constructor();
    destroy(): void;
    /**
     * Add planet attachments to planets.
     *
     * Init runs after setting up other objects, in this case we need system
     * registry to have loaded system data for finding by positon.
     *
     * Global takes care of calling init, but if any homebrew loads new content
     * it must also be sure to call init to attach any existing tokens.
     */
    init(): void;
    load(sourceAndPackageId: SourceAndPackageIdSchemaType, planetAttachmentSchemaTypes: Array<PlanetAttachmentSchemaType>): this;
    /**
     * Load the game data (base plus codices and expansions).
     *
     * @returns
     */
    loadDefaultData(): this;
    getAllNsids(): Array<string>;
    /**
     * Find the attachment by the linked card.
     * Only finds attachments inside a container, not loose on the table.
     *
     * @param cardNsid
     * @returns
     */
    getByCardNsid(cardNsid: string): PlanetAttachment | undefined;
    /**
     * Lookup planet attachment by planet attachment token object nsid.
     * Duplicate tiles for the "same" attachment have separate instances.
     *
     * @param objId
     * @returns
     */
    getByPlanetAttachmentObjId(objId: string): PlanetAttachment | undefined;
    rawByNsid(nsid: string): PlanetAttachmentSchemaType | undefined;
    rawByCardNsid(cardNsid: string): PlanetAttachmentSchemaType | undefined;
}
