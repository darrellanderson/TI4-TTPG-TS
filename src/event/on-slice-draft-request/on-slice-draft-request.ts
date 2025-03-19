import { IGlobal } from "ttpg-darrell";
import { DraftActivityStartParams } from "../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { DraftStartUI } from "../../ui/draft/draft-start-ui/draft-start-ui";

export class OnSliceDraftRequest implements IGlobal {
  init(): void {
    TI4.events.onSliceDraftRequest.add(
      (draftActivityStartParams: DraftActivityStartParams): void => {
        new DraftStartUI(1, draftActivityStartParams).startDraft();
      }
    );
  }
}
