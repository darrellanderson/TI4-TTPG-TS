"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const agenda_state_1 = require("../../../lib/agenda-lib/agenda-state/agenda-state");
const agenda_vote_count_ui_1 = require("./agenda-vote-count-ui");
function go() {
    api_1.world.setSavedData("", "@test/test");
    const agendaState = new agenda_state_1.AgendaState("@test/test");
    const seatIndex = 0;
    const scale = 1;
    const abstractUi = new agenda_vote_count_ui_1.AgendaVoteCountUI(agendaState, seatIndex, scale);
    agendaState.onAgendaStateChanged.trigger(agendaState);
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
setTimeout(go, 100);
//# sourceMappingURL=agenda-vote-count-ui.testp.js.map