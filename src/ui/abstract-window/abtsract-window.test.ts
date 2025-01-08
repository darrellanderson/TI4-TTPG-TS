import { Window } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { AbstractWindow, CreateAbstractUIType } from "./abstract-window";

it("constuctor, createWindow", () => {
  const createAbstractUI: CreateAbstractUIType = (
    scale: number
  ): AbstractUI => {
    return new ButtonUI(scale);
  };
  const namespaceId = "@test/test";
  const title: string = "Test Window";
  const abstractWindow = new AbstractWindow(
    createAbstractUI,
    namespaceId,
    title
  );

  abstractWindow.getMutableWindowParams().disableClose = true;

  const playerSlots: Array<number> = [10];
  const window: Window = abstractWindow.createWindow(playerSlots);

  window.attach().detach();
});
