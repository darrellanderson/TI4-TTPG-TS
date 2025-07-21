"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const map_ui_1 = require("../map-ui/map-ui");
const zoomable_ui_fully_clickable_1 = require("./zoomable-ui-fully-clickable");
function go() {
    const mapString = "19 -110 -111 1 91";
    const hexToLabel = new Map();
    const scale = 1;
    const mapUi = new map_ui_1.MapUI(mapString, hexToLabel, scale);
    const createZoomedUI = (newScale) => {
        console.log("createZoomedUI", newScale);
        return new map_ui_1.MapUI(mapString, hexToLabel, newScale * 3);
    };
    const zoomableUi = new zoomable_ui_fully_clickable_1.ZoomableUiFullyClickable(mapUi, scale, createZoomedUI);
    const widget = zoomableUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = zoomableUi.getSize().w + 4; // border
    screenUI.height = zoomableUi.getSize().h + 4;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=zoomable-ui-fully-clickable.testp.js.map