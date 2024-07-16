import { CombatAttrsSchemaType } from "../schema/unit-attrs-schema";

export class CombatAttrs {
  private _crit?: number;
  private _critCount: number;
  private _dice: number;
  private _extraDice: number;
  private _hit: number;
  private _rerollMisses: boolean;
  private _range: number;

  constructor(params: CombatAttrsSchemaType) {
    this._dice = params.dice ?? 1; // N dice per object
    this._hit = params.hit; // hit in N or better
    this._extraDice = params.extraDice ?? 0; // N extra dice overall (not per object)
    this._rerollMisses = params.rerollMisses ?? false;
    this._crit = params.crit; // crit on N or better, e.g. jol-nar flagship
    this._critCount = params.critCount ?? 0; // N extra hits on crit
    this._range = params.range ?? 0; // range in hexes: 0=local, 1=adjacent
  }

  /**
   * Apply overrides to the given attributes.
   * If an attribute is missing, do not change it.
   *
   * @param override
   * @returns
   */
  applyOverride(override: CombatAttrsSchemaType): this {
    if (override.crit !== undefined) {
      this._crit = override.crit;
    }
    if (override.critCount !== undefined) {
      this._critCount = override.critCount;
    }
    if (override.dice !== undefined) {
      this._dice = override.dice;
    }
    if (override.extraDice !== undefined) {
      this._extraDice = override.extraDice;
    }
    if (override.hit !== undefined) {
      this._hit = override.hit;
    }
    if (override.rerollMisses) {
      this._rerollMisses = true;
    }
    if (override.range !== undefined) {
      this._range = override.range;
    }
    return this;
  }

  addHit(delta: number): this {
    this._hit += delta;
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

  getExtraDice(): number {
    return this._extraDice;
  }

  getHit(): number {
    return this._hit;
  }

  getRange(): number {
    return this._range;
  }

  getRerollMisses(): boolean {
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

  setRange(value: number): this {
    this._range = value;
    return this;
  }

  setRerollMisses(value: boolean): this {
    this._rerollMisses = value;
    return this;
  }
}
