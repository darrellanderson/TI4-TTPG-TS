import { AbstractUI } from "../abstract-ui/abtract-ui";
import { ButtonUI } from "../button-ui/button-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

const SPACING: number = 12;

/**
 * Create a new UI containing the given UI and adding a zoom button.
 * Zooming calls the given function to create a new UI.
 */
export class ZoomableUI extends AbstractUI {
  private readonly _createZoomedUI: () => AbstractUI;

  constructor(
    unzoomedUi: AbstractUI,
    scale: number,
    createZoomedUI: () => AbstractUI
  ) {
    // Create zoom button, place below the clickable widget.
    const zoomButtonUi: ButtonUI = new ButtonUI(scale);

    const panel: AbstractUI = new VerticalUIBuilder()
      .addUIs([unzoomedUi, zoomButtonUi])
      .setSpacing(SPACING * scale)
      .build();

    super(panel.getWidget(), panel.getSize());
    this._createZoomedUI = createZoomedUI;
  }
}
