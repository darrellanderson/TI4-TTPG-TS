import { NamespaceId } from "ttpg-darrell";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { IDraft } from "../drafts/idraft";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
import { DraftState } from "../draft-state/draft-state";
import {
  DraftActivityMaybeResume,
  DraftActivityStart,
  DraftActivityStartParams,
} from "./draft-activity-start";

class MyDraft implements IDraft {
  getDraftName(): string {
    return "My Draft";
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    return { sliceMakeup: ["high"], sliceShape: ["<0,0,0>", "<1,0,-1>"] };
  }
  createEmptyDraftState(namespaceId: NamespaceId): DraftState {
    return new DraftState(namespaceId).setSliceShape(["<0,0,0>", "<1,0,-1>"]);
  }
}

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

// Create card holder for TI4.playerSeats to use.
beforeEach(() => {
  for (const playerSlot of [10, 11, 12, 13, 14, 15]) {
    new MockCardHolder({
      templateMetadata: "card-holder:base/player-hand",
      owningPlayerSlot: playerSlot,
    });
  }
});

it("static resumeIfInProgress (false)", () => {
  new DraftActivityMaybeResume().init();
});

it("static resumeIfInProgress (true)", () => {
  TI4.config.setPlayerCount(2);
  const draft: IDraft = new MyDraft();
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(draft, params, errors);
  expect(errors).toEqual([]);
  expect(success).toBe(true);
  new DraftActivityMaybeResume().init();
  draftActivityStart.destroy();
});

it("constructor", () => {
  new MyDraft();
});

it("getGenerateSlicesParams", () => {
  const draft: IDraft = new MyDraft();
  expect(draft.getGenerateSlicesParams()).toEqual({
    sliceMakeup: ["high"],
    sliceShape: ["<0,0,0>", "<1,0,-1>"],
  });
});

it("createEmptyDraftState", () => {
  const draft: IDraft = new MyDraft();
  const namespaceId: NamespaceId = "@test/test";
  expect(draft.createEmptyDraftState(namespaceId)).toBeDefined();
});

it("createDraftState (generate all)", () => {
  TI4.config.setPlayerCount(2);
  const draft: IDraft = new MyDraft();
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(draft, params, errors);
  expect(success).toBe(true);
  expect(errors).toEqual([]);
});

it("createDraftState (generate all, too few)", () => {
  TI4.config.setPlayerCount(6);
  const draft: IDraft = new MyDraft();
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(draft, params, errors);
  expect(success).toBe(false);
  expect(errors).toEqual([
    "Slice count (2) is less than player count (6)",
    "Faction count (2) is less than player count (6)",
  ]);
});

it("createDraftState (parse all)", () => {
  TI4.config.setPlayerCount(2);
  const draft: IDraft = new MyDraft();
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    numSlices: 2,
    numFactions: 2,
    config: "19|20&factions=arborec|ul&labels=a|b|c",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(draft, params, errors);
  expect(success).toBe(true);
  expect(errors).toEqual([]);

  const draftState: DraftState | undefined = draftActivityStart.getDraftState();
  expect(draftState?.getSlices()).toEqual([[19], [20]]);
  expect(draftState?.getSliceLabels()).toEqual(["a", "b", "c"]);
  expect(draftState?.getFactions().map((faction) => faction.getAbbr())).toEqual(
    ["Arborec", "Ul"]
  );
});

it("resume (not in progress)", () => {
  const draftActivityStart = new DraftActivityStart();
  expect(() => draftActivityStart.resume()).toThrow();
});
