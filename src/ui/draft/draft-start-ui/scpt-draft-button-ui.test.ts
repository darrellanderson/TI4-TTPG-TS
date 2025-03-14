import { Button, Player, Widget } from "@tabletop-playground/api";
import { clickAll, MockButton, MockPlayer } from "ttpg-mock";
import { ScptDraftButtonUI, ScptDraftParams } from "./scpt-draft-button-ui";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { Milty } from "../../../lib/draft-lib/drafts/milty";

it("constructor", () => {
  const scale = 1;
  const params: ScptDraftParams = {
    label: "YEAR",
  };
  new ScptDraftButtonUI(scale, params);
});

it("clickAllButtons", () => {
  const idraft: IDraft = new Milty();

  const scale = 1;
  const params: ScptDraftParams = {
    label: "YEAR",
    qual: idraft,
    prelim: idraft,
    semi: idraft,
    final: idraft,
  };
  const scptDraftButtonUI: ScptDraftButtonUI = new ScptDraftButtonUI(
    scale,
    params
  );

  // Click the "confirm" buttons.
  clickAll(scptDraftButtonUI.getWidget());

  // Click the underlying buttons manually.
  const button: Button = new MockButton();
  const player: Player = new MockPlayer();

  scptDraftButtonUI._qualHandler(button, player);
  scptDraftButtonUI._prelimHandler(button, player);
  scptDraftButtonUI._semiHandler(button, player);
  scptDraftButtonUI._finalHandler(button, player);
});
