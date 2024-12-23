import { Milty } from "./milty";
import { IDraft } from "./idraft";
import {
  DraftActivityStart,
  DraftActivityStartParams,
} from "../draft-activity-start/draft-activity-start";

const draft: IDraft = new Milty();

const params: DraftActivityStartParams = {
  namespaceId: "@test/test",
  numSlices: 8,
  numFactions: 9,
  config: "",
};
const errors: Array<string> = [];

if (DraftActivityStart.resumeIfInProgress()) {
  // Draft is in progress.
  console.log("Draft is in progress");
} else {
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(draft, params, errors);
  if (!success) {
    throw new Error("DraftActivityStart failed");
  }
  console.log("Draft starting");
}
