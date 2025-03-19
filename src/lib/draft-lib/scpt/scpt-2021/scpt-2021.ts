import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start-params";
import { Milty } from "../../drafts/milty";

export class Scpt2021 extends AbstractScpt {
  getLabel(): string {
    return "#3 (2021)";
  }

  getQual(): DraftActivityStartParams | undefined {
    return undefined;
  }

  getPrelim(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "30,72,49,79,59",
      "29,66,50,80,31",
      "70,36,40,67,63",
      "73,76,48,45,26",
      "74,69,47,41,61",
      "37,65,46,68,64",
    ];
    const labels: Array<string> = [
      "Malcom In the Middle",
      "Grape Nuts",
      "Old Money",
      "Sonic the Hedgehog",
      "It's the real thing",
      "Vanilla Pizza",
    ];

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: slices.length,
      numFactions: 8,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }

  getSemi(): DraftActivityStartParams | undefined {
    return undefined;
  }
  getFinal(): DraftActivityStartParams | undefined {
    return undefined;
  }
}
