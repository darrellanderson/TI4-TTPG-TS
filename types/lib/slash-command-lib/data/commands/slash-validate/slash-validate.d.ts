import { Player } from "@tabletop-playground/api";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";
export declare class SlashValidate extends AbstractSlashCommand {
    private readonly _validates;
    getSlashCommand(): `/${string}`;
    getDescription(): string;
    isHostOnly(): boolean;
    run(argv: Array<string>, player: Player): void;
}
