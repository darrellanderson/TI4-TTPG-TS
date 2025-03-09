import { Player } from "@tabletop-playground/api";
import { IGlobal, NamespaceId, Window } from "ttpg-darrell";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { CombatUIAllSimple } from "../../ui/combat-ui/combat-ui-all-simple/combat-ui-all-simple";
import { System } from "../../lib/system-lib/system/system";

export class ToggleCombatWindow implements IGlobal {
  private _window: Window | undefined = undefined;

  readonly _onSystemActivatedHandler = (
    _system: System,
    _player: Player
  ): void => {
    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }

    const createAbstractUi: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new CombatUIAllSimple(params.scale, params.playerSlot);
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Combat";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    this._window = abstractWindow.createWindow();
  };

  init(): void {
    TI4.events.onSystemActivated.add(this._onSystemActivatedHandler);
  }
}
