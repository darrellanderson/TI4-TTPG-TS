import { world } from "@tabletop-playground/api";
import { DraftStartWindow } from "./draft-start-window";

function go() {
  const draftStartWindow = new DraftStartWindow();
  const playerSlot: number | undefined = world.getAllPlayers()[0]?.getSlot();
  if (playerSlot === undefined) {
    throw new Error("No player slot found");
  }
  draftStartWindow.createAndAttachWindow(10);
}

setTimeout(go, 100);
