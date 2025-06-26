import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CreateZoomedUiType } from "../../zoomable-ui/zoomable-ui";
export declare class ZoomedStrategyCardUI extends AbstractUI {
    static generateCreateZoomedUi(strategyCardNumber: number): CreateZoomedUiType;
    constructor(scale: number, strategyCardNumber: number);
}
