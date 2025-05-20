import { SlashCommandEntry } from "lib/slash-command-lib/slash-command-registry/slash-command-registry";
import { SlashToggleUnits } from "./slash-toggle-units";
import { Container, GameObject, Player } from "@tabletop-playground/api";
import { MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";

it("call", () => {
  const cmd: SlashCommandEntry = SlashToggleUnits;
  expect(cmd.slashCommand).toBe("/toggleunits");

  const unitInContainer: GameObject = MockGameObject.simple(
    "unit:base/destroyer"
  );
  const container: Container = new MockContainer({ items: [unitInContainer] });
  const unitOnTable: GameObject = MockGameObject.simple("unit:base/destroyer");

  expect(unitInContainer.isValid()).toBe(true);
  expect(unitOnTable.isValid()).toBe(true);
  expect(container.getNumItems()).toBe(1);

  const argv: Array<string> = [];
  const player: Player = new MockPlayer();
  cmd.action(argv, player);

  expect(unitInContainer.isValid()).toBe(false);
  expect(unitOnTable.isValid()).toBe(false);
  expect(container.getNumItems()).toBe(1);

  // Repeat, swapping back.
  cmd.action(argv, player);
});
