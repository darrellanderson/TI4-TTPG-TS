import { MockCardHolder, MockGameObject } from "ttpg-mock";
import {
  CommandTokenAllocation,
  CommandTokenTypes,
} from "./command-token-allocation";

it("constructor", () => {
  new CommandTokenAllocation();
});

it("getPlayerSlotToCommandTokenTypes", () => {
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

  const commandTokenAllocation = new CommandTokenAllocation();
  const playerSlotToCommandTokenTypes: Map<number, CommandTokenTypes> =
    commandTokenAllocation.getPlayerSlotToCommandTokenTypes();
  const commandTokenTypes: CommandTokenTypes | undefined =
    playerSlotToCommandTokenTypes.get(3);
  expect(commandTokenTypes?.tactic.map((x) => x.getId())).toEqual(["tactic"]);
  expect(commandTokenTypes?.fleet.map((x) => x.getId())).toEqual(["fleet"]);
  expect(commandTokenTypes?.strategy.map((x) => x.getId())).toEqual([
    "strategy",
  ]);
});
