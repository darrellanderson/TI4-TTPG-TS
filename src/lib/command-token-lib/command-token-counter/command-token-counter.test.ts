import { MockCardHolder, MockGameObject } from "ttpg-mock";
import {
  CommandTokenCounter,
  CommandTokenCounts,
} from "./command-token-counter";

it("constructor", () => {
  new CommandTokenCounter();
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
    templateMetadata: "token.command:base/sol",
    position: [1, 0, 0],
  });
  new MockGameObject({
    id: "fleet",
    templateMetadata: "token.command:base/sol",
    position: [1, 1, 0],
  });
  new MockGameObject({
    id: "strategy",
    templateMetadata: "token.command:base/sol",
    position: [-1, 1, 0],
  });

  const commandTokenCounter = new CommandTokenCounter();
  const playerSlotToCommandTokenTypes: Map<number, CommandTokenCounts> =
    commandTokenCounter.getPlayerSlotToCommandTokenCounts();
  const commandTokenCounts: CommandTokenCounts | undefined =
    playerSlotToCommandTokenTypes.get(3);
  expect(commandTokenCounts?.tactic.map((x) => x.getId())).toEqual(["tactic"]);
  expect(commandTokenCounts?.fleet.map((x) => x.getId())).toEqual(["fleet"]);
  expect(commandTokenCounts?.strategy.map((x) => x.getId())).toEqual([
    "strategy",
  ]);
});
