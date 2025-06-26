import { AbstractValidate } from "../abstract-validate/abstract-validate";
export declare class ValidateAttachments extends AbstractValidate {
    getCommandName(): string;
    getDescription(): string;
    getErrors(errors: Array<string>): void;
    _getPlanetAttachmentNsids(): Array<string>;
    _getSystemAttachmentNsids(): Array<string>;
}
