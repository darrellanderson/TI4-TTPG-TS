import { Button, Player } from "@tabletop-playground/api";
import { Broadcast, IGlobal, NamespaceId, Window } from "ttpg-darrell";

import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { ChangeColorUI } from "../../ui/change-color-ui/change-color-ui";

export class OnPlayerChangeColorRequest implements IGlobal {
  private _cancelButton: Button | undefined;
  private _window: Window | undefined;

  private readonly _onPlayerChangeColorRequestHandler = (
    playerSlot: number,
    clickingPlayer: Player
  ) => {
    const clickingPlayerName: string = clickingPlayer.getName();
    const msg: string = `${clickingPlayerName} clicked change player color`;
    Broadcast.chatAll(msg);

    const createAbstractUi: CreateAbstractUIType = (
      scale: number
    ): AbstractUI => {
      const changeColorUi = new ChangeColorUI(playerSlot, scale);
      this._cancelButton = changeColorUi.getCancelButton();
      return changeColorUi;
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      "Change Color"
    );
    this._window = abstractWindow.createWindow().attach();

    if (this._cancelButton) {
      this._cancelButton.onClicked.add(() => {
        if (this._window) {
          this._window.detach();
          this._window = undefined;
        }
      });
    }
  };

  private readonly _onPlayerChangedColorHandler = (
    _playerSlot: number,
    _colorName: string,
    _colorHex: string,
    _clickingPlayer: Player
  ): void => {
    if (this._window) {
      this._window.detach();
      this._window = undefined;
    }
  };

  init(): void {
    TI4.events.onPlayerChangeColorRequest.add(
      this._onPlayerChangeColorRequestHandler
    );
    TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
  }

  destroy(): void {
    TI4.events.onPlayerChangeColorRequest.remove(
      this._onPlayerChangeColorRequestHandler
    );
  }

  getCancelButton(): Button | undefined {
    return this._cancelButton;
  }
}
