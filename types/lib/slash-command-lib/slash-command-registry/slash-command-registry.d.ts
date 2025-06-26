import { IGlobal } from "ttpg-darrell";
import { AbstractSlashCommand } from "../data/commands/abstract-slash-command/abstract-slash-command";
export declare class SlashCommandRegistry implements IGlobal {
    private readonly _commandToAction;
    private readonly _onChat;
    init(): void;
    load(commands: Array<AbstractSlashCommand>): this;
    loadDefaultData(): this;
}
