"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomedStrategyCardUI = void 0;
const api_1 = require("@tabletop-playground/api");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const packageId = api_1.refPackageId;
class ZoomedStrategyCardUI extends abtract_ui_1.AbstractUI {
    static generateCreateZoomedUi(strategyCardNumber) {
        return (scale) => new ZoomedStrategyCardUI(scale, strategyCardNumber);
    }
    constructor(scale, strategyCardNumber) {
        const imageWidget = new api_1.ImageWidget();
        const extraScale = 0.9;
        const size = {
            w: 512 * scale * extraScale,
            h: 512 * scale * extraScale,
        };
        super(imageWidget, size);
        let image = undefined;
        if (strategyCardNumber === 1) {
            image = "tile/strategy-card/strategy_01.png";
        }
        else if (strategyCardNumber === 2) {
            image = "tile/strategy-card/strategy_02-codex1.png";
        }
        else if (strategyCardNumber === 3) {
            image = "tile/strategy-card/strategy_03.png";
        }
        else if (strategyCardNumber === 4) {
            image = "tile/strategy-card/strategy_04-pok.png";
        }
        else if (strategyCardNumber === 5) {
            image = "tile/strategy-card/strategy_05.png";
        }
        else if (strategyCardNumber === 6) {
            image = "tile/strategy-card/strategy_06.png";
        }
        else if (strategyCardNumber === 7) {
            image = "tile/strategy-card/strategy_07.png";
        }
        else if (strategyCardNumber === 8) {
            image = "tile/strategy-card/strategy_08.png";
        }
        if (image) {
            imageWidget.setImage(image, packageId);
        }
    }
}
exports.ZoomedStrategyCardUI = ZoomedStrategyCardUI;
//# sourceMappingURL=zoomed-strategy-card-ui.js.map