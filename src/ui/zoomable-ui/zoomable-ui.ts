import {
  Canvas,
  ContentButton,
  ImageButton,
  LayoutBox,
  Player,
  PlayerPermission,
  refPackageId,
  ScreenUIElement,
  Widget,
  world,
} from "@tabletop-playground/api";

import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import {
  WRAPPED_BORDER_WIDTH,
  WrappedClickableUI,
} from "../wrapped-clickable-ui/wrapped-clickable-ui";
import { ThrottleClickHandler } from "ttpg-darrell";

export type CreateZoomedUiType = (scale: number) => AbstractUI;

const packageId: string = refPackageId;
const __playerSlotToZoomedScreenUiElement: Map<number, ScreenUIElement> =
  new Map();
const __playerSlotToZoomedAbstractUI: Map<number, AbstractUI> = new Map();

/**
 * Create a new UI containing the given UI and adding a zoom button.
 * Zooming calls the given function to create a new UI.
 *
 * Each player can only have one zoomed UI at a time, zomming a new UI will
 * close any existing one.
 */
export class ZoomableUI extends AbstractUI {
  private readonly _unzoomedUi: AbstractUI;
  private readonly _zoomButton: ImageButton;

  static _getOnZoomClosedHandler(): (
    button: ContentButton,
    player: Player
  ) => void {
    return (_button: ContentButton, player: Player): void => {
      const screenUiElement: ScreenUIElement | undefined =
        __playerSlotToZoomedScreenUiElement.get(player.getSlot());
      if (screenUiElement !== undefined) {
        __playerSlotToZoomedScreenUiElement.delete(player.getSlot());
        world.removeScreenUIElement(screenUiElement);
      }
      const abstractUi: AbstractUI | undefined =
        __playerSlotToZoomedAbstractUI.get(player.getSlot());
      if (abstractUi !== undefined) {
        __playerSlotToZoomedAbstractUI.delete(player.getSlot());
        abstractUi.destroy();
      }
    };
  }

  static _getOnZoomOpenHandler<T>(
    createZoomedUI: CreateZoomedUiType,
    scale: number
  ): (button: T, player: Player) => void {
    return (_button: T, player: Player): void => {
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
        .onClicked.add(
          new ThrottleClickHandler<ContentButton>(
            ZoomableUI._getOnZoomClosedHandler()
          ).get()
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

      // Register as this player's zoomed UI.
      __playerSlotToZoomedScreenUiElement.set(
        player.getSlot(),
        screenUiElement
      );
      __playerSlotToZoomedAbstractUI.set(player.getSlot(), zoomedUi);
    };
  }

  constructor(
    unzoomedUi: AbstractUI,
    scale: number,
    createZoomedUI: CreateZoomedUiType
  ) {
    const borderWidth: number = WRAPPED_BORDER_WIDTH * scale + 2;

    const unzoomedWidget: Widget = unzoomedUi.getWidget();
    const unzoomedSize: UI_SIZE = unzoomedUi.getSize();

    const zoomButtonSize: number = 30 * scale;
    const zoomButton: ImageButton = new ImageButton()
      .setImage("ui/window/grow.png", packageId)
      .setImageSize(zoomButtonSize, zoomButtonSize);

    // Place zoom button *over* the unzoomed UI.
    const canvas = new Canvas();
    canvas.addChild(unzoomedWidget, 0, 0, unzoomedSize.w, unzoomedSize.h);
    canvas.addChild(
      zoomButton,
      unzoomedSize.w - zoomButtonSize - borderWidth,
      borderWidth,
      zoomButtonSize,
      zoomButtonSize
    );
    const canvasBox: Widget = new LayoutBox()
      .setOverrideWidth(unzoomedSize.w)
      .setOverrideHeight(unzoomedSize.h)
      .setChild(canvas);

    super(canvasBox, unzoomedSize);

    this._unzoomedUi = unzoomedUi;
    this._zoomButton = zoomButton;
    zoomButton.onClicked.add(
      new ThrottleClickHandler<ImageButton>(
        ZoomableUI._getOnZoomOpenHandler<ImageButton>(createZoomedUI, scale)
      ).get()
    );
  }

  destroy(): void {
    this._unzoomedUi.destroy();
    this._zoomButton.onClicked.clear();
    super.destroy();
  }
}
