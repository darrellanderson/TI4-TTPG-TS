import { Broadcast, GarbageContainer, NSID } from "ttpg-darrell";
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
import { RecycleCardRelic } from "../handlers/card/relic/recycle-card-relic";
import { RecycleCardSecret } from "../handlers/card/secret/recycle-card-secret";
import { RecycleStrategyCard } from "../handlers/strategy-card/recycle-strategy-card";
import { RecycleTokenAttachment } from "../handlers/token/recycle-token-attachment/recycle-token-attachment";
import { RecycleTokenCommand } from "../handlers/token/recycle-token-command/recycle-token-command";
import { RecycleTokenControl } from "../handlers/token/recycle-token-control/recycle-token-control";
import { RecycleTokenFighter } from "../handlers/token/recycle-token-fighter/recycle-token-fighter";
import { RecycleTokenFrontier } from "../handlers/token/recycle-token-frontier/recycle-token-frontier";
import { RecycleTokenInfantry } from "../handlers/token/recycle-token-infantry/recycle-token-infantry";
import { RecycleTokenTradegood } from "../handlers/token/recycle-token-tradegood/recycle-token-tradegood";
import { RecycleUnit } from "../handlers/unit/recycle-unit";
import { GameObject } from "@tabletop-playground/api";

export class RecycleContainer extends GarbageContainer {}

const nameToCount: Map<string, number> = new Map<string, number>();
let reportPending: boolean = false;

GarbageContainer.onRecycled.add((obj: GameObject): void => {
  let name: string = obj.getName();
  name = name.replace(/ \(\d\)$/, ""); // strip off card number ("morale boost (2)")

  const nsid: string = NSID.get(obj);
  if (nsid.startsWith("card.objective.secret")) {
    name = "(Secret Objective)";
  }

  const count: number = nameToCount.get(name) || 0;
  nameToCount.set(name, count + 1);

  if (!reportPending) {
    reportPending = true;
    process.nextTick(() => {
      reportPending = false;
      const names: Array<string> = Array.from(nameToCount.keys()).sort();
      const items: Array<string> = names.map((name: string) => {
        const count: number = nameToCount.get(name) || 0;
        return `${name}: ${count}`;
      });
      const msg: string = "Recycled: " + items.join(", ");
      Broadcast.chatAll(msg);
    });
  }
});

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
RecycleContainer.addHandler(new RecycleCardRelic());
RecycleContainer.addHandler(new RecycleCardSecret());
RecycleContainer.addHandler(new RecycleStrategyCard());
RecycleContainer.addHandler(new RecycleTokenAttachment());
RecycleContainer.addHandler(new RecycleTokenCommand());
RecycleContainer.addHandler(new RecycleTokenControl());
RecycleContainer.addHandler(new RecycleTokenFighter());
RecycleContainer.addHandler(new RecycleTokenFrontier());
RecycleContainer.addHandler(new RecycleTokenInfantry());
RecycleContainer.addHandler(new RecycleTokenTradegood());
RecycleContainer.addHandler(new RecycleUnit());
