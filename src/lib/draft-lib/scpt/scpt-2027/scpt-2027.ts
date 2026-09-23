import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start-params";
import { Milty } from "../../drafts/milty";

export class Scpt2027 extends AbstractScpt {
  getLabel(): string {
    return "#9 (2027)";
  }

  getQual(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "31,97,23,49,113",
      "37,66,104,78,40",
      "64,100,73,41,68",
      "109,98,110,44,39",
      "26,115,59,77,20",
      "25,65,29,114,48",
      "62,99,50,67,102",
      "19,79,22,21,80",
    ];
    const labels: Array<string> = [
      "Lazario 64",
      "Meerkart 64",
      "Banjo Cealdri",
      "Tsion and Punishment",
      "GoldenVail",
      "Jet Quet Radio",
      "Buck Bumble",
      "Superman 64",
    ];

    const numSlices: number = this.getPlayerCount() + 2;
    const numFactions: number = this.getPlayerCount() + 1;

    while (slices.length > numSlices) {
      const index: number = Math.floor(Math.random() * slices.length);
      slices.splice(index, 1);
    }

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices,
      numFactions,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
      countdownHours: 8,
    };
  }

  getPrelim(): DraftActivityStartParams | undefined {
    return undefined;
  }

  getSemi(_index?: number): DraftActivityStartParams | undefined {
    return undefined;
  }

  getFinal(): DraftActivityStartParams | undefined {
    return undefined;
  }
}
