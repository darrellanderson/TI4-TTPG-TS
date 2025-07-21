"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const faction_ui_1 = require("./faction-ui");
function go() {
    const faction = TI4.factionRegistry.getByNsidName("arborec");
    if (!faction) {
        throw new Error("Faction not found");
    }
    const factionUi = new faction_ui_1.FactionUI(faction, 1);
    const widget = factionUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = factionUi.getSize().w;
    screenUI.height = factionUi.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=faction-ui.testp.js.map