import { Player } from "@tabletop-playground/api";
import { SlashCommandEntry } from "../../../slash-command-registry/slash-command-registry";

export const SlashToggleUnits: SlashCommandEntry = {
  slashCommand: "/toggleunits",
  action: (_argv: Array<string>, _player: Player): void => {
    // TODO
  },
};
