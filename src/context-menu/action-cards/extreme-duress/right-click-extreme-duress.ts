import { GameObject, Player } from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  IGlobal,
  TurnOrder,
} from "ttpg-darrell";

const NSID_EXTREME_DURESS: string = "card.action:thunders-edge/extreme-duress";
const ACTION_ENABLE_EXTREME_DURESS: string =
  "*Announce extreme duress at end of current turn";
const TOOLTIP_ENABLE_EXTREME_DURESS: string =
  "When the current turn changes broadcast extreme duress MAY be used message to all players";
const ACTION_DISABLE_EXTREME_DURESS: string = "*Cancel extreme duress";

export class RightClickExtremeDuress
  extends AbstractRightClickCard
  implements IGlobal
{
  private _extremeDuressActivated: boolean = false;

  private readonly _onTurnChange = (turnOrder: TurnOrder): void => {
    if (turnOrder === TI4.turnOrder && this._extremeDuressActivated) {
      this._extremeDuressActivated = false;

      const currentSlot: number = TI4.turnOrder.getCurrentTurn();
      const playerName: string = TI4.playerName.getBySlot(currentSlot);
      Broadcast.broadcastAll(
        `EXTREME DURESS ACTIVATED, card holder may ask ${playerName} to play their strategy card`
      );
    }
  };

  constructor() {
    const customActionHandler = (
      _object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_ENABLE_EXTREME_DURESS) {
        this._extremeDuressActivated = true;
        Broadcast.chatOne(player, "Extreme Duress enabled");
      } else if (identifier === ACTION_DISABLE_EXTREME_DURESS) {
        this._extremeDuressActivated = false;
        Broadcast.chatOne(player, "Extreme Duress disabled");
      }
    };
    super(
      NSID_EXTREME_DURESS,
      ACTION_ENABLE_EXTREME_DURESS,
      customActionHandler
    );
    this.setTooltip(
      ACTION_ENABLE_EXTREME_DURESS,
      TOOLTIP_ENABLE_EXTREME_DURESS
    );
    this.addCustomActionName(ACTION_DISABLE_EXTREME_DURESS);
  }

  init(): void {
    super.init();
    TurnOrder.onTurnStateChanged.add(this._onTurnChange);
  }
}
