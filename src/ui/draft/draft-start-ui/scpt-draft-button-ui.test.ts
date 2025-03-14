import { Widget } from "@tabletop-playground/api";
import { clickAll } from "ttpg-mock";
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
  const widget: Widget = new ScptDraftButtonUI(scale, params).getWidget();
  clickAll(widget);
});
