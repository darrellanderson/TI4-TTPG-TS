import {
  Card,
  Color,
  GameObject,
  GameWorld,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import {
  Atop,
  CardUtil,
  DiceGroup,
  DiceGroupParams,
  DiceParams,
  DiceResult,
  Find,
  HexType,
  NSID,
} from "ttpg-darrell";

import { CombatAttrs } from "../../unit-lib/unit-attrs/combat-attrs";
import { Faction } from "../../faction-lib/faction/faction";
import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";
import { SystemAdjacency } from "../../system-lib/system-adjacency/system-adjacency";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import {
  UnitAttrsSchemaType,
  UnitType,
} from "../../unit-lib/schema/unit-attrs-schema";
import { UnitAttrsSet } from "../../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitModifier } from "../../unit-lib/unit-modifier/unit-modifier";
import { UnitModifierActiveIdle } from "../../unit-lib/unit-modifier/unit-modifier-active-idle";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";

export type CombatRollType =
  | "antiFighterBarrage"
  | "bombardment"
  | "spaceCannonOffense"
  | "spaceCannonDefense"
  | "spaceCombat"
  | "groundCombat"
  | "production";

export type CombatRollParams = {
  rollType: CombatRollType;
  hex: HexType;
  planetName?: string; // for planet-based rolls
  activatingPlayerSlot: number;
  rollingPlayerSlot: number;
  overrideSelfFaction?: Faction;
  overrideOpponentFaction?: Faction;
};

export type BestUnitWithCombatAttrs = {
  unit: UnitType;
  combatAttrs: CombatAttrs;
};

export type _UnitRollsSummary = {
  hits: number;
  diceWithHitsCritsAndRerolls: Array<string>;
};

export class CombatRollPerPlayerData {
  public faction: Faction | undefined;
  public playerSlot: number = -1;
  public readonly unitAttrsSet: UnitAttrsSet =
    TI4.unitAttrsRegistry.defaultUnitAttrsSet();
  public readonly unitPlasticHex: Array<UnitPlastic> = [];
  public readonly unitPlasticAdj: Array<UnitPlastic> = [];
  public readonly overrideUnitCountHex: Map<UnitType, number> = new Map();
  public readonly overrideUnitCountAdj: Map<UnitType, number> = new Map();

  /**
   * Try to add a synthetic unit to the player's unit set.
   * Only works if unit type does not already exist.
   *
   * The schema.unit "UnitType" restriction may need to be
   * violated with a "string as UnitType" cast.
   *
   * @param schema
   * @param count
   * @returns
   */
  addSyntheticUnit(schema: UnitAttrsSchemaType, count: number): boolean {
    if (!this.unitAttrsSet.addSyntheticUnit(schema)) {
      return false;
    }
    this.overrideUnitCountHex.set(schema.unit, count);
    return true;
  }

  getCount(unit: UnitType): number {
    let count: number | undefined = this.overrideUnitCountHex.get(unit);
    if (count !== undefined) {
      return count;
    }
    count = 0;
    for (const unitPlastic of this.unitPlasticHex) {
      if (unitPlastic.getUnit() === unit) {
        count += unitPlastic.getCount();
      }
    }
    return count;
  }

  getCountAdj(unit: UnitType): number {
    let count: number = 0;
    for (const unitPlastic of this.unitPlasticAdj) {
      if (unitPlastic.getUnit() === unit) {
        count += unitPlastic.getCount();
      }
    }
    return count;
  }

  hasUnit(unit: UnitType): boolean {
    return this.getCount(unit) > 0;
  }

  hasUnitAdj(unit: UnitType): boolean {
    return this.getCountAdj(unit) > 0;
  }
}

export class CombatRoll {
  private readonly _cardUtil: CardUtil = new CardUtil();

  private readonly _params: CombatRollParams;
  private readonly _adjHexes: Set<HexType>;
  private readonly _modifiers: Array<UnitModifier> = [];

  // Unit modifers may look into and modify unit attributes.
  public readonly system: System | undefined;
  public readonly planet: Planet | undefined;
  public readonly self: CombatRollPerPlayerData;
  public readonly opponent: CombatRollPerPlayerData;

  // Share for unit modifiers.
  public readonly find: Find = new Find();

  static createCooked(params: CombatRollParams): CombatRoll {
    return new CombatRoll(params)
      .applyUnitPlasticAndSetOpponentPlayerSlot() // assign opponent player slot early!
      .applyFactions() // assign before overrides, to allow for faction units
      .applyUnitOverries()
      .applyUnitModifiersOrThrow(); // always do this last, reads state others set
  }

  constructor(params: CombatRollParams) {
    this._params = params;
    this._adjHexes = new SystemAdjacency().getAdjHexes(params.hex);

    const pos: Vector = TI4.hex.toPosition(params.hex);
    this.system = TI4.systemRegistry.getByPosition(pos);
    if (this.system) {
      for (const planet of this.system.getPlanets()) {
        if (planet.getName() === params.planetName) {
          this.planet = planet;
          break;
        }
      }
    }

    this.self = new CombatRollPerPlayerData();
    this.self.playerSlot = params.rollingPlayerSlot;

    this.opponent = new CombatRollPerPlayerData();
    this.opponent.playerSlot = -1;
    if (params.rollingPlayerSlot !== params.activatingPlayerSlot) {
      this.opponent.playerSlot = params.activatingPlayerSlot;
    }
  }

  _findUnitPlastics(): Array<UnitPlastic> {
    const unitPlastics: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (unitPlastic): boolean => {
        return (
          unitPlastic.getHex() === this._params.hex ||
          this._adjHexes.has(unitPlastic.getHex())
        );
      }
    );
    UnitPlastic.assignOwners(unitPlastics);
    UnitPlastic.assignPlanets(unitPlastics);
    return unitPlastics;
  }

  _findUnitAttrOverrides(playerSlot: number): Array<UnitAttrsSchemaType> {
    // Find unit upgrade cards owned by the player.
    const overrideAttrsArray: Array<UnitAttrsSchemaType> = [];

    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      const attrs: UnitAttrsSchemaType | undefined =
        TI4.unitAttrsRegistry.rawByNsid(nsid);
      if (attrs) {
        let useAttrs: boolean = true;
        if (obj instanceof Card) {
          const allowFaceDown: boolean = false;
          const rejectSnapPointTags: Array<string> = ["discard"];
          useAttrs = this._cardUtil.isLooseCard(
            obj,
            allowFaceDown,
            rejectSnapPointTags
          );
        }
        if (useAttrs) {
          const pos: Vector = obj.getPosition();
          const closest: number = this.find.closestOwnedCardHolderOwner(pos);
          if (closest === playerSlot) {
            overrideAttrsArray.push(attrs);
          }
        }
      }
    }

    // Faction flagship, other base unit overrides.
    let faction: Faction | undefined = undefined;
    if (playerSlot === this.self.playerSlot) {
      faction = this.self.faction;
    } else if (playerSlot === this.opponent.playerSlot) {
      faction = this.opponent.faction;
    }
    if (faction) {
      const unitNsids: Array<string> = [...faction.getUnitOverrideNsids()];
      for (const unitNsid of unitNsids) {
        const attrs: UnitAttrsSchemaType | undefined =
          TI4.unitAttrsRegistry.rawByNsid(unitNsid);
        if (attrs) {
          overrideAttrsArray.push(attrs);
        }
      }
    }

    UnitAttrs.sortByOverrideOrder(overrideAttrsArray);
    return overrideAttrsArray;
  }

  _findUnitModifiers(
    selfSlot: number,
    opponentSlot: number
  ): Array<UnitModifier> {
    const unitModifiers: Array<UnitModifier> = [];
    const skipContained: boolean = true;

    // Control tokens on cards take precedence over cards being near players.
    // Find all control tokens early, reuse when asked.
    const controlTokens: Array<GameObject> = [];
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("token:")) {
        if (nsid.endsWith("/control")) {
          controlTokens.push(obj);
        }
      }
    }
    const getControlTokenOwner = (card: GameObject): number => {
      const atop: Atop = new Atop(card);
      for (const controlToken of controlTokens) {
        if (atop.isAtop(controlToken.getPosition())) {
          return controlToken.getOwningPlayerSlot();
        }
      }
      return -1;
    };

    // Set owningPlayerSlot = -1 to look for control token or closest player.
    // Requires an object be given!
    const maybeAddModifier = (
      nsid: string,
      obj: GameObject | undefined,
      owningPlayerSlot: number
    ): void => {
      const modifier: UnitModifier | undefined =
        TI4.unitModifierRegistry.getByNsid(nsid);
      if (modifier) {
        // Only use cards when face-up.
        let useModifier: boolean = true;
        if (obj instanceof Card) {
          const allowFaceDown: boolean = false;
          const rejectSnapPointTags: Array<string> = ["discard"];
          useModifier = this._cardUtil.isLooseCard(
            obj,
            allowFaceDown,
            rejectSnapPointTags
          );
        }

        if (
          modifier.isActiveIdle() &&
          obj &&
          !UnitModifierActiveIdle.isActive(obj)
        ) {
          useModifier = false;
        }

        // Self-promissory notes are "for sale" and not active.
        if (nsid.startsWith("card.promissory:") && obj && this.self.faction) {
          const pos: Vector = obj.getPosition();
          const closest: number = this.find.closestOwnedCardHolderOwner(pos);
          if (
            closest === selfSlot &&
            this.self.faction.getPromissoryNsids().includes(nsid)
          ) {
            useModifier = false;
          }
        }

        if (useModifier) {
          // Control token takes precedence for ownership, otherwise closest player.
          if (obj) {
            owningPlayerSlot = getControlTokenOwner(obj);
            if (owningPlayerSlot < 0) {
              const pos: Vector = obj.getPosition();
              owningPlayerSlot = this.find.closestOwnedCardHolderOwner(pos);
            }
          }
          const isSelf: boolean = owningPlayerSlot === selfSlot;
          const isOpponent: boolean = owningPlayerSlot === opponentSlot;
          const requireAny: boolean = modifier.getOwner() === "any";
          const requireSelf: boolean = modifier.getOwner() === "self";
          const requireOpponent: boolean = modifier.getOwner() === "opponent";

          if (
            requireAny ||
            (isSelf && requireSelf) ||
            (isOpponent && requireOpponent)
          ) {
            unitModifiers.push(modifier);
          }
        }
      }
    };

    // Modifiers on table.
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      maybeAddModifier(nsid, obj, -1);
    }

    // Faction flagship, abilities.
    const dataArray: Array<CombatRollPerPlayerData> = [
      this.self,
      this.opponent,
    ];
    for (const data of dataArray) {
      if (data.faction) {
        for (const abilityNsid of data.faction.getAbilityNsids()) {
          maybeAddModifier(abilityNsid, undefined, data.playerSlot);
        }
        // Add flagship (other unit-based modifiers are on cards).
        for (const nsid of data.faction.getUnitOverrideNsids()) {
          const unitAttrsSchema: UnitAttrsSchemaType | undefined =
            TI4.unitAttrsRegistry.rawByNsid(nsid);
          if (
            unitAttrsSchema !== undefined &&
            unitAttrsSchema.unit === "flagship" &&
            data.hasUnit("flagship")
          ) {
            maybeAddModifier(nsid, undefined, data.playerSlot);
          }
        }
      }
    }

    // "Always" modifiers.
    for (const modifier of TI4.unitModifierRegistry.getAlways()) {
      if (modifier.applies(this)) {
        unitModifiers.push(modifier);
      }
    }

    UnitModifier.sortByApplyOrder(unitModifiers);
    return unitModifiers;
  }

  _getUnitToCombatAttrs(): Map<UnitType, CombatAttrs> {
    const result: Map<UnitType, CombatAttrs> = new Map();
    const rollType: CombatRollType = this._params.rollType;
    for (const unitAttrs of this.self.unitAttrsSet.getAll()) {
      let combatAttrs: CombatAttrs | undefined = undefined;
      switch (rollType) {
        case "antiFighterBarrage":
          if (!unitAttrs.getDisableAntiFighterBarrage()) {
            combatAttrs = unitAttrs.getAntiFighterBarrage();
          }
          break;
        case "bombardment":
          if (!unitAttrs.getDisableBombardment()) {
            combatAttrs = unitAttrs.getBombardment();
          }
          break;
        case "groundCombat":
          combatAttrs = unitAttrs.getGroundCombat();
          break;
        case "spaceCannonDefense":
          if (!unitAttrs.getDisableSpaceCannonDefense()) {
            combatAttrs = unitAttrs.getSpaceCannon();
          }
          break;
        case "spaceCannonOffense":
          if (!unitAttrs.getDisableSpaceCannonOffense()) {
            combatAttrs = unitAttrs.getSpaceCannon();
          }
          break;
        case "spaceCombat":
          combatAttrs = unitAttrs.getSpaceCombat();
          break;
      }
      if (combatAttrs) {
        result.set(unitAttrs.getUnit(), combatAttrs);
      }
    }
    return result;
  }

  public applyUnitPlasticAndSetOpponentPlayerSlot(): this {
    const unitPlastics: Array<UnitPlastic> = this._findUnitPlastics();

    const isGroundSet: Set<UnitType> = new Set();
    const isShipSet: Set<UnitType> = new Set();
    for (const unitAttrs of this.opponent.unitAttrsSet.getAll()) {
      if (unitAttrs.isGround()) {
        isGroundSet.add(unitAttrs.getUnit());
      }
      if (unitAttrs.isShip()) {
        isShipSet.add(unitAttrs.getUnit());
      }
    }

    // If opponent is not assigned, look for units belonging to another player.
    // (Look only at units in some "area", space or ground.)
    if (this.opponent.playerSlot === -1) {
      let relevant: Array<UnitPlastic> = [];
      if (this._params.planetName) {
        relevant = unitPlastics.filter((unitPlastic) => {
          const planet: Planet | undefined = unitPlastic.getPlanetClosest();
          return (
            isGroundSet.has(unitPlastic.getUnit()) &&
            planet &&
            planet.getName() === this._params.planetName
          );
        });
      } else {
        relevant = unitPlastics.filter((unitPlastic) => {
          return isShipSet.has(unitPlastic.getUnit());
        });
      }
      const candidates: Set<number> = new Set();
      for (const unitPlastic of relevant) {
        const playerSlot: number = unitPlastic.getOwningPlayerSlot();
        if (playerSlot !== -1 && playerSlot !== this.self.playerSlot) {
          candidates.add(playerSlot);
        }
      }
      // If only one other player has relevant units, assign them as opponent.
      // Otherwise either player error with other units there, or some rule
      // allowing for multiple players to have units in the same area.
      // Unclear how to resolve that until rules are known.
      if (candidates.size === 1) {
        const value: number | undefined = candidates.values().next().value;
        if (value !== undefined) {
          this.opponent.playerSlot = value;
        }
      }
    }

    // Fill in all units for each player.
    // Do not prune here, unit modifiers may add attributes.
    for (const unitPlastic of unitPlastics) {
      // Self or opponent?
      const playerSlot: number = unitPlastic.getOwningPlayerSlot();
      let playerData: CombatRollPerPlayerData | undefined = undefined;
      let plasticArray: Array<UnitPlastic> | undefined = undefined;
      if (playerSlot === this.self.playerSlot) {
        playerData = this.self;
      } else if (playerSlot === this.opponent.playerSlot) {
        playerData = this.opponent;
      }
      if (playerData) {
        if (unitPlastic.getHex() === this._params.hex) {
          plasticArray = playerData.unitPlasticHex;
        } else {
          plasticArray = playerData.unitPlasticAdj;
        }
      }
      if (plasticArray) {
        plasticArray.push(unitPlastic);
      }
    }

    return this;
  }

  public applyFactions(): this {
    // TODO XXX
    if (this._params.overrideSelfFaction) {
      this.self.faction = this._params.overrideSelfFaction;
    }
    if (this._params.overrideOpponentFaction) {
      this.opponent.faction = this._params.overrideOpponentFaction;
    }
    return this;
  }

  public applyUnitOverries(): this {
    for (const data of [this.self, this.opponent]) {
      const unitOverrides: Array<UnitAttrsSchemaType> =
        this._findUnitAttrOverrides(data.playerSlot);
      for (const unitOverride of unitOverrides) {
        const unit: UnitType = unitOverride.unit;
        const unitAttrs: UnitAttrs | undefined = data.unitAttrsSet.get(unit);
        if (unitAttrs) {
          unitAttrs.applyOverride(unitOverride);
        }
      }
    }
    return this;
  }

  public applyUnitModifiers(errors: Array<Error>): this {
    const unitModifiers: Array<UnitModifier> = this._findUnitModifiers(
      this.self.playerSlot,
      this.opponent.playerSlot
    );
    for (const modifier of unitModifiers) {
      // Run each modifier in a try/catch block, an error will only suppress
      // one modifier, not the whole set (or the call stack!).
      try {
        if (modifier.applies(this)) {
          this._modifiers.push(modifier);
          modifier.apply(this);
        }
      } catch (e) {
        errors.push(e);
      }
    }
    return this;
  }

  public applyUnitModifiersOrThrow(): this {
    const errors: Array<Error> = [];
    this.applyUnitModifiers(errors);
    if (errors.length > 0) {
      const joined: string = errors.map((e) => e.stack).join("\n");
      throw new Error(joined);
    }
    return this;
  }

  public bestHitUnitWithCombatAttrs(): BestUnitWithCombatAttrs | undefined {
    const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
      this._getUnitToCombatAttrs(); // the current roll type
    let bestUnit: UnitType | undefined = undefined;
    let bestCombatAttrs: CombatAttrs | undefined = undefined;
    let bestHit: number = Number.MAX_SAFE_INTEGER;
    for (const [unit, combatAttrs] of unitToCombatAttrs.entries()) {
      const has: boolean = this.self.hasUnit(unit);
      const hit: number = combatAttrs.getHit();
      if (has && hit < bestHit) {
        bestHit = hit;
        bestUnit = unit;
        bestCombatAttrs = combatAttrs;
      }
    }
    if (bestUnit && bestCombatAttrs) {
      return { unit: bestUnit, combatAttrs: bestCombatAttrs };
    }
    return undefined;
  }

  _pruneToUnitsClosestToPlanet(): this {
    for (let i = this.self.unitPlasticHex.length - 1; i >= 0; i--) {
      const unitPlastic: UnitPlastic | undefined = this.self.unitPlasticHex[i];
      if (unitPlastic) {
        const planet: Planet | undefined = unitPlastic.getPlanetClosest();
        if (planet && planet.getName() !== this._params.planetName) {
          this.self.unitPlasticHex.splice(i, 1);
        }
      }
    }
    for (let i = this.opponent.unitPlasticHex.length - 1; i >= 0; i--) {
      const unitPlastic: UnitPlastic | undefined =
        this.opponent.unitPlasticHex[i];
      if (unitPlastic) {
        const planet: Planet | undefined = unitPlastic.getPlanetClosest();
        if (planet && planet.getName() !== this._params.planetName) {
          this.opponent.unitPlasticHex.splice(i, 1);
        }
      }
    }
    return this;
  }

  _checkCancelBombardment(): boolean {
    // Check if active planetary shield in opponent and no
    // disable planetary shield in self.
    let hasPlanetaryShield: boolean = false;
    for (const unitAttrs of this.opponent.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();
      const hasUnit: boolean = this.opponent.hasUnit(unit);
      if (unitAttrs.hasPlanetaryShild() && hasUnit) {
        hasPlanetaryShield = true;
        break;
      }
    }
    let hasDisablePlanetaryShield: boolean = false;
    for (const unitAttrs of this.self.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();
      const hasUnit: boolean = this.self.hasUnit(unit);
      if (unitAttrs.getDisablePlanetaryShield() && hasUnit) {
        hasDisablePlanetaryShield = true;
        break;
      }
    }
    return hasPlanetaryShield && !hasDisablePlanetaryShield;
  }

  public createDiceParamsArray(): Array<DiceParams> {
    const result: Array<DiceParams> = [];
    const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
      this._getUnitToCombatAttrs();

    // If appropriate, prune to units on planet.
    const requirePlanet: boolean =
      this._params.rollType === "bombardment" ||
      this._params.rollType === "spaceCannonDefense" ||
      this._params.rollType === "groundCombat";
    if (requirePlanet) {
      this._pruneToUnitsClosestToPlanet();
    }

    if (
      this._params.rollType === "bombardment" &&
      this._checkCancelBombardment()
    ) {
      return [];
    }

    for (const unitAttrs of this.self.unitAttrsSet.getAll()) {
      const unit: UnitType = unitAttrs.getUnit();
      const combatAttrs: CombatAttrs | undefined = unitToCombatAttrs.get(unit);
      if (combatAttrs) {
        const hexCount: number = this.self.getCount(unit);
        const adjCount: number = this.self.getCountAdj(unit);
        let count: number = hexCount;
        if (combatAttrs.getRange() > 0) {
          count += adjCount;
        }

        // Account for multi-dice units.
        count *= combatAttrs.getDice();

        // Account for bonus dice (e.g. plasma scoring).
        count += combatAttrs.getExtraDice();

        for (let i = 0; i < count; i++) {
          const params: DiceParams = {
            sides: 10,
            id: unit,
            name: unitAttrs.getName(),
            hit: combatAttrs.getHit(),
            reroll: combatAttrs.getRerollMisses(),
            primaryColor: unitAttrs.getDiceColor(),
            secondaryColor: new Color(1, 1, 1),
          };
          const crit: number | undefined = combatAttrs.getCrit();
          if (crit !== undefined) {
            params.crit = crit;
            params.critCount = combatAttrs.getCritCount();
          }
          result.push(params);
        }
      }
    }
    return result;
  }

  public getActivatingPlayerSlot(): number {
    return this._params.activatingPlayerSlot;
  }

  public getUnitModifierNames(): Array<string> {
    return this._modifiers.map((modifier) => modifier.getName());
  }

  public getUnitModifierNamesWithDescriptions(): Array<string> {
    return this._modifiers.map(
      (modifier) => `${modifier.getName()} (${modifier.getDescription()})`
    );
  }

  public getRollType(): CombatRollType {
    return this._params.rollType;
  }

  public roll(player: Player, position: Vector): void {
    const callback = (
      _diceResults: Array<DiceResult>,
      _player: Player
    ): void => {};
    const diceParams: Array<DiceParams> = this.createDiceParamsArray();
    const diceGroupParams: DiceGroupParams = {
      diceParams,
      player,
      position,
      callback,
      doFakeRoll: GameWorld.getExecutionReason() === "unittest",
    };
    DiceGroup.roll(diceGroupParams);
  }

  _getUnitRollsSummaries(
    diceResults: Array<DiceResult>
  ): Map<UnitType, _UnitRollsSummary> {
    const result: Map<UnitType, _UnitRollsSummary> = new Map();

    for (const diceResult of diceResults) {
      const unit: UnitType = diceResult.diceParams.id as UnitType;
      let unitRollsSummary: _UnitRollsSummary | undefined = result.get(unit);
      if (!unitRollsSummary) {
        unitRollsSummary = {
          hits: 0,
          diceWithHitsCritsAndRerolls: [],
        };
        result.set(unit, unitRollsSummary);
      }

      // Add hits and crits.
      if (diceResult.hit) {
        unitRollsSummary.hits += 1;
      }
      if (diceResult.crit) {
        unitRollsSummary.hits += diceResult.diceParams.critCount ?? 1;
      }

      // Format.
      const formatted: string = DiceGroup.format(diceResult);
      unitRollsSummary.diceWithHitsCritsAndRerolls.push(formatted);
    }

    return result;
  }
}
