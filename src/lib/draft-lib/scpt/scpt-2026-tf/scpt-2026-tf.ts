import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start-params";
import { Milty } from "../../drafts/milty";

export class Scpt2026TF extends AbstractScpt {
  getLabel(): string {
    return "TF1 (2026)";
  }

  getQual(): DraftActivityStartParams | undefined {
    return undefined;
  }

  getPrelim(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "100,111,37,67,39",
      "40,27,117,99,107",
      "26,31,113,115,29",
      "76,114,106,49,64",
      "80,102,69,46,110",
      "35,25,116,61,68",
    ];
    const labels: Array<string> = [
      "", // hold for player themed slice names
      "",
      "",
      "",
      "",
      "",
    ];

    const numSlices: number = slices.length;
    const numFactions: number = TI4.config.playerCount;

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices,
      numFactions,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
      countdownHours: 9,
    };
  }

  getSemi(_index?: number): DraftActivityStartParams | undefined {
    return undefined;
  }

  getFinal(): DraftActivityStartParams | undefined {
    return undefined;
  }
}
