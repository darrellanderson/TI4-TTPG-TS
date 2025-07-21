"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const draft_state_1 = require("../../../lib/draft-lib/draft-state/draft-state");
const draft_state_ui_1 = require("./draft-state-ui");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
const abstract_window_1 = require("../../abstract-window/abstract-window");
const draftState = new draft_state_1.DraftState("@test/draft-state")
    .setSliceShape(milty_1.MILTY_SLICE_SHAPE)
    .setSlices([
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
    [41, 42, 43, 44, 45],
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
    [41, 42, 43, 44, 45],
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
])
    .setFactions(["faction:base/arborec", "faction:base/sol", "faction:base/naalu"].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid)))
    .setSpeakerIndex(1);
function _goDirect() {
    const draftStateUi = new draft_state_ui_1.DraftStateUI(draftState, 1);
    const widget = draftStateUi.getWidget();
    const screenUI = new api_1.ScreenUIElement();
    screenUI.positionX = 0.5;
    screenUI.positionY = 0.5;
    screenUI.relativePositionX = true;
    screenUI.relativePositionY = true;
    screenUI.width = draftStateUi.getSize().w;
    screenUI.height = draftStateUi.getSize().h;
    screenUI.relativeWidth = false;
    screenUI.relativeHeight = false;
    screenUI.anchorX = 0.5;
    screenUI.anchorY = 0.5;
    screenUI.widget = new api_1.Border().setChild(widget);
    api_1.world.addScreenUI(screenUI);
}
function _goWindow() {
    new abstract_window_1.AbstractWindow((params) => {
        return new draft_state_ui_1.DraftStateUI(draftState, params.scale);
    }, "@test/draft-state-ui", "Draft")
        .createWindow()
        .attach();
}
setTimeout(_goWindow, 100);
//# sourceMappingURL=draft-state-ui.testp.js.map