import { Button, Player } from "@tabletop-playground/api";
import { Broadcast, IGlobal, NamespaceId, Window } from "ttpg-darrell";

import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { ChangeColorUI } from "../../ui/change-color-ui/change-color-ui";

export class OnPlayerChangeColorRequest implements IGlobal {
  private _playerSlotToWindow: Map<number, Window> = new Map();

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
      const cancelButton: Button = changeColorUi.getCancelButton();

      cancelButton.onClicked.add(
        this._createCancelOnClickedHandler(playerSlot)
      );

      return changeColorUi;
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      "Change Color"
    );
    const window: Window = abstractWindow.createWindow().attach();
    this._playerSlotToWindow.set(playerSlot, window);
  };

  private readonly _onPlayerChangedColorHandler = (
    playerSlot: number,
    _colorName: string,
    _colorHex: string,
    _clickingPlayer: Player
  ): void => {
    this._closeWindow(playerSlot);
  };

  public _createCancelOnClickedHandler(playerSlot: number): () => void {
    return () => {
      this._closeWindow(playerSlot);
    };
  }

  _closeWindow(playerSlot: number) {
    const window: Window | undefined = this._playerSlotToWindow.get(playerSlot);
    if (window) {
      window.detach();
      this._playerSlotToWindow.delete(playerSlot);
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
