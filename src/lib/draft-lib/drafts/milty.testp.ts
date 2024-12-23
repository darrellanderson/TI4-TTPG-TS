import { DraftStateUI } from "ui/draft/draft-state-ui/draft-state-ui";
import { DraftState } from "../draft-state/draft-state";
import { AbstractDraft, CreateDraftParams } from "./idraft";
import { Milty } from "./milty";
import { AbstractWindow } from "ui/abstract-window/abstract-window";

const abstractDraft: AbstractDraft = new Milty();

const params: CreateDraftParams = {
  namespaceId: "@test/test",
  numSlices: 8,
  numFactions: 9,
  config: "",
};
const errors: Array<string> = [];
const draftState: DraftState = abstractDraft.createDraftState(params, errors);

const window: AbstractWindow = new AbstractWindow(
  (scale: number) => new DraftStateUI(draftState, scale),
  undefined
);
window.createWindow().attach();
