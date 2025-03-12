import { world } from "@tabletop-playground/api";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { Milty } from "../../../lib/draft-lib/drafts/milty";
import { DraftStartWindow } from "./draft-start-window";

function go() {
  const idraft: IDraft = new Milty();
  const draftStartWindow = new DraftStartWindow(idraft);
  const playerSlot: number | undefined = world.getAllPlayers()[0]?.getSlot();
  if (playerSlot === undefined) {
    throw new Error("No player slot found");
  }
  draftStartWindow.createAndAttachWindow(10);
}

setTimeout(go, 100);
