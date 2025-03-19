import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DRAFT_NAMESPACE_ID } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { ScptDraftButtonUI } from "./scpt-draft-button-ui";
import { ScptDraftParams } from "../../../lib/draft-lib/scpt/abstract-scpt/scpt-draft-params";

function _goDirect() {
  const scale: number = 1;
  const scptDraftParams: ScptDraftParams = {
    label: "YEAR",
    qual: {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: 6,
      numFactions: 6,
      config: "",
    },
  };
  const onDraftStarted = new TriggerableMulticastDelegate<() => void>();
  const abstractUi: AbstractUI = new ScptDraftButtonUI(
    scale,
    scptDraftParams,
    onDraftStarted
  );
  const widget: Widget = abstractUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = abstractUi.getSize().w;
  screenUI.height = abstractUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(_goDirect, 100);
