import { MultilineTextBox, Player } from "@tabletop-playground/api";
import {
  MockButton,
  MockCardHolder,
  MockGameObject,
  MockMultilineTextBox,
  MockPlayer,
  MockSlider,
} from "ttpg-mock";
import { DraftStartUI } from "./draft-start-ui";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { Milty } from "../../../lib/draft-lib/drafts/milty";

it("constructor", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);
  expect(draftStartUI).toBeDefined();
});

it("_onSliceCountChanged", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);
  draftStartUI._onSliceCountChanged(new MockSlider(), new MockPlayer(), 1);
});

it("_onFactionCountChanged", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);
  draftStartUI._onFactionCountChanged(new MockSlider(), new MockPlayer(), 1);
});

it("_onTextCommitted", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);

  const textBox: MultilineTextBox = new MockMultilineTextBox();
  const player: Player = new MockPlayer();
  const text: string = "test";
  draftStartUI._onTextCommitted(textBox, player, text);
});

it("_onStartButtonClicked", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);
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
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);

  // Bad config, will generate an error message during start.
  draftStartUI._onTextCommitted(
    new MockMultilineTextBox(),
    new MockPlayer(),
    "test"
  );

  draftStartUI.startDraft();
});
