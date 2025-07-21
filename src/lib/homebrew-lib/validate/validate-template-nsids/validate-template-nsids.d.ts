import { AbstractValidate } from "../abstract-validate/abstract-validate";
/**
 * Verify all non-deck spawn NSIDs match the resulting object NSIDs.
 * Careful with this, objects may have scripts.
 */
export declare class ValidateTemplateNsids extends AbstractValidate {
    getCommandName(): string;
    getDescription(): string;
    getErrors(errors: Array<string>): void;
    /**
     * If the NSID isn't a card, verity the resulting object has that
     * NSID.  Return an error message, or undefined if it matches.
     *
     * @param nsid
     */
    _checkNsid(nsid: string): string | undefined;
}
