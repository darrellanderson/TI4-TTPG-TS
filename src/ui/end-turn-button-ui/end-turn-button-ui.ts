import { refPackageId } from "@tabletop-playground/api";
import { EndTurnButton, EndTurnButtonParams, TurnOrder } from "ttpg-darrell";

const packageId: string = refPackageId;

export class EndTurnButtonUI {
  private readonly _endTurnButton: EndTurnButton;

  constructor() {
    const turnOrder: TurnOrder = TI4.turnOrder;
    const params: EndTurnButtonParams = {
      sound: "beep-ramp-up.flac",
      soundPackageId: packageId,
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
