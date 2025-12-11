import {
  Border,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { DraftStateUI } from "./draft-state-ui";
import { MILTY_SLICE_SHAPE } from "../../../lib/draft-lib/drafts/milty";
import {
  AbstractWindow,
  CreateAbstractUIParams,
} from "../../abstract-window/abstract-window";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftStateTF } from "../../../lib/draft-lib/draft-state-tf/draft-state-tf";

const draftState: DraftState = new DraftStateTF("@test/draft-state")
  .setSliceShape(MILTY_SLICE_SHAPE)
  .setSlices([
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
    [41, 42, 43, 44, 45],
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
    [41, 42, 43, 44, 45],
    [21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35],
  ])
  .setFactions(
    ["faction:base/arborec", "faction:base/sol", "faction:base/naalu"].map(
      (nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid)
    )
  )
  .setSpeakerIndex(1)
  .setOpaqueType("tfFactionRefs");

function _goDirect() {
  const draftStateUi = new DraftStateUI(draftState, 1);
  const widget: Widget = draftStateUi.getWidget();

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = draftStateUi.getSize().w;
  screenUI.height = draftStateUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = new Border().setChild(widget);

  world.addScreenUI(screenUI);
}

function _goWindow() {
  try {
    new AbstractWindow(
      (params: CreateAbstractUIParams): AbstractUI => {
        return new DraftStateUI(draftState, params.scale);
      },
      "@test/draft-state-ui",
      "Draft"
    )
      .createWindow()
      .attach();
  } catch (e) {
    console.error(`_goWindow failed: ${e}`);
  }
}

setTimeout(_goWindow, 100);
