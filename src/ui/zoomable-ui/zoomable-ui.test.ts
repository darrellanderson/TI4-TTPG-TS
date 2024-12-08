import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { ZoomableUI } from "./zoomable-ui";

it("constructor", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  new ZoomableUI(unzoomedUI, scale, createZoomedUI);
});
