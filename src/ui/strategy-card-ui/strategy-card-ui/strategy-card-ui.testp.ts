import { Border, ScreenUIElement, world } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { IStrategyCardBody, StrategyCardUI } from "./strategy-card-ui";
import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
import { LabelUI } from "ui/button-ui/label-ui";

class MyAbstractStrategyCardBody implements IStrategyCardBody {
  getStrategyCardName(): string {
    return "test";
  }
  getStrategyCardNumber(): number {
    return 1;
  }
  getBody(scale: number): AbstractUI | undefined {
    const ui: LabelUI = new LabelUI(scale);
    ui.getText().setText("test body");
    return ui;
  }
  getReport(): string | undefined {
    return "my report";
  }
}

function go() {
  const scale: number = 1;
  const strategyCardsState = new StrategyCardsState("@test-strat-card/test");
  const strategyCardBody = new MyAbstractStrategyCardBody();
  const playerSlot = 10;
  const abstractUi: AbstractUI = new StrategyCardUI(
    scale,
    strategyCardsState,
    strategyCardBody,
    playerSlot
  );

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUi.getSize().w + 2;
  screenUI.height = abstractUi.getSize().h + 2;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(abstractUi.getWidget());

  world.addScreenUI(screenUI);
}

function goWrapper() {
  try {
    go();
  } catch (e) {
    console.error("Error in goWrapper:", e);
  }
}

setTimeout(goWrapper, 100);
