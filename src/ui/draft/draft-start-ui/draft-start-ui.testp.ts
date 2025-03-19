import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { DraftStartUI } from "./draft-start-ui";
import { Milty } from "../../../lib/draft-lib/drafts/milty";

function _goDirect() {
  const scale: number = 1;
  const params: DraftActivityStartParams = {
    namespaceId: "@test/test",
    draft: new Milty(),
    numSlices: 2,
    numFactions: 2,
    config: "",
  };
  const draftStartUi = new DraftStartUI(scale, params);
  const widget: Widget = draftStartUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = draftStartUi.getSize().w;
  screenUI.height = draftStartUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

setTimeout(_goDirect, 100);
