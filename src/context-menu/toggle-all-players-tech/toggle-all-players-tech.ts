import { IGlobal, NamespaceId } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { AllPlayersTechsUI } from "../../ui/all-players-techs.ui/all-players-techs-ui";
import {
  GameData,
  PerPlayerGameData,
} from "../../lib/game-data-lib/game-data/game-data";

export class ToggleAllPlayersTech implements IGlobal {
  private _gameData: GameData = { players: [] };
  private _abstractWindow: AbstractWindow | undefined;
  private _windowMaxTech: number = 0;

  private readonly _onGameData = (gameData: GameData): void => {
    this._gameData = gameData;

    let maxTech: number = 0;
    gameData.players.forEach((player: PerPlayerGameData): void => {
      if (player.technologies) {
        maxTech = Math.max(player.technologies.length, maxTech);
      }
    });

    if (this._abstractWindow && this._windowMaxTech !== maxTech) {
      this._abstractWindow.invalidateSize();
    }
  };

  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new AllPlayersTechsUI(params.scale, this._gameData);
    };

    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "All Players Techs";
    this._abstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    this._abstractWindow.getMutableWindowParams().addToggleMenuItem = true;

    // Unlike most windows, set this one up for all player slots.
    const playerSlots: Array<number> = Array.from({ length: 20 }, (_e, i) => i);
    this._abstractWindow.createWindow(playerSlots);

    TI4.events.onGameData.add(this._onGameData);
  }
}
