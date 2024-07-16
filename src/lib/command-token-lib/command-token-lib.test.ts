import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { CommandTokenAllocation, CommandTokenLib } from "./command-token-lib";

it("constructor", () => {
  const commandTokenLib = new CommandTokenLib();
  expect(commandTokenLib).toBeDefined();
});

it("getPlayerSlotToCommandTokenAllocations", () => {
  // Objects link to closest card holder.
  new MockCardHolder({ owningPlayerSlot: 3 });

  new MockGameObject({
    templateMetadata: "sheet:base/command",
    position: [0, -0.96, 0],
  });

  new MockGameObject({
    id: "tactic",
    templateMetadata: "token:base/command",
    position: [1, 0, 0],
  });
  new MockGameObject({
    id: "fleet",
    templateMetadata: "token:base/command",
    position: [1, 1, 0],
  });
  new MockGameObject({
    id: "strategy",
    templateMetadata: "token:base/command",
    position: [-1, 1, 0],
  });

  const commandTokenLib = new CommandTokenLib();
  const playerSlotToCommandTokenAllocations: Map<
    number,
    CommandTokenAllocation
  > = commandTokenLib.getPlayerSlotToCommandTokenAllocations();
  const commandTokenAllocation: CommandTokenAllocation | undefined =
    playerSlotToCommandTokenAllocations.get(3);
  expect(commandTokenAllocation?.tactic.map((x) => x.getId())).toEqual([
    "tactic",
  ]);
  expect(commandTokenAllocation?.fleet.map((x) => x.getId())).toEqual([
    "fleet",
  ]);
  expect(commandTokenAllocation?.strategy.map((x) => x.getId())).toEqual([
    "strategy",
  ]);
});
