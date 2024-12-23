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
const draftActivityStart = new DraftActivityStart();
draftActivityStart.start(draft, params, errors);
