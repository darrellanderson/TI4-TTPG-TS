"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const combat_ui_space_1 = require("./combat-ui-space");
function go() {
    const scale = 1;
    const playerSlot = 10;
    const abstractUi = new combat_ui_space_1.CombatUISpace(scale, playerSlot);
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
setTimeout(go, 1000);
//# sourceMappingURL=combat-ui-space.testp.js.map