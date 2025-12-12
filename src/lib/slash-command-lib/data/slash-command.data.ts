import { AbstractSlashCommand } from "./commands/abstract-slash-command/abstract-slash-command";
import { SlashPerf } from "./commands/slash-perf/slash-perf";
import { SlashPlague } from "./commands/slash-plague/slash-plague";
import { SlashToggleUnits } from "./commands/slash-toggle-units/slash-toggle-units";
import { SlashValidate } from "./commands/slash-validate/slash-validate";

export const SLASH_COMMANDS: Array<AbstractSlashCommand> = [
  new SlashPerf(),
  new SlashPlague(),
  new SlashToggleUnits(),
  new SlashValidate(),
];
