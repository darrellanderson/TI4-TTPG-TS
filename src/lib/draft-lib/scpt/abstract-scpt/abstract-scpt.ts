import { DraftActivityStartParams } from "../../draft-activity-start/draft-activity-start-params";
import { ScptDraftParams } from "./scpt-draft-params";

export abstract class AbstractScpt {
  abstract getLabel(): string;

  abstract getQual(): DraftActivityStartParams | undefined;
  abstract getPrelim(): DraftActivityStartParams | undefined;
  abstract getSemi(): DraftActivityStartParams | undefined;
  abstract getFinal(): DraftActivityStartParams | undefined;

  getPlayerCount(): number {
    return TI4.config.playerCount;
  }

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
