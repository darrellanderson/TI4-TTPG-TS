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

  // Toggles window.
  private readonly _onTechChooserRequestHandler = (
    playerSlot: number
  ): void => {
    if (this._techChooserWindow) {
      this._techChooserWindow.toggleForPlayer(playerSlot);
    }
  };

  init(): void {
    this._resetWindow();

    // Listen for the request event.
    TI4.events.onTechChooserRequest.add(this._onTechChooserRequestHandler);
    TI4.events.onStartGameComplete.add((): void => {
      this._resetWindow();
    });
  }

  _resetWindow(): void {
    if (this._techChooserWindow) {
      this._techChooserWindow.destroy();
      this._techChooserWindow = undefined;
    }

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
    abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale(
      "tooltip.toggle-tech-chooser"
    );

    this._techChooserWindow = abstractWindow.createWindow();
  }
}
