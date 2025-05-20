import { SlashCommandEntry } from "lib/slash-command-lib/slash-command-registry/slash-command-registry";
import { SlashToggleUnits } from "./slash-toggle-units";
import { Player } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";

it("call", () => {
  const cmd: SlashCommandEntry = SlashToggleUnits;
  expect(cmd.slashCommand).toBe("/toggleunits");

  const argv: Array<string> = [];
  const player: Player = new MockPlayer();
  cmd.action(argv, player);
});
