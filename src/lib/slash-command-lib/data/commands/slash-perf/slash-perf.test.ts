import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";
import { SlashPerf } from "./slash-perf";

it("getSlashCommand", () => {
  const cmd: AbstractSlashCommand = new SlashPerf();
  expect(cmd.getSlashCommand()).toBe("/perf");
});

it("isHostOnly", () => {
  const cmd: AbstractSlashCommand = new SlashPerf();
  expect(cmd.isHostOnly()).toBe(true);
});

it("run", () => {
  const cmd: AbstractSlashCommand = new SlashPerf();
  const player = { getSlot: () => 1 } as any;
  expect(() => cmd.run([], player)).not.toThrow();

  // Run again to toggle off.
  expect(() => cmd.run([], player)).not.toThrow();
});
