import { AbstractUI } from "../../../ui/abstract-ui/abtract-ui";
import {
  AGENDA_OUTCOME_TYPE_TO_LABEL,
  AgendaOutcomes,
} from "../../../lib/agenda-lib/agenda-outcomes/agenda-outcomes";
import { AgendaState } from "../../../lib/agenda-lib/agenda-state/agenda-state";
import { ButtonUI } from "../../../ui/button-ui/button-ui";
import { CONFIG } from "../../../ui/config/config";
import { LabelUI } from "../../../ui/button-ui/label-ui";
import { VerticalUIBuilder } from "../../../ui/panel/vertical-ui-builder";

export class AgendaChooseTypeUI extends AbstractUI {
  constructor(agendaState: AgendaState, scale: number) {
    const uis: Array<AbstractUI> = Object.entries(
      AGENDA_OUTCOME_TYPE_TO_LABEL
    ).map(([k, v]): AbstractUI => {
      const button: ButtonUI = new ButtonUI(scale);
      button.getButton().setText(v);
      button.getButton().onClicked.add(() => {
        new AgendaOutcomes().populateOrThrow(agendaState, k);
      });
      return button;
    });

    const label: LabelUI = new LabelUI(scale);
    label.getText().setText("Choose outcome type:");
    uis.unshift(label);

    const panelUi: AbstractUI = new VerticalUIBuilder()
      .addUIs(uis)
      .setSpacing(CONFIG.SPACING * scale)
      .build();

    super(panelUi.getWidget(), panelUi.getSize());
  }
}
