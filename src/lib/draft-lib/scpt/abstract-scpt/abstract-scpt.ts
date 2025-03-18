import { DraftActivityStartParams } from "../../draft-activity-start/draft-activity-start";
import { ScptDraftParams } from "../../../../ui/draft/draft-start-ui/scpt-draft-button-ui";

export abstract class AbstractScpt {
  abstract getLabel(): string;

  abstract getQual(): DraftActivityStartParams | undefined;
  abstract getPrelim(): DraftActivityStartParams | undefined;
  abstract getSemi(): DraftActivityStartParams | undefined;
  abstract getFinal(): DraftActivityStartParams | undefined;

  getScptDraftParams(): ScptDraftParams {
    const label: string = this.getLabel();

    return {
      label,
      qual: this.getQual(),
      prelim: this.getPrelim(),
      semi: this.getSemi(),
      final: this.getFinal(),
    };
  }
}
