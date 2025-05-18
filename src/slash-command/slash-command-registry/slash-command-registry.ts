import { Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export type SlashCommandType = (argv: Array<string>, player: Player) => void;

export class SlashCommandRegistry implements IGlobal {
  private readonly _commandToAction: Map<string, SlashCommandType> = new Map();

  private readonly _onChat = (sender: Player, message: string): void => {
    if (message.startsWith("/")) {
      const argv: Array<string> = message.slice(1).split(" ");
      const command: string | undefined = argv.shift();
      if (command) {
        const action: SlashCommandType | undefined =
          this._commandToAction.get(command);
        if (action) {
          action(argv, sender);
        }
      }
    }
  };

  init(): void {}

  load(commandToAction: Map<string, SlashCommandType>): this {
    commandToAction.forEach((action: SlashCommandType, command: string) => {
      this._commandToAction.set(command, action);
    });
    return this;
  }

  public loadDefaultData(): this {
    // TODO
    return this;
  }
}
