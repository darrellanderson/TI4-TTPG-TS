"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const draft_state_1 = require("../draft-state/draft-state");
const draft_activity_finish_1 = require("./draft-activity-finish");
const draftState = new draft_state_1.DraftState("@test/test");
const draftActivityFinish = new draft_activity_finish_1.DraftActivityFinish(draftState);
draftState.setSpeakerIndex(0);
process.nextTick(() => {
    draftActivityFinish.moveSpeakerToken();
});
//# sourceMappingURL=draft-activity-finish.testp.js.map