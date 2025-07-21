"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaChooseTypeUI = void 0;
const abtract_ui_1 = require("../../../ui/abstract-ui/abtract-ui");
const agenda_outcomes_1 = require("../../../lib/agenda-lib/agenda-outcomes/agenda-outcomes");
const button_ui_1 = require("../../../ui/button-ui/button-ui");
const config_1 = require("../../../ui/config/config");
const label_ui_1 = require("../../../ui/button-ui/label-ui");
const vertical_ui_builder_1 = require("../../../ui/panel/vertical-ui-builder");
class AgendaChooseTypeUI extends abtract_ui_1.AbstractUI {
    constructor(agendaState, scale) {
        const uis = Object.entries(agenda_outcomes_1.AGENDA_OUTCOME_TYPE_TO_LABEL).map(([k, v]) => {
            const button = new button_ui_1.ButtonUI(scale);
            button.getButton().setText(v);
            button.getButton().onClicked.add(() => {
                new agenda_outcomes_1.AgendaOutcomes().populateOrThrow(agendaState, k);
            });
            return button;
        });
        const label = new label_ui_1.LabelUI(scale);
        label.getText().setText("Choose outcome type:");
        uis.unshift(label);
        const panelUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .addUIs(uis)
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .build();
        super(panelUi.getWidget(), panelUi.getSize());
    }
}
exports.AgendaChooseTypeUI = AgendaChooseTypeUI;
//# sourceMappingURL=agenda-choose-type-ui.js.map