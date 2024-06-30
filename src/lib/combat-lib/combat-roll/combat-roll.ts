import { HexType } from "ttpg-darrell";

export type CombatRollType =
  | "antiFighterBarrage"
  | "bombardment"
  | "spaceCannonOffense"
  | "spaceCannonDefense"
  | "spaceCombat"
  | "groundCombat";

export type CombatRollParams = {
  type: CombatRollType;
  hex: HexType;
  activatingPlayerSlot: number;
  rollingPlayerSlot: number;
};

export class CombatRoll {
  private readonly _params: CombatRollParams;

  constructor(params: CombatRollParams) {
    this._params = params;
  }

  public getType(): CombatRollType {
    return this._params.type;
  }
}
