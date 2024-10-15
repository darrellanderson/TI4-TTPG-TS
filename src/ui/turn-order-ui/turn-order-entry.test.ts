import { Color, GameObject } from "@tabletop-playground/api";
import { TurnEntryWidget, TurnOrderWidgetParams } from "ttpg-darrell";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { Scoreboard } from "../../lib/score-lib/scoreboard/scoreboard";
import { TurnOrderEntry } from "./turn-order-entry";

it("constructor", () => {
  const params: TurnOrderWidgetParams = {};
  const turnEntryWidget = new TurnEntryWidget(params);
  new TurnOrderEntry(turnEntryWidget);
});

it("update (zero strategy cards, scoreboard, faction)", () => {
  TI4.turnOrder.setTurnOrder([3], "forward", 3);
  expect(TI4.turnOrder.getTurnOrder()[0]).toBe(3);

  MockGameObject.simple("token:base/scoreboard");
  const controlToken: GameObject = MockGameObject.simple(
    "token.control:base/sol",
    {
      owningPlayerSlot: 3,
    }
  );

  new MockCardHolder({ position: [10, 0, 0], owningPlayerSlot: 3 });
  new MockGameObject({
    position: [10, 0, 0],
    templateMetadata: "sheet.faction:base/arborec",
  });
  expect(TI4.factionRegistry.getByPlayerSlot(3)?.getName()).toBe("The Arborec");

  const scoreboard = new Scoreboard();
  const found: GameObject | undefined = scoreboard
    .getPlayerSlotToLeadControlToken()
    .get(3);
  expect(found?.getId()).toBe(controlToken.getId());
  const score: number | undefined = scoreboard.posToScore(
    controlToken.getPosition()
  );
  expect(score).toBe(5);

  const params: TurnOrderWidgetParams = {};
  const turnEntryWidget = new TurnEntryWidget(params);
  const turnOrderEntry = new TurnOrderEntry(turnEntryWidget);

  const playerSlot: number = 3;
  const fgColor = new Color(1, 1, 1, 1);
  const bgColor = new Color(0, 0, 0, 1);
  turnOrderEntry.update(playerSlot, fgColor, bgColor);
});

it("update (one strategy card)", () => {
  TI4.turnOrder.setTurnOrder([3], "forward", 3);
  new MockCardHolder({ owningPlayerSlot: 3 });
  MockGameObject.simple("tile.strategy-card:base/leadership");

  const params: TurnOrderWidgetParams = {};
  const turnEntryWidget = new TurnEntryWidget(params);
  const turnOrderEntry = new TurnOrderEntry(turnEntryWidget);

  const playerSlot: number = 3;
  const fgColor = new Color(1, 1, 1, 1);
  const bgColor = new Color(0, 0, 0, 1);
  turnOrderEntry.update(playerSlot, fgColor, bgColor);
});

it("update (two strategy cards)", () => {
  TI4.turnOrder.setTurnOrder([3], "forward", 3);
  new MockCardHolder({ owningPlayerSlot: 3 });
  MockGameObject.simple("tile.strategy-card:base/leadership");
  MockGameObject.simple("tile.strategy-card:base/diplomacy");

  const params: TurnOrderWidgetParams = {};
  const turnEntryWidget = new TurnEntryWidget(params);
  const turnOrderEntry = new TurnOrderEntry(turnEntryWidget);

  const playerSlot: number = 3;
  const fgColor = new Color(1, 1, 1, 1);
  const bgColor = new Color(0, 0, 0, 1);
  turnOrderEntry.update(playerSlot, fgColor, bgColor);
});
