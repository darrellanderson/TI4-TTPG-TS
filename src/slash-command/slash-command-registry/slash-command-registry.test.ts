import { Player } from "@tabletop-playground/api";
import {
  SlashCommandEntry,
  SlashCommandRegistry,
} from "./slash-command-registry";
import { mockGlobalEvents, MockPlayer } from "ttpg-mock";

it("constructor/init", () => {
  const registry = new SlashCommandRegistry();
  registry.init();
});

it("load", () => {
  const registry = new SlashCommandRegistry();
  registry.init();

  const commands: Array<SlashCommandEntry> = [
    {
      slashCommand: "/test",
      action: (_argv: Array<string>, _player: Player) => {},
    },
  ];
  registry.load(commands);
});

it("load (dup)", () => {
  const registry = new SlashCommandRegistry();
  registry.init();

  const commands: Array<SlashCommandEntry> = [
    {
      slashCommand: "/test",
      action: (_argv: Array<string>, _player: Player) => {},
    },
    {
      slashCommand: "/test",
      action: (_argv: Array<string>, _player: Player) => {},
    },
  ];
  expect(() => {
    registry.load(commands);
  }).toThrow(/Duplicate slash command: \/test/);
});

it("event", () => {
  const registry = new SlashCommandRegistry();
  registry.init();

  let callCount: number = 0;
  const callValues: Array<string> = [];
  const commands: Array<SlashCommandEntry> = [
    {
      slashCommand: "/test",
      action: (argv: Array<string>, _player: Player) => {
        callCount++;
        callValues.push(...argv);
      },
    },
  ];
  registry.load(commands);

  const sender: Player = new MockPlayer();
  mockGlobalEvents._chatMessageAsPlayer(sender, "/test foo bar");

  expect(callCount).toBe(1);
  expect(callValues).toEqual(["foo", "bar"]);
});

it("loadDefaultData", () => {
  const registry = new SlashCommandRegistry();
  registry.init();
  registry.loadDefaultData();
});
