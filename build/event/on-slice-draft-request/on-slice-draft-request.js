"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnSliceDraftRequest = void 0;
const draft_start_ui_1 = require("../../ui/draft/draft-start-ui/draft-start-ui");
class OnSliceDraftRequest {
    init() {
        TI4.events.onSliceDraftRequest.add((draftActivityStartParams) => {
            new draft_start_ui_1.DraftStartUI(1, draftActivityStartParams).startDraft();
        });
    }
}
exports.OnSliceDraftRequest = OnSliceDraftRequest;
//# sourceMappingURL=on-slice-draft-request.js.map