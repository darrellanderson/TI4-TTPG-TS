import { Broadcast, GarbageContainer } from "ttpg-darrell";
import { RecycleCardAction } from "../handlers/card/action/recycle-card-action";
import { RecycleCardAgenda } from "../handlers/card/agenda/recycle-card-agenda";
import { RecycleCardAlliance } from "../handlers/card/alliance/recycle-card-alliance";
import { RecycleCardExplorationCultural } from "../handlers/card/exploration/cultural/recycle-card-exploration-cultural";
import { RecycleCardExplorationFrontier } from "../handlers/card/exploration/frontier/recycle-card-exploration-frontier";
import { RecycleCardExplorationHazardous } from "../handlers/card/exploration/hazardous/recycle-card-exploration-hazardous";
import { RecycleCardExplorationIndustrial } from "../handlers/card/exploration/industrial/recycle-card-exploration-industrial";
import { RecycleCardFactionReference } from "../handlers/card/faction-reference/recycle-card-faction-reference";
import { RecycleCardLeader } from "../handlers/card/leader/recycle-card-leader";
import { RecycleCardLegendaryPlanet } from "../handlers/card/legendary-planet/recycle-card-legendary-planet";
import { RecycleCardObjectiveStage1 } from "../handlers/card/objective/stage-1/recycle-card-objective-stage-1";
import { RecycleCardObjectiveStage2 } from "../handlers/card/objective/stage-2/recycle-card-objective-stage-2";
import { RecycleCardPlanet } from "../handlers/card/planet/recycle-card-planet";
import { RecycleCardPromissory } from "../handlers/card/promissory/recycle-card-promissory";
import { RecycleCardRelic } from "../handlers/card/relic/recycle-card-relic";
import { RecycleCardSecret } from "../handlers/card/secret/recycle-card-secret";
import { RecycleCardTech } from "../handlers/card/technology/recycle-card-tech";
import { RecycleStrategyCard } from "../handlers/strategy-card/recycle-strategy-card";
import { RecycleSystemTile } from "../handlers/system-tile/recycle-system-tile";
import { RecycleTokenAttachment } from "../handlers/token/recycle-token-attachment/recycle-token-attachment";
import { RecycleTokenCommand } from "../handlers/token/recycle-token-command/recycle-token-command";
import { RecycleTokenControl } from "../handlers/token/recycle-token-control/recycle-token-control";
import { RecycleTokenFighter } from "../handlers/token/recycle-token-fighter/recycle-token-fighter";
import { RecycleTokenFrontier } from "../handlers/token/recycle-token-frontier/recycle-token-frontier";
import { RecycleTokenInfantry } from "../handlers/token/recycle-token-infantry/recycle-token-infantry";
import { RecycleTokenTradegood } from "../handlers/token/recycle-token-tradegood/recycle-token-tradegood";
import { RecycleUnit } from "../handlers/unit/recycle-unit";
import { Player } from "@tabletop-playground/api";

export class RecycleContainer extends GarbageContainer {}

const nameToCount: Map<string, number> = new Map<string, number>();
let reportPending: boolean = false;

GarbageContainer.onRecycled.add(
  (objName: string, objMetadata: string, player: Player | undefined): void => {
    objName = objName.replace(/ \(\d\)$/, ""); // strip off card number ("morale boost (2)")

    // Only report player-linked recycles.
    if (!player) {
      return;
    }

    if (objMetadata.startsWith("card.objective.secret")) {
      objName = "(Secret Objective)";
    }

    const count: number = nameToCount.get(objName) || 0;
    nameToCount.set(objName, count + 1);

    if (!reportPending) {
      reportPending = true;
      process.nextTick(() => {
        reportPending = false;
        const names: Array<string> = Array.from(nameToCount.keys()).sort();
        const items: Array<string> = names.map((name: string) => {
          const newCount: number | undefined = nameToCount.get(name);
          let result: string = "";
          if (newCount !== undefined) {
            if (newCount === 1) {
              result = name;
            } else {
              result = `${name} (${newCount})`;
            }
          }
          return result;
        });
        nameToCount.clear();
        const playerName: string = TI4.playerName.getByPlayer(player);
        const msg: string = `${playerName} recycled: ${items.join(", ")}`;
        Broadcast.chatAll(msg);
      });
    }
  }
);

RecycleContainer.addHandler(new RecycleCardAction());
RecycleContainer.addHandler(new RecycleCardAgenda());
RecycleContainer.addHandler(new RecycleCardAlliance());
RecycleContainer.addHandler(new RecycleCardExplorationCultural());
RecycleContainer.addHandler(new RecycleCardExplorationFrontier());
RecycleContainer.addHandler(new RecycleCardExplorationHazardous());
RecycleContainer.addHandler(new RecycleCardExplorationIndustrial());
RecycleContainer.addHandler(new RecycleCardFactionReference());
RecycleContainer.addHandler(new RecycleCardLeader());
RecycleContainer.addHandler(new RecycleCardLegendaryPlanet());
RecycleContainer.addHandler(new RecycleCardObjectiveStage1());
RecycleContainer.addHandler(new RecycleCardObjectiveStage2());
RecycleContainer.addHandler(new RecycleCardPlanet());
RecycleContainer.addHandler(new RecycleCardPromissory());
RecycleContainer.addHandler(new RecycleCardRelic());
RecycleContainer.addHandler(new RecycleCardSecret());
RecycleContainer.addHandler(new RecycleCardTech());
RecycleContainer.addHandler(new RecycleStrategyCard());
RecycleContainer.addHandler(new RecycleSystemTile());
RecycleContainer.addHandler(new RecycleTokenAttachment());
RecycleContainer.addHandler(new RecycleTokenCommand());
RecycleContainer.addHandler(new RecycleTokenControl());
RecycleContainer.addHandler(new RecycleTokenFighter());
RecycleContainer.addHandler(new RecycleTokenFrontier());
RecycleContainer.addHandler(new RecycleTokenInfantry());
RecycleContainer.addHandler(new RecycleTokenTradegood());
RecycleContainer.addHandler(new RecycleUnit());
