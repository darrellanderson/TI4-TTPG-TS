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
    /*const slices: Array<string> = [];
    const labels: Array<string> = ["a", "b", "c", "d", "e", "f", "g", "h"];

    // Prune to player count.
    const numSlices: number = this.getPlayerCount();
    const numFactions: number = this.getPlayerCount();

    while (slices.length > numSlices) {
      const index: number = Math.floor(Math.random() * slices.length);
      slices.splice(index, 1);
      labels.splice(index, 1);
    }

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices,
      numFactions,
      //config: `${slices.join("|")}&labels=${labels.join("|")}`,
      config: `&labels=${labels.join("|")}`,
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
