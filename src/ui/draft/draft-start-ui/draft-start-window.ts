import { NamespaceId, Window } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../abstract-window/abstract-window";
import { DraftStartUI } from "./draft-start-ui";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStartParams,
} from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { Milty } from "../../../lib/draft-lib/drafts/milty";

export class DraftStartWindow {
  private _window: Window | undefined = undefined;

  readonly _onDraftStartedHandler = (): void => {
    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }
  };

  // This is mutable, window UI can change it.
  // It is *not* persisted, no point using persistent window with it.
  private readonly _draftActivityStartParams: DraftActivityStartParams = {
    namespaceId: DRAFT_NAMESPACE_ID,
    draft: new Milty(),
    numSlices: TI4.config.playerCount,
    numFactions: TI4.config.playerCount,
    config: "",
  };

  readonly _createAbstractUI: CreateAbstractUIType = (params): AbstractUI => {
    const draftStartUi: DraftStartUI = new DraftStartUI(
      params.scale,
      this._draftActivityStartParams
    );
    draftStartUi.onDraftStarted.add(this._onDraftStartedHandler);
    return draftStartUi;
  };

  constructor() {}

  createAndAttachWindow(playerSlot: number): void {
    const namespaceId: NamespaceId | undefined = undefined;
    const abstractWindow: AbstractWindow = new AbstractWindow(
      this._createAbstractUI,
      namespaceId,
      "Draft Start"
    );

    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }
    this._window = abstractWindow.createWindow([playerSlot]);
    this._window.attach();
  }
}
