import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { AbstractRightClickCard, DiceGroupParams, DiceResult } from "ttpg-darrell";
export declare const ACTION_NAME: string;
export declare class AbstractInfantry2 extends AbstractRightClickCard {
    private readonly _rollValue;
    readonly _onRollFinished: (diceResults: Array<DiceResult>, player: Player) => void;
    constructor(cardNsid: string, rollValue: number);
    countInfantryOnCard(card: GameObject): number;
    createDiceGroupParams(rollPos: Vector, player: Player, infantryCount: number): DiceGroupParams;
    getMessage(diceResults: Array<DiceResult>, player: Player): string;
}
