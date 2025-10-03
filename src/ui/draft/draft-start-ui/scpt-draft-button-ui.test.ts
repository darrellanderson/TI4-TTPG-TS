import { Button, Player } from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { clickAll, MockButton, MockPlayer } from "ttpg-mock";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { DRAFT_NAMESPACE_ID } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { ScptDraftButtonUI } from "./scpt-draft-button-ui";
import { ScptDraftParams } from "../../../lib/draft-lib/scpt/abstract-scpt/scpt-draft-params";

it("constructor", () => {
  const scale = 1;
  const scptDraftParams: ScptDraftParams = {
    label: "YEAR",
  };
  const onDraftStarted = new TriggerableMulticastDelegate<() => void>();
  new ScptDraftButtonUI(scale, scptDraftParams, onDraftStarted);
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
  const onDraftStarted = new TriggerableMulticastDelegate<() => void>();
  const scptDraftButtonUI: ScptDraftButtonUI = new ScptDraftButtonUI(
    scale,
    scptDraftParams,
    onDraftStarted
  );

  // Click the "confirm" buttons.
  clickAll(scptDraftButtonUI.getWidget());
});
