import { DraftActivityStartParams } from "../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { Milty } from "../../lib/draft-lib/drafts/milty";
import { OnSliceDraftRequest } from "./on-slice-draft-request";

it("constructor/init", () => {
  new OnSliceDraftRequest().init();
});

it("event", () => {
  // Use the global OnSliceDraftRequest
  const draftActivityStartParams: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 0,
    numFactions: 0,
    config: "",
  };
  TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
});
