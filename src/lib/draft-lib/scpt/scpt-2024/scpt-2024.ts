import { AbstractScpt } from "../abstract-scpt/abstract-scpt";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../draft-activity-start/draft-activity-start-params";
import { Milty } from "../../drafts/milty";

export class Scpt2024 extends AbstractScpt {
  getLabel(): string {
    return "#6 (2024)";
  }

  getQual(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "32,66,68,63,39",
      "26,76,49,19,41",
      "64,35,65,22,79",
      "50,37,45,61,36",
      "25,73,78,59,62",
      "72,75,80,21,40",
    ];
    const labels: Array<string> = [
      "101 Dal Boothas",
      "Will",
      "Tharma $AMPERSAND Breg",
      "Yellow Slice Because It Has 2 Reds",
      "Give Me Integrated or Give Me Death",
      "Devil Went Down to Velnor",
    ];

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: slices.length,
      numFactions: 6,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }

  getPrelim(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "33,62,41,25,32",
      "44,36,19,40,72",
      "45,70,35,64,78",
      "50,74,65,26,63",
      "69,21,23,79,48",
      "38,59,42,39,24",
    ];
    const labels: Array<string> = [
      "Corneeqticut",
      "Lorxembourg",
      "Siigney",
      "Vorhalabama",
      "Düssaudorf",
      "New South Vails",
    ];

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: slices.length,
      numFactions: 6,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }

  getSemi(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "64,32,42,70,67", // 3
      "23,79,75,62,50", // 2
      "68,49,36,25,63", // 1
      "20,27,59,40,41", // 6
      "39,66,19,48,76", // 4
      "26,74,78,24,43", // 5
    ];
    const labels: Array<string> = [
      "SLICE",
      "SLICE",
      "SLICE",
      "SLICE",
      "SLICE",
      "SLICE",
    ];

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: slices.length,
      numFactions: 6,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }

  getFinal(): DraftActivityStartParams | undefined {
    const slices: Array<string> = [
      "34,22,67,77,66",
      "41,32,47,59,69",
      "35,25,44,73,49",
      "40,75,42,24,26",
      "39,76,62,43,64",
      "27,50,72,79,65",
    ];
    const labels: Array<string> = [
      "Slice 1",
      "Slice 2",
      "Slice 3",
      "Slice 4",
      "Slice 5",
      "Slice 6",
    ];

    return {
      namespaceId: DRAFT_NAMESPACE_ID,
      draft: new Milty(),
      numSlices: slices.length,
      numFactions: 6,
      config: `${slices.join("|")}&labels=${labels.join("|")}`,
    };
  }
}
