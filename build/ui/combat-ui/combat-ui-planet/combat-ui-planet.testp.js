"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const combat_ui_planet_1 = require("./combat-ui-planet");
function go() {
    const system = TI4.systemRegistry.getBySystemTileNumber(19);
    if (!system) {
        throw new Error("system is undefined");
    }
    const player = api_1.world.getAllPlayers()[0];
    if (!player) {
        throw new Error("player is undefined");
    }
    TI4.events.onSystemActivated.trigger(system, player);
    const planetIndex = 0;
    const scale = 1;
    const abstractUi = new combat_ui_planet_1.CombatUIPlanet(planetIndex, scale);
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
//# sourceMappingURL=combat-ui-planet.testp.js.map