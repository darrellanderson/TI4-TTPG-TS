import { Player } from "@tabletop-playground/api";
import { MockPlayer } from "ttpg-mock";
import { AbstractSlashCommand } from "./abstract-slash-command";

class MySlashCommand extends AbstractSlashCommand {
  getSlashCommand(): `/${string}` {
    return "/my-command";
  }

  getDescription(): string {
    return "This is a test command.";
  }

  isHostOnly(): boolean {
    return true;
  }

  run(_argv: Array<string>, _player: Player): void {}
}

it("getSlashCommand", () => {
  const command = new MySlashCommand();
  expect(command.getSlashCommand()).toBe("/my-command");
});

it("isHostOnly", () => {
  const command = new MySlashCommand();
  expect(command.isHostOnly()).toBe(true);
});

it("run", () => {
  const command = new MySlashCommand();
  expect(() => command.run([], new MockPlayer())).not.toThrow();
});
