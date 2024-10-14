import { EndTurnButtonUI } from "./end-turn-button-ui";

export class CreateAndAttachEndTurnButtonUI {
  private readonly _endTurnButtonUI: EndTurnButtonUI = new EndTurnButtonUI();

  constructor() {}

  init() {
    this._endTurnButtonUI.attachToScreen();
  }

  destroy(): void {
    this._endTurnButtonUI.destroy();
  }
}
