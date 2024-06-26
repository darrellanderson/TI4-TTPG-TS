import { privateDecrypt } from "crypto";
import {
  CombatAttrsSchemaType,
  UnitAttrsSchemaType,
} from "../schema/unit-attrs-schema";

export class CombatAttrs {
  private _dice: number;
  private _hit: number;
  private _extraDice: number;
  private _rerollMisses: boolean;
  private _crit?: number;
  private _critCount: number;

  constructor(params: CombatAttrsSchemaType) {
    this._dice = params.dice ?? 1;
    this._hit = params.hit;
    this._extraDice = params.extraDice ?? 0;
    this._rerollMisses = params.rerollMisses ?? false;
    this._crit = params.crit;
    this._critCount = params.critCount ?? 0;
  }

  getDice(): number {
    return this._dice;
  }

  getHit(): number {
    return this._hit;
  }

  getExtraDice(): number | undefined {
    return this._extraDice;
  }

  getRerollMisses(): boolean | undefined {
    return this._rerollMisses;
  }

  setDice(value: number): this {
    if (value < 1) {
      throw new Error(`invalid value (${value})`);
    }
    this._dice = value;
    return this;
  }
}

export class UnitAttrs {
  private readonly _unit: string;
  private _count: number = 0;

  constructor(params: UnitAttrsSchemaType) {
    this._unit = params.unit;
  }

  getCount(): number {
    return this._count;
  }

  setCount(value: number): this {
    if (value < 0) {
      throw new Error(`invalid value (${value})`);
    }
    this._count = value;
    return this;
  }
}
