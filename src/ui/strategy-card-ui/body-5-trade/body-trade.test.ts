import { Widget } from "@tabletop-playground/api";
import { clickAll, MockCardHolder } from "ttpg-mock";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyTrade } from "./body-trade";
import { AbstractUI } from "../../abstract-ui/abtract-ui";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyTrade(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Trade");
  expect(body.getStrategyCardNumber()).toBe(5);
  expect(body.getBody(1)).toBeUndefined();
  expect(body.getReport()).toBeUndefined();

  // Get for playing player.
  strategyCardsState.setLastPlayerSlotPlayed(5, playerSlot);
  expect(body.getBody(1)).toBeDefined();

  body.getBody(1)?.destroy();
});

it("clickAll", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11, // must be different from playing player slot to appear
  });
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  strategyCardsState.setLastPlayerSlotPlayed(5, playerSlot);
  const body = new BodyTrade(strategyCardsState, playerSlot);
  const abstractUi: AbstractUI | undefined = body.getBody(1);
  if (!abstractUi) {
    throw new Error("AbstractUI is undefined.");
  }
  const widget: Widget = abstractUi.getWidget();
  clickAll(widget);

  // Load from state.
  new BodyTrade(strategyCardsState, playerSlot);

  clickAll(widget); // again
});
