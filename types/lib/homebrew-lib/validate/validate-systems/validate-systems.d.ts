import { AbstractValidate } from "../abstract-validate/abstract-validate";
export declare class ValidateSystems extends AbstractValidate {
    getCommandName(): string;
    getDescription(): string;
    getErrors(errors: Array<string>): void;
}
