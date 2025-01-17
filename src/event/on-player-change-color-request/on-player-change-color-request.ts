import { Button, Player } from "@tabletop-playground/api";
import { Broadcast, IGlobal, NamespaceId, Window } from "ttpg-darrell";

import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { ChangeColorUI } from "../../ui/change-color-ui/change-color-ui";

export class OnPlayerChangeColorRequest implements IGlobal {
  private _colorChangeWindow: Window | undefined;

  readonly _onCancelClickedHandler = (
    _button: Button,
    _player: Player
  ): void => {
    this._closeWindow();
  };

  private readonly _onPlayerChangeColorRequestHandler = (
    targetPlayerSlot: number,
    clickingPlayer: Player
  ) => {
    this._closeWindow();

    const clickingPlayerName: string = clickingPlayer.getName();
    const msg: string = `${clickingPlayerName} clicked change player color`;
    Broadcast.chatAll(msg);

    const createAbstractUi: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      const changeColorUi = new ChangeColorUI(targetPlayerSlot, params.scale);
      const cancelButton: Button = changeColorUi.getCancelButton();
      cancelButton.onClicked.add(this._onCancelClickedHandler);
      return changeColorUi;
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      "Change Color"
    );
    const window: Window = abstractWindow.createWindow().attach();
    this._colorChangeWindow = window;
  };

  private readonly _onPlayerChangedColorHandler = (
    _playerSlot: number,
    _colorName: string,
    _colorHex: string,
    _clickingPlayer: Player
  ): void => {
    this._closeWindow();
  };

  _closeWindow() {
    if (this._colorChangeWindow) {
      this._colorChangeWindow.detach();
      this._colorChangeWindow = undefined;
    }
  }

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
}
