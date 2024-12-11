import { Window } from "ttpg-darrell";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { AbstractWindow, CreateAbstractUIType } from "./abstract-window";
import { ButtonUI } from "../button-ui/button-ui";

const createAbstractUI: CreateAbstractUIType = (scale: number): AbstractUI => {
  return new ButtonUI(scale * 6);
};
const namespaceId = "@test/test";

const window: Window = new AbstractWindow(
  createAbstractUI,
  namespaceId
).createWindow();

setTimeout(() => {
  console.log("window.attach()");
  window.attach();
}, 100);
