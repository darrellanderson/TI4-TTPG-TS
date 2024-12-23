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

  const window: Window = new AbstractWindow(
    createAbstractUI,
    namespaceId,
    "Test Window"
  ).createWindow();

  window.attach().detach();
});
