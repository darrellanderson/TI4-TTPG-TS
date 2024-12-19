import { DraftState } from "../draft-state/draft-state";
import { DraftUnpack } from "./draft-unpack";

it("constructor", () => {
  const draftState: DraftState = new DraftState("@test/test");
  new DraftUnpack(draftState);
});

it("moveSpeakerToken", () => {
  const draftState: DraftState = new DraftState("@test/test");
  const draftUnpack: DraftUnpack = new DraftUnpack(draftState);

  draftState.setSpeakerIndex(0);

  process.nextTick(() => {
    draftUnpack.moveSpeakerToken();
  });
});
