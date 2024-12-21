import { DraftStateUI } from "ui/draft/draft-state-ui/draft-state-ui";
import { DraftState } from "../draft-state/draft-state";
import { AbstractDraft, CreateDraftParams } from "./abstract-draft";
import { Milty } from "./milty";
import { AbstractWindow } from "ui/abstract-window/abstract-window";

TI4.config.setPlayerCount(7);

const abstractDraft: AbstractDraft = new Milty();

const params: CreateDraftParams = {
  namespaceId: "@test/test",
  numSlices: 8,
  numFactions: 8,
  config: "",
};
const errors: Array<string> = [];
const draftState: DraftState = abstractDraft.createDraftState(params, errors);

const window: AbstractWindow = new AbstractWindow(
  (scale: number) => new DraftStateUI(draftState, scale),
  undefined
);
window.createWindow().attach();
