import { Color } from "@tabletop-playground/api";
import { ParseColor } from "ttpg-darrell";
import { UnitAttrsSchemaType, UnitType } from "../schema/unit-attrs-schema";
import { CombatAttrs } from "./combat-attrs";

const _parseColor = new ParseColor();

/**
 * Unit attributes, e.g. cost, combat stats.
 *
 * Unlike systems, make unit attributes mutable because unit modifiers
 * can get very compliated; provide them simpler access to attributes.
 * This does mean need to regenerate unit attributes for each instance.
 */
export class UnitAttrs {
  private readonly _unit: UnitType;
  private readonly _componentCount: number; // component count, e.g. fighters = 10

  private _name: string;
  private _cost: number | undefined;
  private _producePerCost: number; // e.g. 2 for fighters
  private _diceColor: Color | undefined;

  private _isShip: boolean;
  private _isGround: boolean;

  private _hasSustainDamage: boolean;
  private _hasPlanetaryShield: boolean;
  private _disableBombardment: boolean;
  private _disablePlanetaryShield: boolean;
  private _disableSpaceCannonOffsense: boolean;

  private _antiFighterBarrage: CombatAttrs | undefined;
  private _bombardment: CombatAttrs | undefined;
  private _spaceCannon: CombatAttrs | undefined;
  private _spaceCombat: CombatAttrs | undefined;
  private _groundCombat: CombatAttrs | undefined;

  public static schemaToNsid(
    source: string,
    schema: UnitAttrsSchemaType
  ): string {
    return `card.technology.unit-upgrade:${source}/${schema.nsidName}`;
  }

  public static sortByOverrideOrder(
    attrs: Array<UnitAttrsSchemaType>
  ): Array<UnitAttrsSchemaType> {
    return attrs.sort((a, b) => {
      const aStr: string = a.nsidName ?? "";
      const bStr: string = b.nsidName ?? "";
      return aStr.localeCompare(bStr);
    });
  }

  constructor(params: UnitAttrsSchemaType) {
    this._name = params.name;
    this._unit = params.unit;
    this._componentCount = params.componentCount ?? 0;
    this._diceColor = _parseColor.parseColor(params.diceColor ?? "");

    this._cost = params.cost;
    this._producePerCost = params.producePerCost ?? 1;

    this._isShip = params.isShip ?? false;
    this._isGround = params.isGround ?? false;
    this._hasSustainDamage = params.hasSustainDamage ?? false;
    this._hasPlanetaryShield = params.hasPlanetaryShield ?? false;
    this._disableBombardment = params.disableBombardment ?? false;
    this._disablePlanetaryShield = params.disablePlanetaryShield ?? false;
    this._disableSpaceCannonOffsense =
      params.disableSpaceCannonOffense ?? false;

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
    if (override.disableBombardment) {
      this._disableBombardment = true;
    }
    if (override.disablePlanetaryShield) {
      this._disablePlanetaryShield = true;
    }
    if (override.disableSpaceCannonOffense) {
      this._disableSpaceCannonOffsense = true;
    }
    if (override.hasPlanetaryShield) {
      this._hasPlanetaryShield = true;
    }
    if (override.hasSustainDamage) {
      this._hasSustainDamage = override.hasSustainDamage;
    }
    if (override.isGround) {
      this._isGround = true;
    }
    if (override.isShip) {
      this._isShip = true;
    }
    this._name = override.name;
    if (override.producePerCost) {
      this._producePerCost = override.producePerCost;
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

  getComponentCount(): number {
    return this._componentCount;
  }

  getCost(): number | undefined {
    return this._cost;
  }

  getDiceColor(): Color {
    return this._diceColor ?? new Color(0, 0, 0);
  }

  getDisableBombardment(): boolean {
    return this._disableBombardment;
  }

  getDisablePlanetaryShield(): boolean {
    return this._disablePlanetaryShield;
  }

  getDisableSpaceCannonOffense(): boolean {
    return this._disableSpaceCannonOffsense;
  }

  getGroundCombat(): CombatAttrs | undefined {
    return this._groundCombat;
  }

  getName(): string {
    return this._name;
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

  getUnit(): UnitType {
    return this._unit;
  }

  hasPlanetaryShild(): boolean {
    return this._hasPlanetaryShield;
  }

  hasSustainDamage(): boolean {
    return this._hasSustainDamage;
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

  setDisableBombardment(value: boolean): this {
    this._disableBombardment = value;
    return this;
  }

  setDisablePlanetaryShield(value: boolean): this {
    this._disablePlanetaryShield = value;
    return this;
  }

  setDisableSpaceCannonOffense(value: boolean): this {
    this._disableSpaceCannonOffsense = value;
    return this;
  }

  setGroundCombat(value: CombatAttrs): this {
    this._groundCombat = value;
    return this;
  }

  setHasPlanetaryShield(value: boolean): this {
    this._hasPlanetaryShield = value;
    return this;
  }

  setHasSustainDamage(value: boolean): this {
    this._hasSustainDamage = value;
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
}
