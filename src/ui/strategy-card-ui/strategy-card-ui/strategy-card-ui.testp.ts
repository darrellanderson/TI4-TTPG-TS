import { Border, ScreenUIElement, world } from "@tabletop-playground/api";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { StrategyCardUI } from "./strategy-card-ui";
import { ButtonUI } from "../../button-ui/button-ui";

class MyAbstractStrategyCardUI extends StrategyCardUI {}

function go() {
  const scale: number = 1;
  const name: string = "name";
  const isPlay: boolean = true;
  const body: AbstractUI | undefined = new ButtonUI(scale);
  const abstractUi: AbstractUI = new MyAbstractStrategyCardUI(
    scale,
    name,
    isPlay,
    body
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

setTimeout(go, 100);
