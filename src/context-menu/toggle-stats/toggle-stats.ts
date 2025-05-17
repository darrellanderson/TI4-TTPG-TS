import { IGlobal } from "ttpg-darrell";
import {
  AbstractWindow,
  CreateAbstractUIParams,
  CreateAbstractUIType,
} from "../../ui/abstract-window/abstract-window";
import { AbstractUI } from "../../ui/abstract-ui/abtract-ui";
import { StatsUI } from "../../ui/stats-ui/stats-ui";
import { GameData } from "../../lib/game-data-lib/game-data/game-data";

export class ToggleStats implements IGlobal {
  private _lastGameData: GameData = { players: [] };

  private readonly _onGameData = (gameData: GameData): void => {
    this._lastGameData = gameData;
  };

  init(): void {
    const createAbstractUI: CreateAbstractUIType = (
      params: CreateAbstractUIParams
    ): AbstractUI => {
      const statsUi: StatsUI = new StatsUI(params.scale);
      statsUi.update(this._lastGameData);
      return statsUi;
    };

    const namespaceId = "@context-menu/toggle-stats";
    const windowTitle: string = "Stats";
    const abstractWindow: AbstractWindow = new AbstractWindow(
      createAbstractUI,
      namespaceId,
      windowTitle
    );
    abstractWindow.getMutableWindowParams().addToggleMenuItem = true;
    abstractWindow.getMutableWindowParams().addToggleMenuTooltip = TI4.locale(
      "tooltip.toggle-stats"
    );

    abstractWindow.createWindow();

    TI4.events.onGameData.add(this._onGameData);
  }
}
