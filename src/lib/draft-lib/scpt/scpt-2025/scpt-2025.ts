import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start";
import { Milty } from "../../drafts/milty";

export class Scpt2025 extends AbstractScpt {
  getLabel(): string {
    return "2025 (#7)";
  }

  getQual(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "27,73,47,44,26", //
      "30,39,76,80,65",
      "42,64,75,72,49",
      "79,37,50,71,66",
      "34,41,70,78,25",
      "40,20,36,45,74",
    ];
    const labels: Array<string> = [
      "Will, again", //
      "Rigely field (Where the girls go out)",
      "Devil went back down to Velnor (He forgot something)",
      "Yellow slice because it has Hope's End",
      "Gravity's DOOT DOOT",
      "Viva Las Lorxembourg",
    ];

    // Prune to player count.
    while (slices.length > TI4.config.playerCount) {
      const index: number = Math.floor(Math.random() * slices.length);
      slices.splice(index, 1);
      labels.splice(index, 1);
    }

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: TI4.config.playerCount,
      numFactions: TI4.config.playerCount,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }

  getPrelim(): DraftActivityStartParams | undefined {
    return undefined;
  }
  getSemi(): DraftActivityStartParams | undefined {
    return undefined;
  }
  getFinal(): DraftActivityStartParams | undefined {
    return undefined;
  }
}
