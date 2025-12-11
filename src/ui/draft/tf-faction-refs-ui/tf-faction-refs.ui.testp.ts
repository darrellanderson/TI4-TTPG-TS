import { ScreenUIElement, world } from "@tabletop-playground/api";
import { TfFactionRefsUI } from "./tf-faction-refs-ui";
import { DraftStateTF } from "../../../lib/draft-lib/draft-state-tf/draft-state-tf";
import { AbstractUI } from "../../abstract-ui";
import { WrappedClickableUI } from "../../wrapped-clickable-ui";
import { NamespaceId } from "ttpg-darrell";

function go() {
  console.log("tf-faction-refs-ui testp");

  const namespaceId: NamespaceId = "@testp/testp";
  world.setSavedData("", namespaceId); // reset any existing data

  const scale: number = 1;
  const draftStateTF = new DraftStateTF(namespaceId);
  const opaqueIndex = 3;
  const playerSlot = 10;
  const speakerPriority = 7;

  const tfFactionRefsUi: TfFactionRefsUI = new TfFactionRefsUI(
    scale,
    draftStateTF,
    opaqueIndex
  );

  const clickableUi: AbstractUI = new WrappedClickableUI(
    tfFactionRefsUi,
    scale
  );

  const screenUI = new ScreenUIElement();
  screenUI.positionX = 0.5;
  screenUI.positionY = 0.5;
  screenUI.relativePositionX = true;
  screenUI.relativePositionY = true;

  screenUI.width = clickableUi.getSize().w;
  screenUI.height = clickableUi.getSize().h;
  screenUI.relativeWidth = false;
  screenUI.relativeHeight = false;

  screenUI.anchorX = 0.5;
  screenUI.anchorY = 0.5;

  screenUI.widget = clickableUi.getWidget();

  world.addScreenUI(screenUI);

  draftStateTF.setOpaqueToPlayerSlot(opaqueIndex, playerSlot);
  const selectedPlayerSlot: number =
    draftStateTF.getOpaqueIndexToPlayerSlot(opaqueIndex);
  if (selectedPlayerSlot !== playerSlot) {
    throw new Error(
      `opaque index to player slot failed, saw ${selectedPlayerSlot} expected ${playerSlot}`
    );
  }

  const selectedOpaqueIndex: number =
    draftStateTF._playerSlotToOpaqueIndex(playerSlot);
  if (selectedOpaqueIndex !== opaqueIndex) {
    throw new Error(
      `player slot to opaque index failed, saw ${selectedOpaqueIndex} expected ${opaqueIndex}`
    );
  }

  const speakerSuccess: boolean = draftStateTF.setSpeakerPriority(
    speakerPriority,
    playerSlot
  );
  if (!speakerSuccess) {
    throw new Error(`set speaker priority failed`);
  }
  const selectedSpeakerPriority: number =
    draftStateTF.getSpeakerPriority(playerSlot);
  if (selectedSpeakerPriority !== speakerPriority) {
    throw new Error(
      `get speaker priority failed, saw ${selectedSpeakerPriority} expected ${speakerPriority}`
    );
  }

  tfFactionRefsUi._update();
}

function goWrapper() {
  try {
    go();
  } catch (error) {
    console.error(error);
  }
}

setTimeout(goWrapper, 100);
