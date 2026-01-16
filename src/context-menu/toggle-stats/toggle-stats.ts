import { IGlobal, Window, WindowParams } from "ttpg-darrell";
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
  private _window: Window | undefined = undefined;

  private readonly _onGameData = (gameData: GameData): void => {
    this._lastGameData = gameData;
  };

  init(): void {
    this._resetWindow();
    TI4.events.onGameData.add(this._onGameData);
    TI4.events.onStartGameComplete.add((): void => {
      this._resetWindow();
    });
  }

  _resetWindow(): void {
    if (this._window) {
      this._window.destroy();
      this._window = undefined;
    }

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
    const params: WindowParams = abstractWindow.getMutableWindowParams();

    params.addToggleMenuItem = true;
    params.addToggleMenuTooltip = TI4.locale("tooltip.toggle-stats");
    if (params.screen) {
      params.screen.anchor.v = 1;
      params.screen.pos.v = 0.95;
    }

    this._window = abstractWindow.createWindow();
  }
}
