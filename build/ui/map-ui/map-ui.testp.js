"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const map_ui_1 = require("./map-ui");
function go() {
    const mapString = "19 -110 -111 1 91";
    const hexToLabel = new Map();
    const scale = 1;
    hexToLabel.set("<0,0,0>", "Mecatol Rex");
    const mapUI = new map_ui_1.MapUI(mapString, hexToLabel, scale);
    const widget = mapUI.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = mapUI.getSize().w + 4; // border
    screenUI.height = mapUI.getSize().h + 4;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=map-ui.testp.js.map