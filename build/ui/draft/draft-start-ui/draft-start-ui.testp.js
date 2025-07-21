"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const draft_start_ui_1 = require("./draft-start-ui");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
function _goDirect() {
    const scale = 1;
    const params = {
        namespaceId: "@test/test",
        draft: new milty_1.Milty(),
        numSlices: 2,
        numFactions: 2,
        config: "",
    };
    const draftStartUi = new draft_start_ui_1.DraftStartUI(scale, params);
    const widget = draftStartUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = draftStartUi.getSize().w;
    screenUI.height = draftStartUi.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(_goDirect, 100);
//# sourceMappingURL=draft-start-ui.testp.js.map