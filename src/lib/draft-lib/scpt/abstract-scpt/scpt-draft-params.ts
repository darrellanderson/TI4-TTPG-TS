import { DraftActivityStartParams } from "../../draft-activity-start/draft-activity-start-params";

export type ScptDraftParams = {
  label: string;
  qual?: DraftActivityStartParams;
  prelim?: DraftActivityStartParams;
  semi?: DraftActivityStartParams;
  final?: DraftActivityStartParams;
};
