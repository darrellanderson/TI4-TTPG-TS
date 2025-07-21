import { AbstractValidate } from "../abstract-validate/abstract-validate";
/**
 * Get planet cards NSIDs, spawn planet decks and make sure all nsids exist.
 */
export declare class ValidatePlanetCards extends AbstractValidate {
    getCommandName(): string;
    getDescription(): string;
    getErrors(erros: Array<string>): void;
    _getRegisteredPlanetCardNsids(): Set<string>;
}
