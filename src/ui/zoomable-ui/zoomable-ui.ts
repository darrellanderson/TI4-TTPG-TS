import {
  ContentButton,
  ImageButton,
  Player,
  PlayerPermission,
  refPackageId,
  ScreenUIElement,
  VerticalAlignment,
  world,
} from "@tabletop-playground/api";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { WrappedClickableUI } from "../wrapped-clickable-ui/wrapped-clickable-ui";

const SPACING: number = 0; // Align zoom button directly below the unzoomed UI.

export type CreateZoomedUiType = (scale: number) => AbstractUI;

const packageId: string = refPackageId;
const __playerSlotToZoomedScreenUiElement: Map<number, ScreenUIElement> =
  new Map();

/**
 * Create a new UI containing the given UI and adding a zoom button.
 * Zooming calls the given function to create a new UI.
 *
 * Each player can only have one zoomed UI at a time, zomming a new UI will
 * close any existing one.
 */
export class ZoomableUI extends AbstractUI {
  _getOnZoomClosedHandler(): (button: ContentButton, player: Player) => void {
    return (_button: ContentButton, player: Player): void => {
      const screenUiElement: ScreenUIElement | undefined =
        __playerSlotToZoomedScreenUiElement.get(player.getSlot());
      if (screenUiElement !== undefined) {
        __playerSlotToZoomedScreenUiElement.delete(player.getSlot());
        world.removeScreenUIElement(screenUiElement);
      }
    };
  }

  _getOnZoomOpenHandler(
    createZoomedUI: CreateZoomedUiType,
    scale: number
  ): (button: ImageButton, player: Player) => void {
    return (_button: ImageButton, player: Player): void => {
      // Remove any existing zoomed UI for this player.
      const existingScreenUiElement: ScreenUIElement | undefined =
        __playerSlotToZoomedScreenUiElement.get(player.getSlot());
      if (existingScreenUiElement !== undefined) {
        world.removeScreenUIElement(existingScreenUiElement);
        __playerSlotToZoomedScreenUiElement.delete(player.getSlot());
      }

      // Display zoomed UI to player.
      // Wrap in a clickable to hide it.
      const zoomedUi: AbstractUI = createZoomedUI(scale);
      const clickableUi: WrappedClickableUI = new WrappedClickableUI(
        zoomedUi,
        scale
      );
      clickableUi
        .getContentButton()
        .onClicked.add(this._getOnZoomClosedHandler());

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

      // Register as this player's zoomed UI.
      __playerSlotToZoomedScreenUiElement.set(
        player.getSlot(),
        screenUiElement
      );
    };
  }

  constructor(
    unzoomedUi: AbstractUI,
    scale: number,
    createZoomedUI: CreateZoomedUiType
  ) {
    const size: number = Math.ceil(30 * scale);
    const zoomButton: ImageButton = new ImageButton()
      .setImage("ui/window/grow.png", packageId)
      .setImageSize(size, size);
    const zoomButtonUi: AbstractUI = new (class extends AbstractUI {
      constructor() {
        super(zoomButton, { w: size, h: size });
      }
    })();

    const panel: AbstractUI = new HorizontalUIBuilder()
      .addUIs([unzoomedUi, zoomButtonUi])
      .setVerticalAlignment(VerticalAlignment.Center)
      .setSpacing(SPACING * scale)
      .build();

    super(panel.getWidget(), panel.getSize());

    zoomButton.onClicked.add(this._getOnZoomOpenHandler(createZoomedUI, scale));
  }
}
