"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const player_tech_summary_1 = require("../../lib/tech-lib/player-tech-summary/player-tech-summary");
const single_tech_ui_1 = require("./single-tech-ui");
function go() {
    const scale = 1;
    const tech = TI4.techRegistry.getByNsid("card.technology.blue:base/antimass-deflectors");
    const faction = undefined;
    const playerTechSummary = new player_tech_summary_1.PlayerTechSummary(10);
    const abstractUi = new single_tech_ui_1.SingleTechUI(scale, tech, faction, playerTechSummary);
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
//# sourceMappingURL=single-tech-ui.testp.js.map