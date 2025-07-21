"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const seat_ui_1 = require("./seat-ui");
function go() {
    const seatIndex = 0;
    const speakerIndex = 0;
    const scale = 1;
    const seatUi = new seat_ui_1.SeatUI(seatIndex, speakerIndex, scale);
    const widget = seatUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = seatUi.getSize().w;
    screenUI.height = seatUi.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=seat-ui.testp.js.map