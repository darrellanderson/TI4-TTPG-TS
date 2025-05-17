import { IGlobal, NamespaceId } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { GameData } from "../../lib/game-data-lib/game-data/game-data";
import { PlayerActionPhaseTimeUI } from "../../ui/player-action-phase-time-ui/player-action-phase-time-ui";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";

export class ToggleActionPhaseTimes implements IGlobal {
  private _gameData: GameData = { players: [] };

  private readonly _onGameData = (gameData: GameData): void => {
    this._gameData = gameData;
  };

  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new PlayerActionPhaseTimeUI(params.scale);
    };

    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "Action Phase Time";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale(
      "tooltip.toggle-action-phase-timers"
    );

    // Unlike most windows, set this one up for all player slots.
    const playerSlots: Array<number> = Array.from({ length: 20 }, (_e, i) => i);
    abstractWindow.createWindow(playerSlots);

    TI4.events.onGameData.add(this._onGameData);
  }
}
