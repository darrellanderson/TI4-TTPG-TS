"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const draft_activity_start_params_1 = require("../../../lib/draft-lib/draft-activity-start/draft-activity-start-params");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
const scpt_draft_button_ui_1 = require("./scpt-draft-button-ui");
function _goDirect() {
    const scale = 1;
    const scptDraftParams = {
        label: "YEAR",
        qual: {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: 6,
            numFactions: 6,
            config: "",
        },
    };
    const onDraftStarted = new ttpg_darrell_1.TriggerableMulticastDelegate();
    const abstractUi = new scpt_draft_button_ui_1.ScptDraftButtonUI(scale, scptDraftParams, onDraftStarted);
    const widget = abstractUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = abstractUi.getSize().w;
    screenUI.height = abstractUi.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
setTimeout(_goDirect, 100);
//# sourceMappingURL=scpt-draft-button-ui.testp.js.map