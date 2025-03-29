import { IGlobal, NamespaceId, Window } from "ttpg-darrell";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { ChooseTechnologyUI } from "../../ui/choose-technology-ui/choose-technology-ui";

export class ToggleTechChooser implements IGlobal {
  private _techChooserWindow: Window | undefined = undefined;

  private readonly _onTechChooserRequestHandler = (
    playerSlot: number
  ): void => {
    if (
      this._techChooserWindow &&
      !this._techChooserWindow.isAttachedForPlayer(playerSlot)
    ) {
      this._techChooserWindow.toggleForPlayer(playerSlot);
    }
  };

  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new ChooseTechnologyUI(params.scale, params.playerSlot);
    };

    const namespaceId: NamespaceId | undefined =
      "@context-menu/toggle-tech-chooser";
    const windowTitle: string = "Tech Chooser";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    this._techChooserWindow = abstractWindow.createWindow();

    // Listen for the request event.
    TI4.events.onTechChooserRequest.add(this._onTechChooserRequestHandler);
  }
}
