import {
  Card,
  Color,
  GameObject,
  GameWorld,
  globalEvents,
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
  Facing,
  Find,
  HexType,
  NSID,
  ParsedNSID,
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

const __atopCache: Map<string, Atop> = new Map();
globalEvents.onObjectDestroyed.add((obj: GameObject) => {
  const id = obj.getId();
  const atop = __atopCache.get(id);
  if (atop) {
    __atopCache.delete(id);
  }
});
export function __atopCacheGet(obj: GameObject): Atop {
  const id = obj.getId();
  let atop = __atopCache.get(id);
  if (!atop) {
    atop = new Atop(obj);
    __atopCache.set(id, atop);
  }
  return atop;
}

export type CombatRollType =
  | "ambush"
  | "proximaTargeting"
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
  overrideSelfFaction?: Faction; // for unittests
  overrideOpponentFaction?: Faction; // for unittests
};

export type BestUnitWithCombatAttrs = {
  unit: UnitType;
  combatAttrs: CombatAttrs;
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
    let count: number | undefined = this.overrideUnitCountAdj.get(unit);
    if (count !== undefined) {
      return count;
    }
    count = 0;
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
  private readonly _adjHexes: ReadonlySet<HexType>;
  private readonly _modifiers: Array<UnitModifier> = [];

  // Unit modifers may look into and modify unit attributes.
  public readonly system: System | undefined;
  public readonly planet: Planet | undefined;
  public readonly self: CombatRollPerPlayerData;
  public readonly opponent: CombatRollPerPlayerData;

  // Share for unit modifiers.
  public readonly find: Find = new Find();

  static createCooked(params: CombatRollParams): CombatRoll {
    const combatRoll: CombatRoll = new CombatRoll(params);
    combatRoll.applyUnitPlasticAndSetOpponentPlayerSlot();
    combatRoll.applyFactions();
    combatRoll.applyUnitOverrides();
    combatRoll.applyUnitModifiersOrThrow();
    return combatRoll;
  }

  constructor(params: CombatRollParams) {
    this._params = params;

    this.self = new CombatRollPerPlayerData();
    this.self.playerSlot = params.rollingPlayerSlot;

    this.opponent = new CombatRollPerPlayerData();
    this.opponent.playerSlot = -1;
    if (params.rollingPlayerSlot !== params.activatingPlayerSlot) {
      this.opponent.playerSlot = params.activatingPlayerSlot;
    }

    this._adjHexes = new SystemAdjacency().getAdjHexes(
      params.hex,
      this.self.faction
    );

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
  }

  isCommanderUnlocked(cardNsid: string): boolean {
    const owner: number = -1;
    const skipContained: boolean = true;
    const card: Card | undefined = this.find.findCard(
      cardNsid,
      owner,
      skipContained
    );
    if (!card) {
      return true; // missing card is unlocked
    }
    const allowFaceDown: boolean = false;
    return this._cardUtil.isLooseCard(card, allowFaceDown);
  }

  getHex(): HexType {
    return this._params.hex;
  }

  getAdjHexes(): ReadonlySet<HexType> {
    return this._adjHexes;
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
          const allowFaceDown: boolean = true;
          const rejectSnapPointTags: Array<string> = ["discard"];
          useAttrs = this._cardUtil.isLooseCard(
            obj,
            allowFaceDown,
            rejectSnapPointTags
          );
          if (useAttrs) {
            const isFaceUp: boolean = Facing.isFaceUp(obj);
            if (attrs.onlyIfFaceDown && isFaceUp) {
              useAttrs = false; // only apply if face down
            }
            if (!attrs.onlyIfFaceDown && !isFaceUp) {
              useAttrs = false; // only apply if face up
            }
          }
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

    // Neutral ships get the upgraded version.
    if (playerSlot === 19) {
      const unitNsids: Array<string> = [
        "card.technology.unit-upgrade:base/war-sun-2",
        "card.technology.unit-upgrade:base/dreadnought-2",
        "card.technology.unit-upgrade:base/carrier-2",
        "card.technology.unit-upgrade:base/cruiser-2",
        "card.technology.unit-upgrade:base/destroyer-2",
        "card.technology.unit-upgrade:base/fighter-2",
      ];
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

    // Support for placing a modifier on an object to apply it to all players.
    const atopApplyToAll: Array<GameObject> = [];
    const atopApplyToAllNsids: Set<string> = new Set([
      "test:test/atopApplyToAll",
    ]);

    const atopIgnore: Array<GameObject> = [];
    const atopIgnoreNsids: Set<string> = new Set([
      "test:test/atopIgnore",
      "card.breakthrough:thunders-edge/data-skimmer",
    ]);

    // Control tokens on cards take precedence over cards being near players.
    // Find all control tokens early, reuse when asked.
    const controlTokens: Array<GameObject> = [];
    const nekroZs: Array<GameObject> = [];
    const factionSheets: Array<GameObject> = [];
    for (const obj of world.getAllObjects(skipContained)) {
      if (!obj.isValid()) {
        continue;
      }

      const nsid: string = NSID.get(obj);
      if (atopApplyToAllNsids.has(nsid)) {
        atopApplyToAll.push(obj);
      }
      if (atopIgnoreNsids.has(nsid)) {
        atopIgnore.push(obj);
      }
      if (nsid.startsWith("token.control:")) {
        controlTokens.push(obj);
      }
      if (nsid === "token:thunders-edge/nekro.z") {
        nekroZs.push(obj);
      }
      if (nsid.startsWith("sheet.faction:")) {
        factionSheets.push(obj);
      }
    }

    // Create Atop objects.
    const atopIgnoreAtops: Array<Atop> = atopIgnore.map((obj) =>
      __atopCacheGet(obj)
    );
    const atopApplyToAllAtops: Array<Atop> = atopApplyToAll.map((obj) =>
      __atopCacheGet(obj)
    );
    const atopFactionSheetsAtops: Array<Atop> = factionSheets.map((obj) =>
      __atopCacheGet(obj)
    );

    const getControlTokenOwner = (card: GameObject): number => {
      if (!(card instanceof Card)) {
        return -1;
      }

      // Restrict what kinds of cards apply.
      const nsid: string = NSID.get(card);
      if (!nsid.startsWith("card.agenda") && !nsid.startsWith("card.relic")) {
        return -1;
      }

      const atop: Atop | undefined = __atopCacheGet(card); // "new Atop" hung during a build area update
      for (const controlToken of controlTokens) {
        const pos: Vector = controlToken.getPosition();
        if (atop.isAtop(pos)) {
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

      if (!modifier) {
        return;
      }

      // Only use cards when face-up.
      if (obj instanceof Card) {
        const allowFaceDown: boolean = false;
        const rejectSnapPointTags: Array<string> = ["discard"];
        const useModifier: boolean = this._cardUtil.isLooseCard(
          obj,
          allowFaceDown,
          rejectSnapPointTags
        );
        if (!useModifier) {
          return;
        }
      }

      if (
        modifier.isActiveIdle() &&
        obj &&
        !UnitModifierActiveIdle.isActive(obj)
      ) {
        return;
      }

      // Self-promissory notes are "for sale" and not active.
      if (nsid.startsWith("card.promissory:") && obj && this.self.faction) {
        const pos: Vector = obj.getPosition();
        const closest: number = this.find.closestOwnedCardHolderOwner(pos);
        if (
          closest === selfSlot &&
          this.self.faction.getPromissoryNsids().includes(nsid)
        ) {
          return;
        }
      }

      // If atopIgnore, ignore this modifier.
      if (obj) {
        for (const atop of atopIgnoreAtops) {
          if (atop.isAtop(obj.getPosition())) {
            return;
          }
        }
      }

      // Control token takes precedence for ownership, otherwise closest player.
      if (owningPlayerSlot < 0 && obj) {
        owningPlayerSlot = getControlTokenOwner(obj); // here
        if (owningPlayerSlot < 0) {
          const pos: Vector = obj.getPosition();
          owningPlayerSlot = this.find.closestOwnedCardHolderOwner(pos);
        }
      }

      const isSelf: boolean = owningPlayerSlot === selfSlot;
      const isOpponent: boolean = owningPlayerSlot === opponentSlot;
      let requireAny: boolean = modifier.getOwner() === "any";
      const requireSelf: boolean = modifier.getOwner() === "self";
      const requireOpponent: boolean = modifier.getOwner() === "opponent";

      // If atopApplyToAll, apply to all players.
      if (obj) {
        for (const atop of atopApplyToAllAtops) {
          if (atop.isAtop(obj.getPosition())) {
            requireAny = true;
            break;
          }
        }
      }

      if (
        requireAny ||
        (isSelf && requireSelf) ||
        (isOpponent && requireOpponent)
      ) {
        unitModifiers.push(modifier);
      }
    };

    // Modifiers on table.
    for (const obj of world.getAllObjects(skipContained)) {
      if (!obj.isValid()) {
        continue;
      }
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
        // Add intrinsic units (usually flagship, other unit-based modifiers are on cards).
        for (const nsid of data.faction.getUnitOverrideNsids()) {
          const unitAttrsSchema: UnitAttrsSchemaType | undefined =
            TI4.unitAttrsRegistry.rawByNsid(nsid);
          if (unitAttrsSchema !== undefined) {
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

    // Nekro Zs
    factionSheets.forEach((factionSheet: GameObject, index: number): void => {
      const atop: Atop | undefined = atopFactionSheetsAtops[index];
      if (!atop) {
        return;
      }
      nekroZs.forEach((nekroZ: GameObject): void => {
        const pos: Vector = nekroZ.getPosition();
        if (atop.isAtop(pos)) {
          const nsid: string = NSID.get(factionSheet);
          const parsed: ParsedNSID | undefined = NSID.parse(nsid);
          if (parsed) {
            const firstPart: string | undefined = parsed.nameParts[0];
            if (firstPart) {
              const faction: Faction | undefined =
                TI4.factionRegistry.getByNsidName(firstPart);
              if (faction) {
                faction
                  .getUnitOverrideNsids()
                  .forEach((unitNsid: string): void => {
                    // Add flagship (other unit-based modifiers are on cards).
                    const unitAttrsSchema: UnitAttrsSchemaType | undefined =
                      TI4.unitAttrsRegistry.rawByNsid(unitNsid);
                    if (
                      unitAttrsSchema !== undefined &&
                      unitAttrsSchema.unit === "flagship" &&
                      this.self.hasUnit("flagship")
                    ) {
                      maybeAddModifier(
                        unitNsid,
                        undefined,
                        this.self.playerSlot
                      );
                    }
                  });
              }
            }
          }
        }
      });
    });

    // Remove duplicates.
    const seen: Set<string> = new Set();
    for (let i = unitModifiers.length - 1; i >= 0; i--) {
      const unitModifier: UnitModifier | undefined = unitModifiers[i];
      if (unitModifier) {
        const key: string = unitModifier.getName();
        if (seen.has(key)) {
          unitModifiers.splice(i, 1);
        } else {
          seen.add(key);
        }
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
        case "ambush":
          combatAttrs = unitAttrs.getSpaceCombat();
          break;
        case "proximaTargeting":
          combatAttrs = unitAttrs.getBombardment();
          break;
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
    // (Look only at units in same "area", space or ground.)
    if (this.opponent.playerSlot === -1) {
      let relevant: Array<UnitPlastic> = unitPlastics.filter((unitPlastic) => {
        const pos: Vector = unitPlastic.getPos();
        const hex: HexType = TI4.hex.fromPosition(pos);
        return hex === this._params.hex;
      });
      if (this._params.planetName) {
        relevant = relevant.filter((unitPlastic) => {
          const planet: Planet | undefined = unitPlastic.getPlanetClosest();
          return (
            isGroundSet.has(unitPlastic.getUnit()) &&
            planet &&
            planet.getName() === this._params.planetName
          );
        });
      } else {
        relevant = relevant.filter((unitPlastic) => {
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

      // Coexist lets multiple players have units on the same planet.
      // In that case, target the player that actually owns the planet.
      if (candidates.size > 1 && this.getPlanetName() !== undefined) {
        const system: System | undefined = this.system;
        if (system) {
          system.getPlanets().forEach((planet: Planet): void => {
            if (planet.getName() === this.getPlanetName()) {
              const planetCardNsid: string = planet.getPlanetCardNsid();
              const owningPlayerSlot: number = -1;
              const skipContained: boolean = true;
              const planetCard: Card | undefined = this.find.findCard(
                planetCardNsid,
                owningPlayerSlot,
                skipContained
              );
              if (planetCard) {
                const owner: number = this.find.closestOwnedCardHolderOwner(
                  planetCard.getPosition()
                );
                if (candidates.has(owner)) {
                  this.opponent.playerSlot = owner;
                }
              }
            }
          });
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
    // Get actual factions.
    const playerSlotToFaction: Map<number, Faction> =
      TI4.factionRegistry.getPlayerSlotToFaction();
    this.self.faction = playerSlotToFaction.get(this.self.playerSlot);
    this.opponent.faction = playerSlotToFaction.get(this.opponent.playerSlot);

    // Let params override (for testing).
    if (this._params.overrideSelfFaction) {
      this.self.faction = this._params.overrideSelfFaction;
    }
    if (this._params.overrideOpponentFaction) {
      this.opponent.faction = this._params.overrideOpponentFaction;
    }
    return this;
  }

  public applyUnitOverrides(): this {
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
    // XXX TEMPORARY HAMMER HACK: SOMETHING CAN HANG.
    //if (this.getRollType() === "production") {
    //return this;
    //}

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
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

  /**
   * Get the combat attrs for the current roll type.
   *
   * @returns
   */
  public getUnitCombatAttrs(unit: UnitType): CombatAttrs | undefined {
    const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
      this._getUnitToCombatAttrs();
    return unitToCombatAttrs.get(unit);
  }

  public bestHitUnitWithCombatAttrs(): BestUnitWithCombatAttrs | undefined {
    const unitToCombatAttrs: Map<UnitType, CombatAttrs> =
      this._getUnitToCombatAttrs(); // the current roll type
    let bestUnit: UnitType | undefined = undefined;
    let bestCombatAttrs: CombatAttrs | undefined = undefined;
    let bestHit: number = Number.MAX_SAFE_INTEGER;
    for (const [unit, combatAttrs] of unitToCombatAttrs.entries()) {
      let has: boolean = this.self.hasUnit(unit);

      // Look adjacent if range.
      if (!has && combatAttrs.getRange() > 0) {
        has = this.self.hasUnitAdj(unit);
      }

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
        if (combatAttrs.getRange() > 0 && !requirePlanet) {
          count += adjCount;
        }

        // Account for multi-dice units.
        count *= combatAttrs.getDice();

        // Account for bonus dice (e.g. plasma scoring).
        // ONLY add if count exists.
        if (count > 0) {
          count += combatAttrs.getExtraDice();
        }

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

  public getPlanetName(): string | undefined {
    return this._params.planetName;
  }

  public roll(player: Player, position: Vector): void {
    const doFakeRoll: boolean =
      this._params.rollingPlayerSlot === 19 ||
      GameWorld.getExecutionReason() === "unittest";

    const callback = (
      diceResults: Array<DiceResult>,
      _player: Player
    ): void => {
      TI4.events.onCombatResult.trigger(this, diceResults);

      if (this.opponent.playerSlot === 19) {
        // Opponent is anonymous units, roll for them.
        const anonRoll: CombatRoll = CombatRoll.createCooked({
          rollType: this._params.rollType,
          hex: this._params.hex,
          activatingPlayerSlot: this._params.activatingPlayerSlot,
          rollingPlayerSlot: 19,
          planetName: this._params.planetName,
        });
        anonRoll.roll(player, position);
      }
    };
    const diceParams: Array<DiceParams> = this.createDiceParamsArray();
    const diceGroupParams: DiceGroupParams = {
      diceParams,
      player,
      position,
      callback,
      doFakeRoll,
    };
    DiceGroup.roll(diceGroupParams);
  }
}
