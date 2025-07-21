"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const milty_1 = require("./milty");
const draft_activity_start_1 = require("../draft-activity-start/draft-activity-start");
const draft_state_1 = require("../draft-state/draft-state");
const draft = new milty_1.Milty();
const params = {
    namespaceId: "@test/test",
    draft,
    numSlices: 8,
    numFactions: 9,
    config: "",
};
const errors = [];
function go() {
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
setTimeout(go, 250);
//# sourceMappingURL=milty.testp.js.map