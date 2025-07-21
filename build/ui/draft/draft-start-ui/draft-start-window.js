"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftStartWindow = void 0;
const abstract_window_1 = require("../../abstract-window/abstract-window");
const draft_start_ui_1 = require("./draft-start-ui");
const draft_activity_start_params_1 = require("../../../lib/draft-lib/draft-activity-start/draft-activity-start-params");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
class DraftStartWindow {
    constructor() {
        this._window = undefined;
        this._onDraftStartedHandler = () => {
            if (this._window) {
                this._window.destroy();
                this._window = undefined;
            }
        };
        // This is mutable, window UI can change it.
        // It is *not* persisted, no point using persistent window with it.
        this._draftActivityStartParams = {
            namespaceId: draft_activity_start_params_1.DRAFT_NAMESPACE_ID,
            draft: new milty_1.Milty(),
            numSlices: TI4.config.playerCount,
            numFactions: TI4.config.playerCount,
            config: "",
        };
        this._createAbstractUI = (params) => {
            const draftStartUi = new draft_start_ui_1.DraftStartUI(params.scale, this._draftActivityStartParams);
            draftStartUi.onDraftStarted.add(this._onDraftStartedHandler);
            return draftStartUi;
        };
    }
    createAndAttachWindow(playerSlot) {
        const namespaceId = undefined;
        const abstractWindow = new abstract_window_1.AbstractWindow(this._createAbstractUI, namespaceId, "Draft Start");
        if (this._window) {
            this._window.destroy();
            this._window = undefined;
        }
        this._window = abstractWindow.createWindow([playerSlot]);
        this._window.attach();
    }
}
exports.DraftStartWindow = DraftStartWindow;
//# sourceMappingURL=draft-start-window.js.map