"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const agenda_card_ui_1 = require("./agenda-card-ui");
function go() {
    const agendaCardObjId = "agenda";
    const agendaCard = api_1.world.getObjectById(agendaCardObjId);
    if (!agendaCard || !(agendaCard instanceof api_1.Card)) {
        throw new Error(`Object with ID "${agendaCardObjId}" is not a Card`);
    }
    const scale = 1;
    const abstractUi = new agenda_card_ui_1.AgendaCardUI(agendaCard, scale);
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
}
setTimeout(go, 1000);
//# sourceMappingURL=agenda-card-ui.testp.js.map