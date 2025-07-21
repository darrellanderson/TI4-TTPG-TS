"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const change_color_ui_1 = require("./change-color-ui");
function go() {
    const playerSlot = 10;
    const scale = 1;
    const abstractUi = new change_color_ui_1.ChangeColorUI(playerSlot, scale);
    const widget = abstractUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = abstractUi.getSize().w + 4; // border
    screenUI.height = abstractUi.getSize().h + 4;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 100);
//# sourceMappingURL=change-color-ui.testp.js.map