"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draft_activity_start_1 = require("../draft-activity-start/draft-activity-start");
const draft_state_1 = require("../draft-state/draft-state");
const wekker_1 = require("./wekker");
const draft = new wekker_1.Wekker();
const params = {
    namespaceId: "@test/test",
    draft,
    numSlices: 8,
    numFactions: 9,
    config: "",
};
const errors = [];
function go() {
    try {
        if (draft_state_1.DraftState.isDraftInProgress("@TI4/draft")) {
            // Draft is in progress.
            console.log("Draft is in progress");
        }
        else {
            const draftActivityStart = new draft_activity_start_1.DraftActivityStart();
            const success = draftActivityStart.start(params, errors);
            if (!success) {
                throw new Error("DraftActivityStart failed");
            }
            console.log("Draft starting");
        }
    }
    catch (e) {
        console.error("DraftActivityStart failed", e);
    }
}
setTimeout(go, 250);
//# sourceMappingURL=wekker.testp.js.map