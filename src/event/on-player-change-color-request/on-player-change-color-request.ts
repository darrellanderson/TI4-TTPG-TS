import { Player } from "@tabletop-playground/api";
import { Broadcast, IGlobal, NamespaceId } from "ttpg-darrell";

import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import {
  AbstractWindow,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { ChangeColorUI } from "../../ui/change-color-ui/change-color-ui";

export class OnPlayerChangeColorRequest implements IGlobal {
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
      return new ChangeColorUI(playerSlot, scale);
    };
    const namespaceId: NamespaceId | undefined = undefined;
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUi,
      namespaceId,
      "Change Color"
    );
    abstractWindow.createWindow();
  };

  init(): void {
    TI4.events.onPlayerChangeColorRequest.add(
      this._onPlayerChangeColorRequestHandler
    );
  }

  destroy(): void {
    TI4.events.onPlayerChangeColorRequest.remove(
      this._onPlayerChangeColorRequestHandler
    );
  }
}
