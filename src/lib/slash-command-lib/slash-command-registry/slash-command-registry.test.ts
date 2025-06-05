import { Player } from "@tabletop-playground/api";
import { mockGlobalEvents, MockPlayer } from "ttpg-mock";
import { SlashCommandRegistry } from "./slash-command-registry";
import { AbstractSlashCommand } from "../data/commands/abstract-slash-command/abstract-slash-command";

class MySlashCommand extends AbstractSlashCommand {
  public _callCount: number = 0;
  public _callValues: Array<string> = [];

  getSlashCommand(): `/${string}` {
    return "/my-command";
  }

  isHostOnly(): boolean {
    return true;
  }

  run(_argv: Array<string>, _player: Player): void {
    this._callCount++;
    this._callValues.push(..._argv);
  }
}

it("constructor/init", () => {
  const registry = new SlashCommandRegistry();
  registry.init();
});

it("load", () => {
  const registry = new SlashCommandRegistry();
  registry.init();

  const commands: Array<AbstractSlashCommand> = [new MySlashCommand()];
  registry.load(commands);
});

it("load (dup)", () => {
  const registry = new SlashCommandRegistry();
  registry.init();

  const commands: Array<AbstractSlashCommand> = [
    new MySlashCommand(),
    new MySlashCommand(),
  ];

  expect(() => {
    registry.load(commands);
  }).toThrow(/Duplicate slash command: \/my-command/);
});

it("event (is-host)", () => {
  const mySlashCommand = new MySlashCommand();
  const commands: Array<AbstractSlashCommand> = [mySlashCommand];

  const registry = new SlashCommandRegistry();
  registry.init();
  registry.load(commands);

  const sender: Player = new MockPlayer({ isHost: true });
  mockGlobalEvents._chatMessageAsPlayer(sender, "/my-command foo bar");

  expect(mySlashCommand._callCount).toBe(1);
  expect(mySlashCommand._callValues).toEqual(["foo", "bar"]);
});

it("event (host only)", () => {
  const mySlashCommand = new MySlashCommand();
  const commands: Array<AbstractSlashCommand> = [mySlashCommand];

  const registry = new SlashCommandRegistry();
  registry.init();
  registry.load(commands);

  const sender: Player = new MockPlayer({ isHost: false });
  mockGlobalEvents._chatMessageAsPlayer(sender, "/my-command foo bar");

  expect(mySlashCommand._callCount).toBe(0);
  expect(mySlashCommand._callValues).toEqual([]);
});

it("loadDefaultData", () => {
  const registry = new SlashCommandRegistry();
  registry.init();
  registry.loadDefaultData();
});
