import { Milty } from "./milty";
import { IDraft } from "./idraft";
import { DraftActivityStart } from "../draft-activity-start/draft-activity-start";
import { DraftActivityStartParams } from "../draft-activity-start/draft-activity-start-params";
import { DraftState } from "../draft-state/draft-state";

const draft: IDraft = new Milty();

const params: DraftActivityStartParams = {
  namespaceId: "@test/test",
  draft,
  numSlices: 8,
  numFactions: 9,
  config: "",
};
const errors: Array<string> = [];

function go(): void {
  if (DraftState.isDraftInProgress("@TI4/draft")) {
    // Draft is in progress.
    console.log("Draft is in progress");
  } else {
    const draftActivityStart = new DraftActivityStart();
    const success: boolean = draftActivityStart.start(params, errors);
    if (!success) {
      throw new Error("DraftActivityStart failed");
    }
    console.log("Draft starting");
  }
}

setTimeout(go, 250);
