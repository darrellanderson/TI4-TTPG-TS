import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CreateZoomedUiType } from "../../zoomable-ui/zoomable-ui";
import { ZoomedStrategyCardUI } from "./zoomed-strategy-card-ui";

it("static generateCreateZoomedUi", () => {
  const strategyCardNumber: number = 1;
  const createZoomedUi: CreateZoomedUiType =
    ZoomedStrategyCardUI.generateCreateZoomedUi(strategyCardNumber);
  const _ui: AbstractUI = createZoomedUi(1);
});

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  new ZoomedStrategyCardUI(scale, playerSlot).destroy();
});

it("various strategy card numbers", () => {
  const scale: number = 1;
  new ZoomedStrategyCardUI(scale, 1);
  new ZoomedStrategyCardUI(scale, 2);
  new ZoomedStrategyCardUI(scale, 3);
  new ZoomedStrategyCardUI(scale, 4);
  new ZoomedStrategyCardUI(scale, 5);
  new ZoomedStrategyCardUI(scale, 6);
  new ZoomedStrategyCardUI(scale, 7);
  new ZoomedStrategyCardUI(scale, 8);
});
