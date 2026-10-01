import { GameObject, Player } from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Broadcast,
  IGlobal,
  TurnOrder,
} from "ttpg-darrell";

const NSID_CRISIS: string = "card.action:thunders-edge/crisis";
const ACTION_ENABLE_CRISIS: string = "*Announce crisis at end of current turn";
const TOOLTIP_ENABLE_CRISIS: string =
  "When the current turn changes broadcast crisis MAY be used message to all players";
const ACTION_DISABLE_CRISIS: string = "*Cancel crisis";

export class RightClickCrisis
  extends AbstractRightClickCard
  implements IGlobal
{
  private _crisisActivated: boolean = false;

  private readonly _onTurnChange = (turnOrder: TurnOrder): void => {
    if (turnOrder === TI4.turnOrder && this._crisisActivated) {
      this._crisisActivated = false;

      const currentSlot: number = TI4.turnOrder.getCurrentTurn();
      const playerName: string = TI4.playerName.getBySlot(currentSlot);
      Broadcast.broadcastAll(
        `CRISIS ACTIVATED, card holder may choose to skip ${playerName}'s turn`
      );
    }
  };

  constructor() {
    const customActionHandler = (
      _object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_ENABLE_CRISIS) {
        this._crisisActivated = true;
        Broadcast.chatOne(player, "Crisis enabled");
      } else if (identifier === ACTION_DISABLE_CRISIS) {
        this._crisisActivated = false;
        Broadcast.chatOne(player, "Crisis disabled");
      }
    };
    super(NSID_CRISIS, ACTION_ENABLE_CRISIS, customActionHandler);
    this.setTooltip(ACTION_ENABLE_CRISIS, TOOLTIP_ENABLE_CRISIS);
    this.addCustomActionName(ACTION_DISABLE_CRISIS);
  }

  init(): void {
    super.init();
    TurnOrder.onTurnStateChanged.add(this._onTurnChange);
  }
}
