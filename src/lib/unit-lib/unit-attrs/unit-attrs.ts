import {
  CombatAttrsSchemaType,
  UnitAttrsSchemaType,
  UnitType,
} from "../schema/unit-attrs-schema";

export class CombatAttrs {
  private _crit?: number;
  private _critCount: number;
  private _dice: number;
  private _extraDice: number;
  private _hit: number;
  private _rerollMisses: boolean;

  constructor(params: CombatAttrsSchemaType) {
    this._dice = params.dice ?? 1; // N dice per object
    this._hit = params.hit; // hit in N or better
    this._extraDice = params.extraDice ?? 0; // N extra dice overall (not per object)
    this._rerollMisses = params.rerollMisses ?? false;
    this._crit = params.crit; // crit on N or better, e.g. jol-nar flagship
    this._critCount = params.critCount ?? 0; // N extra hits on crit
  }

  applyUpgrade(upgrade: CombatAttrsSchemaType): this {
    if (upgrade.crit) {
      this._crit = upgrade.crit;
    }
    if (upgrade.critCount) {
      this._critCount = upgrade.critCount;
    }
    if (upgrade.dice) {
      this._dice = upgrade.dice;
    }
    if (upgrade.extraDice) {
      this._extraDice = upgrade.extraDice;
    }
    if (upgrade.hit) {
      this._hit = upgrade.hit;
    }
    if (upgrade.rerollMisses) {
      this._rerollMisses = upgrade.rerollMisses;
    }
    return this;
  }

  getCrit(): number | undefined {
    return this._crit;
  }

  getCritCount(): number {
    return this._critCount;
  }

  getDice(): number {
    return this._dice;
  }

  getExtraDice(): number | undefined {
    return this._extraDice;
  }

  getHit(): number {
    return this._hit;
  }

  getRerollMisses(): boolean | undefined {
    return this._rerollMisses;
  }

  setCrit(value: number | undefined): this {
    this._crit = value;
    return this;
  }

  setCritCount(value: number): this {
    this._critCount = value;
    return this;
  }

  setDice(value: number): this {
    this._dice = value;
    return this;
  }

  setExtraDice(value: number): this {
    this._extraDice = value;
    return this;
  }

  setHit(value: number): this {
    this._hit = value;
    return this;
  }

  setRerollMisses(value: boolean): this {
    this._rerollMisses = value;
    return this;
  }
}

export class UnitAttrs {
  private readonly _unit: UnitType;
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
