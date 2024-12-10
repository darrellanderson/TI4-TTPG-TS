import { Button, ContentButton, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { ZoomableUI } from "./zoomable-ui";
import { MockButton, MockContentButton, MockPlayer } from "ttpg-mock";

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

  const button: Button = new MockButton();
  const player: Player = new MockPlayer();
  const onZoomOpenedHandler: (button: Button, player: Player) => void =
    zoomableUI._getOnZoomOpenHandler(createZoomedUI, scale);
  onZoomOpenedHandler(button, player);
  onZoomOpenedHandler(button, player); // again
});

it("_getOnZoomClosedHandler", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  const zoomableUI = new ZoomableUI(unzoomedUI, scale, createZoomedUI);

  const onZoomClosedHandler: (button: ContentButton, player: Player) => void =
    zoomableUI._getOnZoomClosedHandler();
  onZoomClosedHandler(new ContentButton(), new Player());
});
