import { PlayerSlot } from "ttpg-darrell";

import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { LabelUI } from "../button-ui/label-ui";

export class ChooseTechnologyUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(scale: number, _playerSlot: PlayerSlot) {
    const uis: Array<AbstractUI> = [new LabelUI(scale)];

    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs(uis)
      .build();
    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
  }
}
