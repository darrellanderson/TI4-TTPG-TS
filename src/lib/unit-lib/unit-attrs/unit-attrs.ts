import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { CombatAttrs } from "./combat-attrs";

/**
 * Unit attributes, e.g. cost, combat stats.
 *
 * Unlike systems, make unit attributes mutable because unit modifiers
 * can get very compliated; provide them simpler access to attributes.
 * This does mean need to regenerate unit attributes for each instance.
 */
export class UnitAttrs {
  private readonly _name: string;
  private readonly _unit: UnitType;
  private readonly _unitCount: number; // component count, e.g. fighters = 10

  private _cost: number | undefined;
  private _producePerCost: number; // e.g. 2 for fighters

  private _isShip: boolean;
  private _isGround: boolean;

  private _sustainDamage: boolean;
  private _planetaryShield: boolean;
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

    this._cost = params.cost;
    this._producePerCost = params.producePerCost ?? 1;

    this._isShip = params.isShip ?? false;
    this._isGround = params.isGround ?? false;
    this._sustainDamage = params.sustainDamage ?? false;
    this._planetaryShield = params.planetaryShield ?? false;
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
    if (override.cost !== undefined) {
      this._cost = override.cost;
    }
    if (override.disablePlanetaryShield !== undefined) {
      this._disablePlanetaryShield = override.disablePlanetaryShield;
    }
    if (override.isGround !== undefined) {
      this._isGround = override.isGround;
    }
    if (override.isShip !== undefined) {
      this._isShip = override.isShip;
    }
    if (override.planetaryShield !== undefined) {
      this._planetaryShield = override.planetaryShield;
    }
    if (override.producePerCost !== undefined) {
      this._producePerCost = override.producePerCost;
    }
    if (override.sustainDamage !== undefined) {
      this._sustainDamage = override.sustainDamage;
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

  getAntiFighterBarrage(): CombatAttrs | undefined {
    return this._antiFighterBarrage;
  }

  getBombardment(): CombatAttrs | undefined {
    return this._bombardment;
  }

  getCost(): number | undefined {
    return this._cost;
  }

  getDisablePlanetaryShield(): boolean {
    return this._disablePlanetaryShield;
  }

  getGroundCombat(): CombatAttrs | undefined {
    return this._groundCombat;
  }

  getName(): string {
    return this._name;
  }

  getPlanetaryShild(): boolean {
    return this._planetaryShield;
  }

  getProducePerCost(): number {
    return this._producePerCost;
  }

  getSpaceCannon(): CombatAttrs | undefined {
    return this._spaceCannon;
  }

  getSpaceCombat(): CombatAttrs | undefined {
    return this._spaceCombat;
  }

  getSustainDamage(): boolean {
    return this._sustainDamage;
  }

  getUnit(): UnitType {
    return this._unit;
  }

  getUnitCount(): number {
    return this._unitCount;
  }

  isGround(): boolean {
    return this._isGround;
  }

  isShip(): boolean {
    return this._isShip;
  }

  setAntiFighterBarrage(value: CombatAttrs): this {
    this._antiFighterBarrage = value;
    return this;
  }

  setBombardment(value: CombatAttrs): this {
    this._bombardment = value;
    return this;
  }

  setCost(value: number): this {
    this._cost = value;
    return this;
  }

  setDisablePlanetaryShield(value: boolean): this {
    this._disablePlanetaryShield = value;
    return this;
  }

  setGroundCombat(value: CombatAttrs): this {
    this._groundCombat = value;
    return this;
  }

  setIsGround(value: boolean): this {
    this._isGround = value;
    return this;
  }

  setIsShip(value: boolean): this {
    this._isShip = value;
    return this;
  }

  setPlanetaryShield(value: boolean): this {
    this._planetaryShield = value;
    return this;
  }

  setProducePerCost(value: number): this {
    this._producePerCost = value;
    return this;
  }

  setSpaceCannon(value: CombatAttrs): this {
    this._spaceCannon = value;
    return this;
  }

  setSpaceCombat(value: CombatAttrs): this {
    this._spaceCombat = value;
    return this;
  }

  setSustainDamage(value: boolean): this {
    this._sustainDamage = value;
    return this;
  }
}
