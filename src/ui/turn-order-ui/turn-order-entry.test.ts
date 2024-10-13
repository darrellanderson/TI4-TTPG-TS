import { TurnEntryWidget, TurnOrderWidgetParams } from "ttpg-darrell";

import { TurnOrderEntry } from "./turn-order-entry";
import { Color } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

it("constructor", () => {
  const params: TurnOrderWidgetParams = {};
  const turnEntryWidget = new TurnEntryWidget(params);
  new TurnOrderEntry(turnEntryWidget);
});

it("update (zero strategy cards)", () => {
  TI4.turnOrder.setTurnOrder([3], "forward", 3);
  expect(TI4.turnOrder.getTurnOrder()[0]).toBe(3);

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
