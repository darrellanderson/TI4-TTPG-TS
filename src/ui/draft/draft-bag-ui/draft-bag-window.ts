import { NamespaceId, Window } from "ttpg-darrell";
import { AbstractUI } from "../../abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../abstract-window/abstract-window";
import { DraftBagUI } from "./draft-bag-ui";
import { BagDraft } from "../../../lib";

export class DraftBagWindow {
  private _draftBagUI: DraftBagUI | undefined;
  private _window: Window | undefined = undefined;

  readonly _createAbstractUI: CreateAbstractUIType = (params): AbstractUI => {
    if (this._draftBagUI) {
      this._draftBagUI.getStartButton().onClicked.clear();
      this._draftBagUI = undefined;
    }

    this._draftBagUI = new DraftBagUI(params.scale);
    this._draftBagUI.getStartButton().onClicked.add(() => {
      this._closeWindow();
      this._startBagDraft();
    });
    return this._draftBagUI;
  };

  constructor() {}

  createAndAttachWindow(playerSlot: number): void {
    const namespaceId: NamespaceId | undefined = undefined;
    const abstractWindow: AbstractWindow = new AbstractWindow(
      this._createAbstractUI,
      namespaceId,
      "Bag Draft"
    );

    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }
    this._window = abstractWindow.createWindow([playerSlot]);
    this._window.attach();
  }

  _closeWindow() {
    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }
  }

  _startBagDraft() {
    if (this._draftBagUI) {
      new BagDraft()
        .setContainerNsid("container:base/bag-draft")
        .setGenerateSlicesParams(this._draftBagUI.getGenerateSlicesParams())
        .createDraftObjects();
    }
  }
}
