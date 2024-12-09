import { Button, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { ZoomableUI } from "./zoomable-ui";

it("constructor", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  new ZoomableUI(unzoomedUI, scale, createZoomedUI);
});

it("_getOnZoomOpenHandler", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  const zoomableUI = new ZoomableUI(unzoomedUI, scale, createZoomedUI);

  zoomableUI._getOnZoomOpenHandler(createZoomedUI, scale)(
    new Button(),
    new Player()
  );
});

it("_getOnZoomClosedHandler", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  const zoomableUI = new ZoomableUI(unzoomedUI, scale, createZoomedUI);
  zoomableUI._getOnZoomClosedHandler();
});
