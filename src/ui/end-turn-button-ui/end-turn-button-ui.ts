import { refPackageId } from "@tabletop-playground/api";
import { EndTurnButton, EndTurnButtonParams, TurnOrder } from "ttpg-darrell";

export class EndTurnButtonUI {
  private readonly _endTurnButton: EndTurnButton;

  constructor() {
    const turnOrder: TurnOrder = TI4.turnOrder;
    const params: EndTurnButtonParams = {
      sound: "beep-ramp-up.flac",
      soundPackageId: refPackageId,
    };
    this._endTurnButton = new EndTurnButton(turnOrder, params);
  }

  attachToScreen(): this {
    this._endTurnButton.attachToScreen();
    return this;
  }

  destroy(): void {
    this._endTurnButton.detach();
    this._endTurnButton.destroy();
  }
}
