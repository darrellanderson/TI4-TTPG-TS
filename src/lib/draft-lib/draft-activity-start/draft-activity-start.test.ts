import { NamespaceId } from "ttpg-darrell";
import { MockCardHolder, MockGameObject } from "ttpg-mock";

import { IDraft } from "../drafts/idraft";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
import { DraftState } from "../draft-state/draft-state";
import {
  DraftActivityMaybeResume,
  DraftActivityStart,
} from "./draft-activity-start";
import { DraftActivityStartParams } from "./draft-activity-start-params";
import { Faction } from "../../faction-lib/faction/faction";
import { MinorFactionsDraft } from "../drafts/minor-factions";

class MyDraft implements IDraft {
  public isEnabled(): boolean {
    return true;
  }

  getDraftName(): string {
    return "My Draft";
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    return { sliceMakeups: [["high"]], sliceShape: ["<0,0,0>", "<1,0,-1>"] };
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
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new MyDraft(),
    numSlices: 2,
    numFactions: 2,
    config: "",
    onStart: () => {
      // Do nothing.
    },
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(params, errors);
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
    sliceMakeups: [["high"]],
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
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new MyDraft(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(params, errors);
  expect(success).toBe(true);
  expect(errors).toEqual([]);
});

it("createDraftState (generate all)", () => {
  TI4.config.setPlayerCount(2);
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new MyDraft(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(params, errors);
  expect(success).toBe(true);
  expect(errors).toEqual([]);
});

it("createDraftState (minor factions)", () => {
  TI4.config.setPlayerCount(6);
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new MinorFactionsDraft(),
    numSlices: 6,
    numFactions: 6,
    config: "",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(params, errors);
  expect(success).toBe(true);
});

it("createDraftState (parse all)", () => {
  TI4.config.setPlayerCount(2);
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new MyDraft(),
    numSlices: 2,
    numFactions: 2,
    config: "19|20&factions=arborec|ul&labels=a|b|c&base=1,2",
  };
  const errors: Array<string> = [];
  const draftActivityStart = new DraftActivityStart();
  const success: boolean = draftActivityStart.start(params, errors);
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

it("getMinorFactions", () => {
  expect(TI4.config.sources).toContain("codex.vigil");
  const arborec: Faction = TI4.factionRegistry.getByNsidOrThrow(
    "faction:base/arborec"
  );
  const keleres: Faction = TI4.factionRegistry.getByNsidOrThrow(
    "faction:codex.vigil/keleres-xxcha"
  );
  const factions: Array<Faction> = [arborec, keleres];
  DraftActivityStart.getMinorFactions(factions);
});
