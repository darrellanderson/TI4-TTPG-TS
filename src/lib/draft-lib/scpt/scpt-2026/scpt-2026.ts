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
    const slices: Array<string> = [
      "79,109,107,47,74",
      "102,76,111,114,48",
      "40,108,100,44,37",
      "113,27,99,46,24",
      "26,28,115,43,19",
      "64,73,67,42,59",
      "39,110,62,49,63",
    ];
    const labels: Array<string> = [
      "The Bellagio",
      "Triples is Best",
      "The Tempestations",
      "A Starpoint in your Starpoint",
      "It's Gashlai O'clock",
      'Atlas "Shrugged"',
      "Fisherman's Horizon",
    ];

    // Prune to player count + 1 preserving order.
    const numSlices: number = this.getPlayerCount() + 1;
    const numFactions: number = this.getPlayerCount() + 1;
    while (slices.length > numSlices) {
      slices.pop();
      labels.pop();
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
    const slices: Array<string> = [
      "46,34,117,65,26",
      "64,72,48,69,45",
      "40,29,80,35,102",
      "49,31,103,98,113",
      "39,60,97,116,101",
      "79,106,68,66,61",
    ];
    const labels: Array<string> = [
      "All along the Graltower",
      "Jeol Ir Fan",
      "Applebees",
      "The Dump",
      "It starts with one",
      "Influence Shminfluence",
    ];

    // Prune to player count + 1 preserving order.
    const numSlices: number = slices.length;
    const numFactions: number = 7;

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices,
      numFactions,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
      countdownHours: 8,
    };
  }

  getSemi(): DraftActivityStartParams | undefined {
    return undefined;
  }

  getFinal(): DraftActivityStartParams | undefined {
    return undefined;
  }
}
