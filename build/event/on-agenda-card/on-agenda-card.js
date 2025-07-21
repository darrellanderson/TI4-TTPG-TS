"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnAgendaCard = void 0;
const agenda_activity_start_1 = require("../../lib/agenda-lib/agenda-activity-start/agenda-activity-start");
class OnAgendaCard {
    init() {
        TI4.events.onAgendaCard.add((agendaCard, _player) => {
            new agenda_activity_start_1.AgendaActivityStart().start(agendaCard);
        });
    }
}
exports.OnAgendaCard = OnAgendaCard;
//# sourceMappingURL=on-agenda-card.js.map