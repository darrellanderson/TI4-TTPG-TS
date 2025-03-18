import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start";
import { Milty } from "../../drafts/milty";
import { Scpt2024 } from "../scpt-2024/scpt-2024";
import { Scpt2023 } from "../scpt-2023/scpt-2023";
import { Scpt2022 } from "../scpt-2022/scpt-2022";

export class Scpt2025 extends AbstractScpt {
  getLabel(): string {
    return "#7 (2025)";
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
    // Choose a prior prelim's slices.
    const candidates: Array<AbstractScpt> = [
      new Scpt2024(),
      new Scpt2023(),
      new Scpt2022(),
    ];
    const index: number = Math.floor(Math.random() * candidates.length);
    const scpt: AbstractScpt | undefined = candidates[index];
    if (scpt) {
      const params: DraftActivityStartParams | undefined = scpt.getPrelim();
      if (params) {
        params.numFactions = 6;
        return params;
      }
    }
  }

  getSemi(): DraftActivityStartParams | undefined {
    return undefined;
  }
  getFinal(): DraftActivityStartParams | undefined {
    return undefined;
  }
}
