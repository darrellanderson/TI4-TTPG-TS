import { IGlobal } from "ttpg-darrell";

import { Config } from "../../lib/config/config";
import { TurnOrderUI } from "./turn-order-ui";

export class CreateAndAttachTurnOrderUI implements IGlobal {
  private _turnOrderUI: TurnOrderUI | undefined;

  constructor() {}

  init() {
    if (this._turnOrderUI) {
      this.destroy();
      this._turnOrderUI = undefined;
    }

    const playerCount: number = TI4.config.playerCount;
    console.log(`CreateAndAttachTurnOrderUI playerCount: ${playerCount}`);
    this._turnOrderUI = new TurnOrderUI()
      .setPlayerCount(playerCount)
      .attachToScreen();

    TI4.config.onConfigChanged.add((_config: Config): void => {
      this.init();
    });
  }

  destroy(): void {
    if (this._turnOrderUI) {
      this._turnOrderUI.destroy();
      this._turnOrderUI = undefined;
    }
  }
}
