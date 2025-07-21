"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const all_players_techs_ui_1 = require("./all-players-techs-ui");
const gameData = {
    players: [
        {
            technologies: [
                "Advanced Carrier II",
                "Antimass Deflectors",
                "Assault Cannon",
            ],
        },
        {
            technologies: ["Bioplasmosis", "Graviton Laser System"],
        },
    ],
};
const scale = 1;
const abstractUi = new all_players_techs_ui_1.AllPlayersTechsUI(scale, gameData);
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
screenUI.widget = new api_1.Border().setChild(abstractUi.getWidget());
api_1.world.addScreenUI(screenUI);
//# sourceMappingURL=all-players-techs-ui.testp.js.map