import { Faction } from "../../../faction-lib/faction/faction";
import { AbstractValidate } from "../abstract-validate/abstract-validate";
export declare class ValidateFactions extends AbstractValidate {
    getCommandName(): string;
    getDescription(): string;
    getErrors(errors: Array<string>): void;
    _getBreakthroughNsids(faction: Faction): Array<string>;
    _getLeaderNsids(faction: Faction): Array<string>;
    _getTechNsids(faction: Faction): Array<string>;
    _getOtherNsids(faction: Faction): Array<string>;
}
