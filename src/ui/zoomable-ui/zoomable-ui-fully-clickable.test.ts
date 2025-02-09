import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { ZoomableUiFullyClickable } from "./zoomable-ui-fully-clickable";

it("constructor/destroy", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  new ZoomableUiFullyClickable(unzoomedUI, scale, createZoomedUI).destroy();
});
