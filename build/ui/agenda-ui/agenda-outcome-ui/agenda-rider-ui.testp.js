"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const agenda_rider_ui_1 = require("./agenda-rider-ui");
const agenda_state_1 = require("../../../lib/agenda-lib/agenda-state/agenda-state");
function go() {
    const agendaState = new agenda_state_1.AgendaState("@test/test");
    const outcomeIndex = 0;
    const scale = 1;
    const abstractUi = new agenda_rider_ui_1.AgendaRiderUI(agendaState, outcomeIndex, scale);
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
    // Instead of finding a rider, use the agenda card to test.
    const riderCard = api_1.world.getObjectById("rider");
    if (!riderCard) {
        throw new Error(`Object with ID "rider" not found`);
    }
    const seatIndex = 1;
    agendaState.addRider(seatIndex, riderCard.getId(), outcomeIndex);
}
setTimeout(go, 100);
//# sourceMappingURL=agenda-rider-ui.testp.js.map