import { AbstractUI } from "../abstract-ui/abtract-ui";
import { CONFIG } from "../config/config";
import { LabelUI } from "../button-ui/label-ui";
import { VerticalUIBuilder } from "../panel/vertical-ui-builder";

export class SuggestedKeyUnbindsUI extends AbstractUI {
  private readonly _ui: AbstractUI;

  constructor(scale: number) {
    const buildRow = (value: string, bold: boolean = false): AbstractUI => {
      const labelUi: LabelUI = new LabelUI(scale);
      labelUi.getText().setBold(bold).setText(value);
      return labelUi;
    };

    const uis: Array<AbstractUI> = [
      buildRow("SUGGEST KEY UNBIND", true),
      buildRow("Switch Camera (z)"),
      buildRow("Measure Mode (m)"),
      buildRow("Measure Movement (x)"),
      buildRow("Ground Mode (g)"),
      buildRow("Zone mode (u)"),
      buildRow("Draw mode (i)"),
      buildRow("Label mode (k)"),
      buildRow("Hide/show cards (c)"),
      buildRow("Toggle history (h)"),
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
