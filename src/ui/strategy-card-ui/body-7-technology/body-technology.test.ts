import { clickAll } from "ttpg-mock";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { BodyTechnology } from "./body-technology";
import { Widget } from "@tabletop-playground/api";

it("constructor/getters", () => {
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const playerSlot: number = 10;
  const body = new BodyTechnology(strategyCardsState, playerSlot);
  expect(body.getStrategyCardName()).toBe("Technology");
  expect(body.getStrategyCardNumber()).toBe(7);
  expect(body.getBody(1)).toBeDefined();
  expect(body.getReport()).toBeUndefined();

  const widget: Widget | undefined = body.getBody(1)?.getWidget();
  if (widget) {
    clickAll(widget);
  }
});
