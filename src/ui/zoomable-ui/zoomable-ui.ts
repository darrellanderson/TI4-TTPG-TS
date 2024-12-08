import {
  Button,
  HorizontalAlignment,
  Player,
  PlayerPermission,
  ScreenUIElement,
  world,
} from "@tabletop-playground/api";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";
import { WrappedClickableUI } from "../wrapped-clickable-ui/wrapped-clickable-ui";

const SPACING: number = 12;

export type CreateZoomedUiType = (scale: number) => AbstractUI;

/**
 * Create a new UI containing the given UI and adding a zoom button.
 * Zooming calls the given function to create a new UI.
 */
export class ZoomableUI extends AbstractUI {
  _getOnZoomClosedHandler(screenUiElement: ScreenUIElement): () => void {
    return (): void => {
      world.removeScreenUIElement(screenUiElement);
    };
  }

  _getOnZoomOpenHandler(
    createZoomedUI: CreateZoomedUiType,
    scale: number
  ): (button: Button, player: Player) => void {
    return (_button: Button, player: Player): void => {
      // Display zoomed UI to player.
      // Wrap in a clickable to hide it.
      const zoomedUi: AbstractUI = createZoomedUI(scale);
      const clickableUi: WrappedClickableUI = new WrappedClickableUI(
        zoomedUi,
        scale
      );

      const screenUiElement = new ScreenUIElement();
      screenUiElement.anchorX = 0.5;
      screenUiElement.anchorY = 0.5;
      screenUiElement.positionX = 0.5;
      screenUiElement.positionY = 0.5;
      screenUiElement.relativePositionX = true;
      screenUiElement.relativePositionY = true;
      screenUiElement.relativeWidth = false;
      screenUiElement.relativeHeight = false;
      screenUiElement.width = clickableUi.getSize().w;
      screenUiElement.height = clickableUi.getSize().h;
      screenUiElement.players = new PlayerPermission().addPlayer(player);
      screenUiElement.widget = clickableUi.getWidget();
      world.addScreenUI(screenUiElement);

      clickableUi
        .getContentButton()
        .onClicked.add(this._getOnZoomClosedHandler(screenUiElement));
    };
  }

  constructor(
    unzoomedUi: AbstractUI,
    scale: number,
    createZoomedUI: CreateZoomedUiType
  ) {
    // Create zoom button, place below the clickable widget.
    const zoomButtonUi: ButtonUI = new ButtonUI(scale);
    zoomButtonUi.getButton().setText("Zoom");

    const panel: AbstractUI = new VerticalUIBuilder()
      .addUIs([unzoomedUi, zoomButtonUi])
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setSpacing(SPACING * scale)
      .build();

    super(panel.getWidget(), panel.getSize());

    zoomButtonUi
      .getButton()
      .onClicked.add(this._getOnZoomOpenHandler(createZoomedUI, scale));
  }
}
