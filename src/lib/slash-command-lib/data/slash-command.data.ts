import { AbstractSlashCommand } from "./commands/abstract-slash-command/abstract-slash-command";
import { SlashPerf } from "./commands/slash-perf/slash-perf";
import { SlashToggleUnits } from "./commands/slash-toggle-units/slash-toggle-units";

export const SLASH_COMMANDS: Array<AbstractSlashCommand> = [
  new SlashPerf(),
  new SlashToggleUnits(),
];
