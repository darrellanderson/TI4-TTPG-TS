import {
  Canvas,
  ContentButton,
  LayoutBox,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../abstract-ui/abtract-ui";
import { CreateZoomedUiType, ZoomableUI } from "./zoomable-ui";
import { ThrottleClickHandler } from "ttpg-darrell";

/**
 * Make the unzoomed UI clickable, show the zoomed version when clicked.
 */
export class ZoomableUiFullyClickable extends AbstractUI {
  private readonly _unzoomedUi: AbstractUI;

  constructor(
    unzoomedUi: AbstractUI,
    scale: number,
    createZoomedUI: CreateZoomedUiType
  ) {
    const unzoomedWidget: Widget = unzoomedUi.getWidget();
    const unzoomedSize: UI_SIZE = unzoomedUi.getSize();

    const contentButton: ContentButton = new ContentButton().setChild(
      unzoomedWidget
    );

    // Place zoom button *over* the unzoomed UI.
    const canvas = new Canvas();
    canvas.addChild(
      contentButton,
      -4,
      -4,
      unzoomedSize.w + 4,
      unzoomedSize.h + 4
    );
    const canvasBox: Widget = new LayoutBox()
      .setOverrideWidth(unzoomedSize.w)
      .setOverrideHeight(unzoomedSize.h)
      .setChild(canvas);

    super(canvasBox, unzoomedSize);

    this._unzoomedUi = unzoomedUi;
    contentButton.onClicked.add(
      new ThrottleClickHandler(
        ZoomableUI._getOnZoomOpenHandler<ContentButton>(createZoomedUI, scale)
      ).get()
    );
  }

  destroy(): void {
    this._unzoomedUi.destroy();
    super.destroy();
  }
}
