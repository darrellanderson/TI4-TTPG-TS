import { Player } from "@tabletop-playground/api";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";
export declare class SlashPerf extends AbstractSlashCommand {
    private _perfWidget;
    getSlashCommand(): `/${string}`;
    getDescription(): string;
    isHostOnly(): boolean;
    run(_argv: Array<string>, player: Player): void;
}
