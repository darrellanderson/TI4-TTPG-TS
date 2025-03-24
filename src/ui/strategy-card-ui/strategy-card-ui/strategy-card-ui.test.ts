import { Widget } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
import { clickAll } from "ttpg-mock";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { ButtonUI } from "../../button-ui/button-ui";
import { IStrategyCardBody, StrategyCardUI } from "./strategy-card-ui";
import { StrategyCardsState } from "../../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";

class MyStrategyCardBodyReport implements IStrategyCardBody {
  getStrategyCardNumber(): number {
    return 1;
  }
  getBody(): AbstractUI | undefined {
    return new ButtonUI(1);
  }
  getReport(): string | undefined {
    return "report";
  }
}

class MyStrategyCardBodyNoReport implements IStrategyCardBody {
  getStrategyCardNumber(): number {
    return 1;
  }
  getBody(): AbstractUI | undefined {
    return undefined;
  }
  getReport(): string | undefined {
    return undefined;
  }
}

it("constructor/getters/destroy", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  );
  const body: IStrategyCardBody = new MyStrategyCardBodyReport();
  const playerSlot: PlayerSlot = 10;
  const ui: StrategyCardUI = new StrategyCardUI(
    scale,
    strategyCardsState,
    body,
    playerSlot
  );
  ui.getButtonPlay();
  ui.getButtonPass();
  ui.destroy();
});

it("getReport 1", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  ).setLastPlayerSlotPlayed(1, 10);
  const body: IStrategyCardBody = new MyStrategyCardBodyReport();
  const playerSlot: PlayerSlot = 10;
  const widget: Widget = new StrategyCardUI(
    scale,
    strategyCardsState,
    body,
    playerSlot
  ).getWidget();
  clickAll(widget);
});

it("getReport 2", () => {
  const scale: number = 1;
  const strategyCardsState: StrategyCardsState = new StrategyCardsState(
    "@test/test"
  ).setLastPlayerSlotPlayed(1, 11);
  const body: IStrategyCardBody = new MyStrategyCardBodyNoReport();
  const playerSlot: PlayerSlot = 10;
  const widget: Widget = new StrategyCardUI(
    scale,
    strategyCardsState,
    body,
    playerSlot
  ).getWidget();
  clickAll(widget);
});
