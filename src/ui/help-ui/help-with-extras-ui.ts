import { AbstractUI } from "../abstract-ui/abtract-ui";
import { SuggestedSettingsUI } from "../suggested-settings-ui/suggested-settings-ui";
import { HelpUI } from "./help-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { CONFIG } from "../config/config";
import { DivUI } from "../div-ui/div-ui";
import { SuggestedKeyUnbindsUI } from "../suggested-key-unbinds-ui/suggested-key-unbinds-ui";

export class HelpWithExtrasUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(scale: number) {
    const suggestedKeyUnbindsUI: AbstractUI = new SuggestedKeyUnbindsUI(scale);
    const suggestedSettings: AbstractUI = new SuggestedSettingsUI(scale);
    const helpUi: AbstractUI = new HelpUI(scale);

    const h: number = Math.max(
      suggestedKeyUnbindsUI.getSize().h,
      suggestedSettings.getSize().h,
      helpUi.getSize().h
    );

    const uis: Array<AbstractUI> = [
      new SuggestedKeyUnbindsUI(scale),
      new DivUI(scale, h, "vertical"),
      new SuggestedSettingsUI(scale),
      new DivUI(scale, h, "vertical"),
      new HelpUI(scale),
    ];

    const ui: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale * 2)
      .addUIs(uis)
      .build();
    super(ui.getWidget(), ui.getSize());
    this._ui = ui;
  }

  destroy(): void {
    this._ui.destroy();
    super.destroy();
  }
}
