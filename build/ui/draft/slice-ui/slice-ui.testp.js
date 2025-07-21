"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
const slice_ui_1 = require("./slice-ui");
function go() {
    const slice = [91, 22, 23, 24, 25];
    const color = new api_1.Color(0.5, 0.5, 0.5, 1);
    const scale = 2;
    const sliceUI = new slice_ui_1.SliceUI(slice, milty_1.MILTY_SLICE_SHAPE, color, scale);
    const widget = sliceUI.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = sliceUI.getSize().w;
    screenUI.height = sliceUI.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
    sliceUI.setLabel("123456789 123456789 123456789 123");
}
setTimeout(go, 1000);
//# sourceMappingURL=slice-ui.testp.js.map