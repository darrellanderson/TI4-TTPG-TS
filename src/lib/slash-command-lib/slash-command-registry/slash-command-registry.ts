import { Color, globalEvents, Player, world } from "@tabletop-playground/api";
import { Broadcast, IGlobal } from "ttpg-darrell";
import { SLASH_COMMANDS } from "../data/slash-command.data";

export type SlashCommandEntry = {
  slashCommand: `/${string}`;
  action: (argv: Array<string>, player: Player) => void;
  hostOnly?: boolean;
};

export class SlashCommandRegistry implements IGlobal {
  private readonly _commandToAction: Map<string, SlashCommandEntry> = new Map();

  private readonly _onChat = (sender: Player, message: string): void => {
    if (message.startsWith("/")) {
      const argv: Array<string> = message.split(" ");
      let command: string | undefined = argv.shift();
      if (command) {
        command = command.toLowerCase();
        const entry: SlashCommandEntry | undefined =
          this._commandToAction.get(command);
        if (entry) {
          // Commands may be marked as host only.
          if (entry.hostOnly && !sender.isHost()) {
            const playerName: string = TI4.playerName.getByPlayer(sender);
            const color: Color = world.getSlotColor(sender.getSlot());
            const msg: string = `${playerName} tried to run ${command} but is not host.`;
            Broadcast.chatAll(msg, color);
            return;
          }

          entry.action(argv, sender);
        }
      }

      const playerName: string = TI4.playerName.getByPlayer(sender);
      const color: Color = world.getSlotColor(sender.getSlot());
      const msg: string = `${command} run by ${playerName}`;
      Broadcast.chatAll(msg, color);
    }
  };

  init(): void {
    globalEvents.onChatMessage.add(this._onChat);
  }

  load(commands: Array<SlashCommandEntry>): this {
    commands.forEach((command: SlashCommandEntry) => {
      // Must be unique.
      if (this._commandToAction.has(command.slashCommand)) {
        throw new Error(`Duplicate slash command: ${command.slashCommand}`);
      }
      this._commandToAction.set(command.slashCommand.toLowerCase(), command);
    });
    return this;
  }

  public loadDefaultData(): this {
    this.load(SLASH_COMMANDS);
    return this;
  }
}
