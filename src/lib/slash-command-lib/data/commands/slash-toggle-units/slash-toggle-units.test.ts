import { SlashToggleUnits } from "./slash-toggle-units";
import { Container, GameObject, Player } from "@tabletop-playground/api";
import { MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";

it("getSlashCommand", () => {
  const cmd: AbstractSlashCommand = new SlashToggleUnits();
  expect(cmd.getSlashCommand()).toBe("/toggleunits");
});

it("isHostOnly", () => {
  const cmd: AbstractSlashCommand = new SlashToggleUnits();
  expect(cmd.isHostOnly()).toBe(true);
});

it("call", () => {
  const cmd: AbstractSlashCommand = new SlashToggleUnits();

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
  cmd.run(argv, player);

  expect(unitInContainer.isValid()).toBe(false);
  expect(unitOnTable.isValid()).toBe(false);
  expect(container.getNumItems()).toBe(1);

  // Repeat, swapping back.
  cmd.run(argv, player);
});
