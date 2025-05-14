import { MultilineTextBox, Player } from "@tabletop-playground/api";
import {
  MockButton,
  MockCardHolder,
  MockCheckBox,
  MockGameObject,
  MockMultilineTextBox,
  MockPlayer,
  MockSlider,
} from "ttpg-mock";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { DraftStartUI } from "./draft-start-ui";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { BagDraft } from "../../../lib/draft-lib/drafts/bag-draft";

it("constructor", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);
  expect(draftStartUI).toBeDefined();
});

it("_onDraftCheckStateChangedHandler", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);
  draftStartUI._onDraftCheckStateChangedHandler(
    new MockCheckBox().setText(params.draft.getDraftName()),
    new MockPlayer(),
    true
  );
});

it("_onSliceCountChanged", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);
  draftStartUI._onSliceCountChanged(new MockSlider(), new MockPlayer(), 1);
});

it("_onFactionCountChanged", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);
  draftStartUI._onFactionCountChanged(new MockSlider(), new MockPlayer(), 1);
});

it("_onTextCommitted", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);

  const textBox: MultilineTextBox = new MockMultilineTextBox();
  const player: Player = new MockPlayer();
  const text: string = "test";
  draftStartUI._onTextCommitted(textBox, player, text);
});

it("_onStartButtonClicked", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);
  expect(() => {
    draftStartUI._onStartButtonClicked(new MockButton(), new MockPlayer());
  }).toThrow(); // need a lot of setup not to throw, exercise the click handler.
});

it("startDraft", () => {
  MockGameObject.simple("tile.system:base/43"); // red
  MockGameObject.simple("tile.system:base/19"); // blue
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 12,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 13,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 14,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 15,
  });

  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);

  // Bad config, will generate an error message during start.
  draftStartUI._onTextCommitted(
    new MockMultilineTextBox(),
    new MockPlayer(),
    "test"
  );

  // draft needs systems to exist; let the draft tests validate that.
  expect(() => {
    draftStartUI.startDraft();
  }).toThrow();
});

it("startDraft (bag draft)", () => {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new BagDraft(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUI = new DraftStartUI(scale, params);

  // draft needs systems to exist; let the draft tests validate that.
  expect(() => {
    draftStartUI.startDraft();
  }).toThrow();
});
