import { IGlobal, NamespaceId } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { AllPlayersTechsUI } from "../../ui/all-players-techs.ui/all-players-techs-ui";
import { GameData } from "../../lib/game-data-lib/game-data/game-data";

export class ToggleAllPlayersTech implements IGlobal {
  private _gameData: GameData = { players: [] };

  private readonly _onGameData = (gameData: GameData): void => {
    this._gameData = gameData;
  };

  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      return new AllPlayersTechsUI(params.scale, this._gameData);
    };

    const namespaceId: NamespaceId | undefined = undefined;
    const windowTitle: string = "All Players Techs";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;

    // Unlike most windows, set this one up for all player slots.
    const playerSlots: Array<number> = Array.from({ length: 20 }, (_e, i) => i);
    abstractWindow.createWindow(playerSlots);

    TI4.events.onGameData.add(this._onGameData);
  }
}
