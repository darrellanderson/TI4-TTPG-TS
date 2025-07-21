"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleContainer = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const recycle_card_action_1 = require("../handlers/card/action/recycle-card-action");
const recycle_card_agenda_1 = require("../handlers/card/agenda/recycle-card-agenda");
const recycle_card_alliance_1 = require("../handlers/card/alliance/recycle-card-alliance");
const recycle_card_event_1 = require("../handlers/card/event/recycle-card-event");
const recycle_card_exploration_cultural_1 = require("../handlers/card/exploration/cultural/recycle-card-exploration-cultural");
const recycle_card_exploration_frontier_1 = require("../handlers/card/exploration/frontier/recycle-card-exploration-frontier");
const recycle_card_exploration_hazardous_1 = require("../handlers/card/exploration/hazardous/recycle-card-exploration-hazardous");
const recycle_card_exploration_industrial_1 = require("../handlers/card/exploration/industrial/recycle-card-exploration-industrial");
const recycle_card_faction_reference_1 = require("../handlers/card/faction-reference/recycle-card-faction-reference");
const recycle_card_leader_1 = require("../handlers/card/leader/recycle-card-leader");
const recycle_card_legendary_planet_1 = require("../handlers/card/legendary-planet/recycle-card-legendary-planet");
const recycle_card_objective_stage_1_1 = require("../handlers/card/objective/stage-1/recycle-card-objective-stage-1");
const recycle_card_objective_stage_2_1 = require("../handlers/card/objective/stage-2/recycle-card-objective-stage-2");
const recycle_card_planet_1 = require("../handlers/card/planet/recycle-card-planet");
const recycle_card_promissory_1 = require("../handlers/card/promissory/recycle-card-promissory");
const recycle_card_relic_1 = require("../handlers/card/relic/recycle-card-relic");
const recycle_card_secret_1 = require("../handlers/card/secret/recycle-card-secret");
const recycle_card_tech_1 = require("../handlers/card/technology/recycle-card-tech");
const recycle_strategy_card_1 = require("../handlers/strategy-card/recycle-strategy-card");
const recycle_system_tile_1 = require("../handlers/system-tile/recycle-system-tile");
const recycle_token_attachment_1 = require("../handlers/token/recycle-token-attachment/recycle-token-attachment");
const recycle_token_command_1 = require("../handlers/token/recycle-token-command/recycle-token-command");
const recycle_token_control_1 = require("../handlers/token/recycle-token-control/recycle-token-control");
const recycle_token_fighter_1 = require("../handlers/token/recycle-token-fighter/recycle-token-fighter");
const recycle_token_frontier_1 = require("../handlers/token/recycle-token-frontier/recycle-token-frontier");
const recycle_token_infantry_1 = require("../handlers/token/recycle-token-infantry/recycle-token-infantry");
const recycle_token_tradegood_1 = require("../handlers/token/recycle-token-tradegood/recycle-token-tradegood");
const recycle_unit_1 = require("../handlers/unit/recycle-unit");
class RecycleContainer extends ttpg_darrell_1.GarbageContainer {
}
exports.RecycleContainer = RecycleContainer;
const nameToCount = new Map();
let reportPending = false;
ttpg_darrell_1.GarbageContainer.onRecycled.add((objName, objMetadata, player) => {
    objName = objName.replace(/ \(\d\)$/, ""); // strip off card number ("morale boost (2)")
    // Only report player-linked recycles.
    if (!player) {
        return;
    }
    if (objMetadata.startsWith("card.objective.secret")) {
        objName = "(Secret Objective)";
    }
    const count = nameToCount.get(objName) || 0;
    nameToCount.set(objName, count + 1);
    if (!reportPending) {
        reportPending = true;
        process.nextTick(() => {
            reportPending = false;
            const names = Array.from(nameToCount.keys()).sort();
            const items = names.map((name) => {
                const newCount = nameToCount.get(name);
                let result = "";
                if (newCount !== undefined) {
                    if (newCount === 1) {
                        result = name;
                    }
                    else {
                        result = `${name} (${newCount})`;
                    }
                }
                return result;
            });
            nameToCount.clear();
            const playerName = TI4.playerName.getByPlayer(player);
            const msg = `${playerName} recycled: ${items.join(", ")}`;
            ttpg_darrell_1.Broadcast.chatAll(msg);
        });
    }
});
RecycleContainer.addHandler(new recycle_card_action_1.RecycleCardAction());
RecycleContainer.addHandler(new recycle_card_agenda_1.RecycleCardAgenda());
RecycleContainer.addHandler(new recycle_card_alliance_1.RecycleCardAlliance());
RecycleContainer.addHandler(new recycle_card_exploration_cultural_1.RecycleCardExplorationCultural());
RecycleContainer.addHandler(new recycle_card_exploration_frontier_1.RecycleCardExplorationFrontier());
RecycleContainer.addHandler(new recycle_card_exploration_hazardous_1.RecycleCardExplorationHazardous());
RecycleContainer.addHandler(new recycle_card_exploration_industrial_1.RecycleCardExplorationIndustrial());
RecycleContainer.addHandler(new recycle_card_event_1.RecycleCardEvent());
RecycleContainer.addHandler(new recycle_card_faction_reference_1.RecycleCardFactionReference());
RecycleContainer.addHandler(new recycle_card_leader_1.RecycleCardLeader());
RecycleContainer.addHandler(new recycle_card_legendary_planet_1.RecycleCardLegendaryPlanet());
RecycleContainer.addHandler(new recycle_card_objective_stage_1_1.RecycleCardObjectiveStage1());
RecycleContainer.addHandler(new recycle_card_objective_stage_2_1.RecycleCardObjectiveStage2());
RecycleContainer.addHandler(new recycle_card_planet_1.RecycleCardPlanet());
RecycleContainer.addHandler(new recycle_card_promissory_1.RecycleCardPromissory());
RecycleContainer.addHandler(new recycle_card_relic_1.RecycleCardRelic());
RecycleContainer.addHandler(new recycle_card_secret_1.RecycleCardSecret());
RecycleContainer.addHandler(new recycle_card_tech_1.RecycleCardTech());
RecycleContainer.addHandler(new recycle_strategy_card_1.RecycleStrategyCard());
RecycleContainer.addHandler(new recycle_system_tile_1.RecycleSystemTile());
RecycleContainer.addHandler(new recycle_token_attachment_1.RecycleTokenAttachment());
RecycleContainer.addHandler(new recycle_token_command_1.RecycleTokenCommand());
RecycleContainer.addHandler(new recycle_token_control_1.RecycleTokenControl());
RecycleContainer.addHandler(new recycle_token_fighter_1.RecycleTokenFighter());
RecycleContainer.addHandler(new recycle_token_frontier_1.RecycleTokenFrontier());
RecycleContainer.addHandler(new recycle_token_infantry_1.RecycleTokenInfantry());
RecycleContainer.addHandler(new recycle_token_tradegood_1.RecycleTokenTradegood());
RecycleContainer.addHandler(new recycle_unit_1.RecycleUnit());
//# sourceMappingURL=recycle-container.js.map