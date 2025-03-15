import { Button, Player } from "@tabletop-playground/api";
import { clickAll, MockButton, MockPlayer } from "ttpg-mock";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { DRAFT_NAMESPACE_ID } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start";
import { ScptDraftButtonUI, ScptDraftParams } from "./scpt-draft-button-ui";

it("constructor", () => {
  const scale = 1;
  const scptDraftParams: ScptDraftParams = {
    label: "YEAR",
  };
  new ScptDraftButtonUI(scale, scptDraftParams);
});

it("clickAllButtons", () => {
  const scale = 1;
  const scptDraftParams: ScptDraftParams = {
    label: "YEAR",
    qual: {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: "",
    },
    prelim: {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: "",
    },
    semi: {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: "",
    },
    final: {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: "",
    },
  };
  const scptDraftButtonUI: ScptDraftButtonUI = new ScptDraftButtonUI(
    scale,
    scptDraftParams
  );

  // Click the "confirm" buttons.
  clickAll(scptDraftButtonUI.getWidget());

  // Click the underlying buttons manually.
  const button: Button = new MockButton();
  const player: Player = new MockPlayer();

  // These throw because systems are not set up.
  // Exercise them to get to that point.
  expect(() => {
    scptDraftButtonUI._qualHandler(button, player);
  }).toThrow();
  expect(() => {
    scptDraftButtonUI._prelimHandler(button, player);
  }).toThrow();
  expect(() => {
    scptDraftButtonUI._semiHandler(button, player);
  }).toThrow();
  expect(() => {
    scptDraftButtonUI._finalHandler(button, player);
  }).toThrow();
});
