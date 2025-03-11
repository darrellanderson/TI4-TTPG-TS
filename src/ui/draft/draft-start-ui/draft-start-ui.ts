import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStart,
  DraftActivityStartParams,
} from "../../../lib/draft-lib/draft-activity-start/draft-activity-start";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { Broadcast } from "ttpg-darrell";

export class DraftStartUI extends AbstractUI {
  private readonly _idraft: IDraft;
  private readonly _params: DraftActivityStartParams = {
    namespaceId: DRAFT_NAMESPACE_ID,
    numSlices: 6,
    numFactions: 6,
    config: "",
  };

  constructor(scale: number, idraft: IDraft) {
    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .build();
    super(ui.getWidget(), ui.getSize());

    this._idraft = idraft;
  }

  start(): void {
    const errors: Array<string> = new Array<string>();
    new DraftActivityStart().start(this._idraft, this._params, errors);
    if (errors.length > 0) {
      const msg: string = errors.join("\n");
      Broadcast.chatAll("Draft start errors:\n" + msg);
    }
  }
}
