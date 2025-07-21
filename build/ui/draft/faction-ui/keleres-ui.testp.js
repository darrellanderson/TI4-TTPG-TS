"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const keleres_ui_1 = require("./keleres-ui");
const draft_state_1 = require("../../../lib/draft-lib/draft-state/draft-state");
function go() {
    const faction = TI4.factionRegistry.getByNsidName("keleres-argent");
    if (!faction) {
        throw new Error("Faction not found");
    }
    const draftState = new draft_state_1.DraftState("@test/test");
    draftState.setFactions([faction]);
    const keleresUi = new keleres_ui_1.KeleresUI(draftState, 1);
    const widget = keleresUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = keleresUi.getSize().w;
    screenUI.height = keleresUi.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = widget;
    api_1.world.addScreenUI(screenUI);
}
setTimeout(go, 1000);
//# sourceMappingURL=keleres-ui.testp.js.map