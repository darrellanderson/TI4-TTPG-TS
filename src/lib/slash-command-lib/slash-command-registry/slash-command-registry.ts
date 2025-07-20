import { Color, globalEvents, Player, world } from "@tabletop-playground/api";
import { Broadcast, IGlobal } from "ttpg-darrell";
import { SLASH_COMMANDS } from "../data/slash-command.data";
import { AbstractSlashCommand } from "../data/commands/abstract-slash-command/abstract-slash-command";

export class SlashCommandRegistry implements IGlobal {
  private readonly _commandToAction: Map<string, AbstractSlashCommand> =
    new Map();

  private readonly _onChat = (sender: Player, message: string): void => {
    message = message.trim();

    if (message.startsWith("/")) {
      const argv: Array<string> = message.split(" ");
      let command: string | undefined = argv.shift();
      if (command) {
        command = command.toLowerCase();
        const entry: AbstractSlashCommand | undefined =
          this._commandToAction.get(command);
        if (entry) {
          // Commands may be marked as host only.
          if (entry.isHostOnly() && !sender.isHost()) {
            const playerName: string = TI4.playerName.getByPlayer(sender);
            const color: Color = world.getSlotColor(sender.getSlot());
            const msg: string = `${playerName} tried to run ${command} but is not host.`;
            Broadcast.chatAll(msg, color);
            return;
          }

          entry.run(argv, sender);

          const playerName: string = TI4.playerName.getByPlayer(sender);
          const color: Color = world.getSlotColor(sender.getSlot());
          const msg: string = `${playerName} ran "${command}"`;
          Broadcast.chatAll(msg, color);
        }
      }
    }

    if (message === "/") {
      Broadcast.chatOne(sender, "Available slash commands:");
      for (const actions of this._commandToAction.values()) {
        const command: string = actions.getSlashCommand();
        const description: string = actions.getDescription();
        Broadcast.chatOne(sender, `${command}: ${description}`);
      }
    }
  };

  init(): void {
    globalEvents.onChatMessage.add(this._onChat);
  }

  load(commands: Array<AbstractSlashCommand>): this {
    commands.forEach((command: AbstractSlashCommand) => {
      const slashCommand: string = command.getSlashCommand().toLowerCase();
      // Must be unique.
      if (this._commandToAction.has(slashCommand)) {
        throw new Error(`Duplicate slash command: ${slashCommand}`);
      }
      this._commandToAction.set(slashCommand, command);
    });
    return this;
  }

  public loadDefaultData(): this {
    this.load(SLASH_COMMANDS);
    return this;
  }
}
