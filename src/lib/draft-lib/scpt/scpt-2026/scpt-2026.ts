import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start-params";
import { Milty } from "../../drafts/milty";

export class Scpt2026 extends AbstractScpt {
  getLabel(): string {
    return "#8 (2026)";
  }

  getQual(): DraftActivityStartParams | undefined {
    /*
    const slices: Array<string> = [];
    const labels: Array<string> = [];

    // Prune to player count.
    const playerCount: number = this.getPlayerCount();
    while (slices.length > playerCount) {
      const index: number = Math.floor(Math.random() * slices.length);
      slices.splice(index, 1);
      labels.splice(index, 1);
    }

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: playerCount,
      numFactions: playerCount,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
      countdownHours: 8,
    };
    */
    return undefined;
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
