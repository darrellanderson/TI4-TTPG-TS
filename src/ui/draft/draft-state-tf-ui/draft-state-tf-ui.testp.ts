import { DraftStateTfUI } from "./draft-state-tf-ui";
import { MILTY_SLICE_SHAPE } from "../../../lib/draft-lib/drafts/milty";
import {
  AbstractWindow,
  CreateAbstractUIParams,
} from "../../abstract-window/abstract-window";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftStateTF } from "../../../lib/draft-lib/draft-state-tf/draft-state-tf";

function _goWindow() {
  console.log("draft-state-tf-ui.testp _goWindow");
  try {
    const draftState: DraftStateTF = new DraftStateTF("@test/draft-state")
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
        [
          "faction:twilights-fall/tf-black",
          "faction:twilights-fall/tf-blue",
          "faction:twilights-fall/tf-green",
        ].map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid))
      )
      .setSpeakerIndex(1)
      .setOpaqueType("tfFactionRefs");

    new AbstractWindow(
      (params: CreateAbstractUIParams): AbstractUI => {
        return new DraftStateTfUI(draftState, params.scale);
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

setTimeout(_goWindow, 500);
