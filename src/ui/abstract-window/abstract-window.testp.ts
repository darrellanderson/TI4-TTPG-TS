import { Window } from "ttpg-darrell";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "./abstract-window";
import { ButtonUI } from "../button-ui/button-ui";

const createAbstractUI: CreateAbstractUIType = (
  params: CreateAbstractUIParams
): AbstractUI => {
  return new ButtonUI(params.scale * 6);
};
const namespaceId = "@test/test";

const window: Window = new AbstractWindow(
  createAbstractUI,
  namespaceId,
  "title"
).createWindow();

setTimeout(() => {
  console.log("window.attach()");
  window.attach();
}, 100);
