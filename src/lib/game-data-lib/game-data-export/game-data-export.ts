import { IGlobal } from "ttpg-darrell";
import { GameData } from "../game-data/game-data";
import { GameWorld } from "@tabletop-playground/api";

const EXPORT_INTERVAL_MSECS = 15 * 60 * 1000; // 15 minutes

/**
 * Send game data to AppEngine for stats.
 */
export class GameDataExport implements IGlobal {
  private readonly _onGameData = (gameData: GameData): void => {
    if (this._sendNextGameData && TI4.config.exportGameData) {
      this._sendNextGameData = false;
      this._send(gameData);
    }
  };

  private readonly _onGameEnd = (): void => {
    this._sendNextGameData = true;
  };

  private readonly _onInterval = (): void => {
    this._sendNextGameData = true;
  };

  private _sendNextGameData: boolean = false;
  private _intervalHandle: NodeJS.Timeout | undefined = undefined;

  init(): void {
    TI4.events.onGameData.add(this._onGameData);
    TI4.events.onGameEnd.add(this._onGameEnd);
    this._maybeStartInterval(GameWorld.getExecutionReason());
  }

  destroy(): void {
    TI4.events.onGameData.remove(this._onGameData);
    TI4.events.onGameEnd.remove(this._onGameEnd);
    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
  }

  _maybeStartInterval(executionReason: string): void {
    if (executionReason !== "unittest") {
      this._intervalHandle = setInterval(
        this._onInterval,
        EXPORT_INTERVAL_MSECS
      );
    }
  }

  _send(gameData: GameData): void {
    const json: string = JSON.stringify(gameData);
    const url: string = [
      "ti4-game-data.appspot.com",
      "/posttimestamp_ttpg",
      `?timestamp=${TI4.config.timestamp}`,
    ].join("");
    const fetchOptions = {
      headers: { "Content-type": "application/json;charset=UTF-8" },
      body: json,
      method: "POST",
    };
    fetch(url, fetchOptions);
  }
}
