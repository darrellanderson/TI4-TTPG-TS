import { ContentButton, ImageButton, Player } from "@tabletop-playground/api";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { ZoomableUI } from "./zoomable-ui";
import { MockContentButton, MockImageButton, MockPlayer } from "ttpg-mock";

it("constructor/destroy", () => {
  const unzoomedUI: AbstractUI = new ButtonUI(1);
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  new ZoomableUI(unzoomedUI, scale, createZoomedUI).destroy();
});

it("_getOnZoomOpenHandler", () => {
  const scale: number = 1;
  const createZoomedUI: () => AbstractUI = () => new ButtonUI(1);

  const button: ImageButton = new MockImageButton();
  const player: Player = new MockPlayer();
  const onZoomOpenedHandler: (button: ImageButton, player: Player) => void =
    ZoomableUI._getOnZoomOpenHandler(createZoomedUI, scale);
  onZoomOpenedHandler(button, player);
  onZoomOpenedHandler(button, player); // again
});

it("_getOnZoomClosedHandler", () => {
  const contentButton: ContentButton = new MockContentButton();
  const player: Player = new MockPlayer();
  const onZoomClosedHandler: (button: ContentButton, player: Player) => void =
    ZoomableUI._getOnZoomClosedHandler();
  onZoomClosedHandler(contentButton, player);
});
