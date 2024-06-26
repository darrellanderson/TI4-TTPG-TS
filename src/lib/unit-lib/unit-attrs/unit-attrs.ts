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

  /**
   * Apply overrides to the given attributes.
   * If an attribute is missing, do not change it.
   *
   * @param override
   * @returns
   */
  applyOverride(override: CombatAttrsSchemaType): this {
    if (override.crit) {
      this._crit = override.crit;
    }
    if (override.critCount) {
      this._critCount = override.critCount;
    }
    if (override.dice) {
      this._dice = override.dice;
    }
    if (override.extraDice) {
      this._extraDice = override.extraDice;
    }
    if (override.hit) {
      this._hit = override.hit;
    }
    if (override.rerollMisses) {
      this._rerollMisses = override.rerollMisses;
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
  private readonly _name: string;
  private readonly _unit: UnitType;

  private _unitCount: number; // component count, e.g. fighters = 10
  private _cost: number | undefined;
  private _producePerCost: number; // e.g. 2 for fighters

  private _isShip: boolean;
  private _isGround: boolean;

  private _sustainDamage: boolean;
  private _planetaryShild: boolean;
  private _disablePlanetaryShield: boolean;

  private _antiFighterBarrage: CombatAttrs | undefined;
  private _bombardment: CombatAttrs | undefined;
  private _spaceCannon: CombatAttrs | undefined;
  private _spaceCombat: CombatAttrs | undefined;
  private _groundCombat: CombatAttrs | undefined;

  constructor(params: UnitAttrsSchemaType) {
    this._name = params.name;
    this._unit = params.unit;

    this._unitCount = params.unitCount ?? 0;
    this._producePerCost = params.producePerCost ?? 1;

    this._isShip = params.isShip ?? false;
    this._isGround = params.isGround ?? false;
    this._sustainDamage = params.sustainDamage ?? false;
    this._planetaryShild = params.planetaryShild ?? false;
    this._disablePlanetaryShield = params.disablePlanetaryShield ?? false;

    if (params.antiFighterBarrage) {
      this._antiFighterBarrage = new CombatAttrs(params.antiFighterBarrage);
    }
    if (params.bombardment) {
      this._bombardment = new CombatAttrs(params.bombardment);
    }
    if (params.spaceCannon) {
      this._spaceCannon = new CombatAttrs(params.spaceCannon);
    }
    if (params.spaceCombat) {
      this._spaceCombat = new CombatAttrs(params.spaceCombat);
    }
    if (params.groundCombat) {
      this._groundCombat = new CombatAttrs(params.groundCombat);
    }
  }

  /**
   * Apply overrides to the given attributes.
   * If an attribute is missing, do not change it.
   *
   * @param override
   * @returns
   */
  applyOverride(override: UnitAttrsSchemaType): this {
    if (override.cost) {
      this._cost = override.cost;
    }
    if (override.isGround) {
      this._isGround = override.isGround;
    }
    if (override.isShip) {
      this._isShip = override.isShip;
    }
    if (override.planetaryShild) {
      this._planetaryShild = override.planetaryShild;
    }
    if (override.producePerCost) {
      this._producePerCost = override.producePerCost;
    }
    if (override.sustainDamage) {
      this._sustainDamage = override.sustainDamage;
    }
    if (override.unitCount) {
      this._unitCount = override.unitCount;
    }
    if (override.antiFighterBarrage) {
      if (!this._antiFighterBarrage) {
        this._antiFighterBarrage = new CombatAttrs(override.antiFighterBarrage);
      } else {
        this._antiFighterBarrage.applyOverride(override.antiFighterBarrage);
      }
    }
    if (override.bombardment) {
      if (!this._bombardment) {
        this._bombardment = new CombatAttrs(override.bombardment);
      } else {
        this._bombardment.applyOverride(override.bombardment);
      }
    }
    if (override.spaceCannon) {
      if (!this._spaceCannon) {
        this._spaceCannon = new CombatAttrs(override.spaceCannon);
      } else {
        this._spaceCannon.applyOverride(override.spaceCannon);
      }
    }
    if (override.spaceCombat) {
      if (!this._spaceCombat) {
        this._spaceCombat = new CombatAttrs(override.spaceCombat);
      } else {
        this._spaceCombat.applyOverride(override.spaceCombat);
      }
    }
    if (override.groundCombat) {
      if (!this._groundCombat) {
        this._groundCombat = new CombatAttrs(override.groundCombat);
      } else {
        this._groundCombat.applyOverride(override.groundCombat);
      }
    }

    return this;
  }
}
