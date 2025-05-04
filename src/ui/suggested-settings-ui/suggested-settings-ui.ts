import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { LabelUI } from "../button-ui/label-ui";
import { HorizontalUIBuilder } from "../panel/horizontal-ui-builder";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class SuggestedSettingsUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(scale: number) {
    const buildRow = (
      setting: string,
      low: string,
      high: string | undefined,
      bold: boolean = false
    ): AbstractUI => {
      const settingUi: LabelUI = new LabelUI(scale);
      settingUi.getText().setBold(bold).setText(setting);

      let valueText: string = low;
      if (high !== undefined) {
        valueText = low + " / " + high;
      }
      const valueUi: LabelUI = new LabelUI(scale);
      valueUi.getText().setBold(bold).setText(valueText);
      return new HorizontalUIBuilder()
        .setSpacing(CONFIG.SPACING * scale)
        .addUIs([settingUi, valueUi])
        .build();
    };

    const uis: Array<AbstractUI> = [
      buildRow("SUGGEST SETTTING", "LOW-END", "HIGH-END", true),
      buildRow("Resolution scale", "100", "200"),
      buildRow("Anti-aliasing (FXAA)", "off", undefined),
      buildRow("Post processing", "low", "high"),
      buildRow("Shadow quality", "low", "high"),
      buildRow("Texture quality", "low", "high"),
      buildRow("Effect quality", "low", "high"),
      buildRow("VSync", "on", undefined),
      buildRow("Maximum framerate", "30", undefined),
    ];

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
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
