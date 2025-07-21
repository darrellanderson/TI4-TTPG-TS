"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutScoringArea = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
const layout_objectives_1 = require("./layout-objectives");
const layout_player_secrets_1 = require("./layout-player-secrets");
const layout_agenda_laws_mat_1 = require("./layout-agenda-laws-mat");
const layout_timer_1 = require("./layout-timer");
class LayoutScoringArea {
    constructor(playerCount) {
        const layoutObjectives = new layout_objectives_1.LayoutObjectives();
        const layoutPlayerSecrets = new layout_player_secrets_1.LayoutPlayerSecrets(playerCount);
        const layoutAgendaLawsMat = new layout_agenda_laws_mat_1.LayoutAgendaLawsMat();
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .setIsVertical(true)
            .add(new layout_timer_1.LayoutTimer().getLayout())
            .add(layoutObjectives.getLayout())
            .add(layoutPlayerSecrets.getLayout())
            .add(layoutAgendaLawsMat.getLayout());
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutScoringArea = LayoutScoringArea;
//# sourceMappingURL=layout-scoring-area.js.map