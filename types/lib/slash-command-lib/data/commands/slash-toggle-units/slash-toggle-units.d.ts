import { Player } from "@tabletop-playground/api";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";
export declare class SlashToggleUnits implements AbstractSlashCommand {
    getSlashCommand(): `/${string}`;
    isHostOnly(): boolean;
    run(_argv: Array<string>, _player: Player): void;
}
