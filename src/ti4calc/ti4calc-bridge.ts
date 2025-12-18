import _cloneDeep from "lodash/cloneDeep";
import {
  CombatRoll,
  CombatRollPerPlayerData,
  Planet,
  System,
  UnitAttrs,
} from "../lib";
import {
  Battle,
  BattleInstance,
  BattleWinner,
  Participant,
} from "./core/battle-types";
import { setupBattle, startBattle } from "./core/battleSetup";
import { Faction, Place } from "./core/enums";
import { UnitType } from "./core/unit";
import { PartialRecord } from "./util/util-types";

const BATTLE_COUNT_TARGET = 20000;
const SIMULATION_MSECS = 8; // 16 msecs for 60 FPS, leave time for engine

class TI4CalcBridgeBattleSimulation {
  private readonly _planetNameOrSpace: string | undefined;
  private readonly _battleInstance: BattleInstance;
  _battleCount: number = 0;
  _attacker: number = 0;
  _defender: number = 0;
  _draw: number = 0;

  constructor(
    planetNameOrSpace: string | undefined,
    battleInstance: BattleInstance
  ) {
    this._planetNameOrSpace = planetNameOrSpace;
    this._battleInstance = battleInstance;
  }

  isFinished(): boolean {
    return this._battleCount >= BATTLE_COUNT_TARGET;
  }

  _simulateOneBattle(): void {
    const tmp = _cloneDeep(this._battleInstance);
    const result = startBattle(tmp);
    this._battleCount += 1;
    switch (result.winner) {
      case BattleWinner.attacker:
        this._attacker += 1;
        break;
      case BattleWinner.draw:
        this._draw += 1;
        break;
      case BattleWinner.defender:
        this._defender += 1;
        break;
    }
  }

  simulatePartial(): void {
    const now: number = Date.now();
    const endTime: number = now + SIMULATION_MSECS;
    while (Date.now() < endTime && this._battleCount < BATTLE_COUNT_TARGET) {
      this._simulateOneBattle();
    }
  }
}

/**
 * Marshall TI4 TTPG data into ti4calc battle format.
 * https://github.com/pgsandstrom/ti4calc
 *
 * Create BattleInstance entities, use webworker's getPartialReport to simulate
 * battles collecting statistics.
 */
export class TI4CalcBridge {
  private readonly _simulations: Array<TI4CalcBridgeBattleSimulation> = [];
  private _simulationCount: number = 0;

  constructor(system: System) {
    // Space battle.
    const spaceBattleInstance: BattleInstance = this._generateForPlanetOrSpace(
      system,
      undefined
    );
    this._simulations.push(
      new TI4CalcBridgeBattleSimulation(undefined, spaceBattleInstance)
    );

    // Planet battles.
    const planets: Array<Planet> = system.getPlanets();
    for (const planet of planets) {
      const planetBattleInstance: BattleInstance =
        this._generateForPlanetOrSpace(system, planet);
      this._simulations.push(
        new TI4CalcBridgeBattleSimulation(
          planet.getName(),
          planetBattleInstance
        )
      );
    }
  }

  advanceSimulations(): boolean {
    // Only advance one simulation at a time to avoid lag.
    const ongoing: Array<TI4CalcBridgeBattleSimulation> =
      this._simulations.filter((sim) => !sim.isFinished());
    if (ongoing.length === 0) {
      return false;
    }

    const simulation: TI4CalcBridgeBattleSimulation | undefined =
      ongoing[this._simulationCount % ongoing.length];
    this._simulationCount++; // ragged when a sim finishes but fine
    if (simulation) {
      simulation.simulatePartial();
    }
    return true;
  }

  getSimulationBattleCount(): number {
    let total: number = 0;
    for (const simulation of this._simulations) {
      total += simulation._battleCount;
    }
    return total;
  }

  getSimulationResult(): string {
    return this._simulations
      .map((simulation): string => {
        return `${simulation._attacker},${simulation._draw},${simulation._defender}`;
      })
      .join("\n");
  }

  _getFaction(perPlayerData: CombatRollPerPlayerData): Faction {
    switch (perPlayerData.faction?.getAbbr()) {
      case "Arborec":
        return Faction.arborec;
      case "Creuss":
        return Faction.creuss;
      case "Hacan":
        return Faction.hacan;
      case "Jol-Nar":
        return Faction.jol_nar;
      case "L1Z1X":
        return Faction.l1z1x;
      case "Letnev":
        return Faction.barony_of_letnev;
      case "Mentak":
        return Faction.mentak;
      case "Muaat":
        return Faction.muaat;
      case "Naalu":
        return Faction.naalu;
      case "Nekro":
        return Faction.nekro;
      case "N'orr":
        return Faction.sardakk_norr;
      case "Saar":
        return Faction.clan_of_saar;
      case "Sol":
        return Faction.sol;
      case "Winnu":
        return Faction.winnu;
      case "Xxcha":
        return Faction.xxcha;
      case "Yin":
        return Faction.yin;
      case "Yssaril":
        return Faction.yssaril;
      case "Argent":
        return Faction.argent_flight;
      case "Empyrean":
        return Faction.empyrean;
      case "Mahact":
        return Faction.mahact;
      case "Naaz-Rokha":
        return Faction.naaz_rokha;
      case "Nomad":
        return Faction.nomad;
      case "Ul":
        return Faction.titans_of_ul;
      case "Vuil'raith":
        return Faction.vuil_raith;
      case "Keleres (Argent)":
        return Faction.keleres;
      case "Keleres (Mentak)":
        return Faction.keleres;
      case "Keleres (Xxcha)":
        return Faction.keleres;
      //case "Bastion":
      //  return Faction.bastion;
      //case "Ral-Nel":
      //  return Faction.x;
      case "Rebellion":
        return Faction.crimson_rebellion;
      case "Deepwrought":
        return Faction.deepwrought;
      //case "Firmament":
      //  return Faction.x;
      //case "Obsidian":
      //  return Faction.x;
    }

    return Faction.arborec; // not all factions mapped
  }

  _getUnits(perPlayerData: CombatRollPerPlayerData): {
    [key in UnitType]: number;
  } {
    const units: { [key in UnitType]: number } = {
      [UnitType.flagship]: perPlayerData.getCount("flagship"),
      [UnitType.cruiser]: perPlayerData.getCount("cruiser"),
      [UnitType.carrier]: perPlayerData.getCount("carrier"),
      [UnitType.destroyer]: perPlayerData.getCount("destroyer"),
      [UnitType.dreadnought]: perPlayerData.getCount("dreadnought"),
      [UnitType.fighter]: perPlayerData.getCount("fighter"),
      [UnitType.infantry]: perPlayerData.getCount("infantry"),
      [UnitType.mech]: perPlayerData.getCount("mech"),
      [UnitType.pds]: perPlayerData.getCount("pds"),
      [UnitType.warsun]: perPlayerData.getCount("war-sun"),
      [UnitType.other]: 0,
      [UnitType.nonunit]: 0,
    };
    return units;
  }

  _getUnitUpgrades(
    perPlayerData: CombatRollPerPlayerData
  ): PartialRecord<string, boolean> {
    const unitUpgrades: PartialRecord<string, boolean> = {};

    perPlayerData.unitAttrsSet
      .getAll()
      .forEach((unitAttrs: UnitAttrs): void => {
        if (unitAttrs.getName().endsWith("II")) {
          unitUpgrades[unitAttrs.getUnit().replace("-", "")] = true;
        }
      });

    return unitUpgrades;
  }

  _getBattleEffects(
    side: "attacker" | "defender",

    combatRoll: CombatRoll
  ): Record<string, number | undefined> {
    const battleEffects: Record<string, number | undefined> = {};
    const isSelf: boolean = side === "attacker";

    // 'modifierName' is the TTPG name, map to battle effect names (usually same).
    combatRoll.getUnitModifierNames().forEach((modifierName: string) => {
      // ACTION CARD
      if (modifierName === "Bunker" && !isSelf) {
        battleEffects["Bunker"] = 1;
      } else if (modifierName === "Disable" && !isSelf) {
        battleEffects["Disable"] = 1;
      } else if (modifierName === "Experimental Battlestation" && isSelf) {
        battleEffects["Experimental Battlestation"] = 1;
      } else if (modifierName === "Fighter Prototype" && isSelf) {
        battleEffects["Fighter Prototype"] = 1;
      } else if (modifierName === "Fire Team" && isSelf) {
        battleEffects["Fire Team"] = 1;
      } else if (modifierName === "Morale Boost" && isSelf) {
        battleEffects["Morale Boost"] = 1;
      } else if (modifierName === "Blitz" && isSelf) {
        battleEffects["Blitz"] = 1;
      }

      // AGENDA
      if (modifierName === "Publicize Weapon Schematics") {
        battleEffects["Publicize Weapon Schematics"] = 1;
      } else if (modifierName === "Prophecy of Ixth" && isSelf) {
        battleEffects["Prophecy of Ixth"] = 1;
      } else if (modifierName === "Articles of War") {
        battleEffects["Articles of War"] = 1;
      } else if (modifierName === "Conventions of War") {
        battleEffects["Conventions of War"] = 1;
      }

      // SYSTEM
      if (modifierName === "Entropic Scar") {
        battleEffects["Entropic Scar"] = 1;
      } else if (modifierName === "Nebula Defense" && !isSelf) {
        battleEffects["Defending in nebula"] = 1;
      }

      // RELIC
      if (modifierName === "Lightrail Ordnance" && isSelf) {
        battleEffects["Lightrail Ordnance"] = 1;
      } else if (modifierName === "Metali Void Armaments" && isSelf) {
        battleEffects["Metali Void Armaments"] = 1;
      }

      // TECHNOLOGY
      if (modifierName === "Plasma Scoring" && isSelf) {
        battleEffects["Plasma Scoring"] = 1;
      } else if (modifierName === "X89 Bacterial Weapon" && isSelf) {
        battleEffects["X-89 Bacterial Weapon"] = 1;
      } else if (modifierName === "Antimass Deflectors" && isSelf) {
        battleEffects["Antimass Deflectors"] = 1;
      }
    });

    return battleEffects;
  }

  _generateParticipant(
    side: "attacker" | "defender",
    combatRoll: CombatRoll
  ): Participant {
    const perPlayerData: CombatRollPerPlayerData =
      side === "attacker" ? combatRoll.self : combatRoll.opponent;

    return {
      side: side,
      faction: this._getFaction(perPlayerData),
      units: this._getUnits(perPlayerData),
      unitUpgrades: this._getUnitUpgrades(perPlayerData),
      damagedUnits: {},
      battleEffects: this._getBattleEffects(side, combatRoll),
      riskDirectHit: false,
    };
  }

  /**
   * Generate a BattleInstance for a planet or space context.
   * Separate space and each planet into different battles.
   *
   * @param combatRoll
   * @param planetNameOrUndefinedForSpace
   */
  _generateForPlanetOrSpace(
    system: System,
    planet: Planet | undefined
  ): BattleInstance {
    const place: Place = planet ? Place.ground : Place.space;

    const combatRoll: CombatRoll = CombatRoll.createCooked({
      rollType: planet ? "groundCombat" : "spaceCombat",
      planetName: planet?.getName() ?? undefined,
      hex: TI4.hex.fromPosition(system.getObj().getPosition()),
      activatingPlayerSlot: TI4.turnOrder.getCurrentTurn(),
      rollingPlayerSlot: TI4.turnOrder.getCurrentTurn(),
    });

    const attacker: Participant = this._generateParticipant(
      "attacker",
      combatRoll
    );
    const defender: Participant = this._generateParticipant(
      "defender",
      combatRoll
    );

    const battle: Battle = {
      place: place,
      attacker: attacker,
      defender: defender,
    };
    return setupBattle(battle);
  }
}
