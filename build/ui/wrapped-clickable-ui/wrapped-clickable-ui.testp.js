"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const milty_1 = require("../../lib/draft-lib/drafts/milty");
const slice_ui_1 = require("../draft/slice-ui/slice-ui");
const wrapped_clickable_ui_1 = require("./wrapped-clickable-ui");
function go() {
    const scale = 3;
    const innerUi = new slice_ui_1.SliceUI([21, 22, 23, 24, 25], milty_1.MILTY_SLICE_SHAPE, new api_1.Color(0.5, 0.5, 0.5, 1), scale);
    const wrappedUi = new wrapped_clickable_ui_1.WrappedClickableUI(innerUi, scale);
    wrappedUi.getBorder().setColor([0, 1, 0, 1]);
    const widget = wrappedUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = wrappedUi.getSize().w + 1;
    screenUI.height = wrappedUi.getSize().h + 1;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.HorizontalBox().addChild(new api_1.VerticalBox().addChild(widget));
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=wrapped-clickable-ui.testp.js.map