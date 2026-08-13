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
    return undefined;
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
