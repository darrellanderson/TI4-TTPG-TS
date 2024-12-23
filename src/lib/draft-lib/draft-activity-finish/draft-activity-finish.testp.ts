import { DraftState } from "../draft-state/draft-state";
import { DraftActivityFinish } from "./draft-activity-finish";

const draftState: DraftState = new DraftState("@test/test");
const draftActivityFinish: DraftActivityFinish = new DraftActivityFinish(
  draftState
);

draftState.setSpeakerIndex(0);

process.nextTick(() => {
  draftActivityFinish.moveSpeakerToken();
});
