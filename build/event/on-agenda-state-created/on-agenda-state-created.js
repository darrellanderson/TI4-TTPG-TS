"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnAgendaStateCreated = void 0;
const advance_no_whens_afters_1 = require("../../lib/agenda-lib/agenda-state/advance-no-whens-afters");
const report_final_agenda_state_1 = require("../../lib/agenda-lib/agenda-state/report-final-agenda-state");
class OnAgendaStateCreated {
    init() {
        TI4.events.onAgendaStateCreated.add((agendaState) => {
            new advance_no_whens_afters_1.AdvanceNoWhensAfters(agendaState);
            new report_final_agenda_state_1.ReportFinalAgendaState(agendaState);
        });
    }
}
exports.OnAgendaStateCreated = OnAgendaStateCreated;
//# sourceMappingURL=on-agenda-state-created.js.map