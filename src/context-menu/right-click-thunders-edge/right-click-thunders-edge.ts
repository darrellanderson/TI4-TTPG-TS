import {
  Card,
  Color,
  GameObject,
  GameWorld,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import {
  Broadcast,
  CardUtil,
  DiceGroup,
  DiceGroupParams,
  DiceParams,
  DiceResult,
  IGlobal,
  NSID,
} from "ttpg-darrell";
import { RightClickFracture } from "../fracture/right-click-fracture";

const ACTION_FETCH: string = "*Fetch Planet Cards";
const ACTION_ROLL_FOR_FRACTURE: string = "*Roll for Fracture";

export class RightClickThundersEdge implements IGlobal {
  private readonly _onObjectCreated = (obj: GameObject): void => {
    this._maybeAddContextMenu(obj);
  };

  private readonly _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string,
  ): void => {
    if (identifier === ACTION_FETCH) {
      this._fetchPlanetCard(object, player);
    } else if (identifier === ACTION_ROLL_FOR_FRACTURE) {
      this._rollForFracture(object, player);
    }
  };

  init(): void {
    globalEvents.onObjectCreated.add(this._onObjectCreated);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenu(obj);
    }
  }

  _maybeAddContextMenu(obj: GameObject): void {
    const thundersEdgeNsid: string =
      "token.attachment.system:thunders-edge/thunders-edge";
    const nsid: string = NSID.get(obj);
    if (nsid === thundersEdgeNsid) {
      obj.removeCustomAction(ACTION_FETCH);
      obj.addCustomAction(ACTION_FETCH);
      obj.removeCustomAction(ACTION_ROLL_FOR_FRACTURE);
      obj.addCustomAction(ACTION_ROLL_FOR_FRACTURE);
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);
    }
  }

  _fetchPlanetCard(obj: GameObject, _player: Player): void {
    const cardUtil: CardUtil = new CardUtil();
    const pos = obj.getPosition().add([0, 0, 10]);

    const nsids: Array<string> = [
      "card.planet:thunders-edge/thunders-edge",
      "card.legendary-planet:thunders-edge/jupiter-brain",
    ];

    nsids.forEach((nsid) => {
      const card: Card | undefined = cardUtil.fetchCard(nsid);
      if (card) {
        card.setPosition(pos);
        card.snapToGround();
      }
    });
  }

  /**
   * On a 1 or 10 fracture enters play.
   *
   * @param obj
   * @param _player
   */
  _rollForFracture(obj: GameObject, player: Player): void {
    const callback = (
      diceResults: Array<DiceResult>,
      _player: Player,
    ): void => {
      const result: DiceResult | undefined = diceResults[0];
      if (result === undefined) {
        throw new Error("Expected a result");
      }

      const value: number = result.value;
      const doDeploy: boolean = value === 1 || value === 10;
      const action: string = doDeploy ? "enters play" : "does not enter play";

      const playerName: string = TI4.playerName.getByPlayer(player);
      const color: Color = world.getSlotColor(player.getSlot());
      const msg: string = `${playerName} rolled ${value} for fracture, ${action}`;
      Broadcast.chatAll(msg, color);

      if (doDeploy) {
        this._deployFracture();
      }
    };

    const diceGroupParams: DiceGroupParams = {
      diceParams: [
        {
          sides: 10,
          id: "fracture-roll",
        },
      ],
      player,
      callback,
      position: obj.getPosition().add([0, 0, 3]),
      doFakeRoll: GameWorld.getExecutionReason() === "unittest",
    };
    DiceGroup.roll(diceGroupParams);
  }

  _deployFracture(): void {
    // Leverage existing deploy (note does NOT call init to prevent new listeners).
    new RightClickFracture()._deployFracture();
  }

  _highlightTechSkipsMatchingBreakthrough(): void {
    // TODO
  }
}
