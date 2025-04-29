import {
  Color,
  GameObject,
  GameWorld,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  AbstractRightClickCard,
  Atop,
  Broadcast,
  DiceGroup,
  DiceGroupParams,
  DiceParams,
  DiceResult,
  NSID,
} from "ttpg-darrell";

export const ACTION_NAME: string = "*Roll Infantry";

export class AbstractInfantry2 extends AbstractRightClickCard {
  private readonly _rollValue: number;

  readonly _onRollFinished = (
    diceResults: Array<DiceResult>,
    player: Player
  ): void => {
    const msg: string = this.getMessage(diceResults, player);
    const color: Color = world.getSlotColor(player.getSlot());
    Broadcast.broadcastAll(msg, color);
  };

  constructor(cardNsid: string, rollValue: number) {
    const customActionHandler = (
      object: GameObject,
      player: Player,
      identifier: string
    ): void => {
      if (identifier === ACTION_NAME) {
        const rollPos: Vector = object.getPosition();
        const infantryCount: number = this.countInfantryOnCard(object);
        const params: DiceGroupParams = this.createDiceGroupParams(
          rollPos,
          player,
          infantryCount
        );
        DiceGroup.roll(params);
      }
    };
    super(cardNsid, ACTION_NAME, customActionHandler);
    this._rollValue = rollValue;
  }

  countInfantryOnCard(card: GameObject): number {
    const nsidToInfantryCount: Map<string, number> = new Map<string, number>();
    nsidToInfantryCount.set("unit:base/infantry", 1);
    nsidToInfantryCount.set("token:base/infantry-1", 1);
    nsidToInfantryCount.set("token:base/infantry-3", 3);

    let totalInfantryCount: number = 0;
    const atopCard: Atop = new Atop(card);
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const infantryCount: number | undefined = nsidToInfantryCount.get(nsid);
      if (infantryCount !== undefined) {
        const pos: Vector = obj.getPosition();
        if (atopCard.isAtop(pos)) {
          totalInfantryCount += infantryCount;
        }
      }
    }
    return totalInfantryCount;
  }

  createDiceGroupParams(
    rollPos: Vector,
    player: Player,
    infantryCount: number
  ): DiceGroupParams {
    const diceParams: Array<DiceParams> = [];
    for (let i = 0; i < infantryCount; i++) {
      diceParams.push({
        sides: 10,
        hit: this._rollValue,
      });
    }
    const params: DiceGroupParams = {
      doFakeRoll: GameWorld.getExecutionReason() === "unittest",
      diceParams,
      player,
      position: rollPos,
      callback: this._onRollFinished,
    };
    return params;
  }

  getMessage(diceResults: Array<DiceResult>, player: Player): string {
    let totalHits: number = 0;

    const rollValues: string = diceResults
      .map((diceResult: DiceResult): string => {
        const isHit: boolean | undefined = diceResult.hit;
        if (isHit) {
          totalHits += 1;
        }
        return `${isHit ? "#" : ""}${diceResult.value}`;
      })
      .join(", ");

    const playerName: string = TI4.playerName.getByPlayer(player);
    const msg: string = `${playerName} resurrected ${totalHits} infantry: ${rollValues}`;
    return msg;
  }
}
