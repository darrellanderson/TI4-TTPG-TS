import { MultilineTextBox, Player } from "@tabletop-playground/api";
import {
  MockCardHolder,
  MockGameObject,
  MockMultilineTextBox,
  MockPlayer,
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

it("_onTextCommitted", () => {
  const scale: number = 1;
  const idraft: IDraft = new Milty();
  const draftStartUI = new DraftStartUI(scale, idraft);

  const textBox: MultilineTextBox = new MockMultilineTextBox();
  const player: Player = new MockPlayer();
  const text: string = "test";
  draftStartUI._onTextCommitted(textBox, player, text);
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
