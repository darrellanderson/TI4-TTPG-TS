import { CombatRoll, CombatRollPerPlayerData, UnitAttrs } from "../lib";
import { Battle, BattleInstance, Participant } from "./core/battle-types";
import { BattleEffect } from "./core/battleeffect/battleEffects";
import { setupBattle } from "./core/battleSetup";
import { Faction, Place } from "./core/enums";
import { UnitType } from "./core/unit";
import { PartialRecord } from "./util/util-types";

export type TI4CalcBridgeParams = {
  isSpace: boolean;
};

/**
 * Marshall TI4 TTPG data into ti4calc battle format.
 */
export class TI4CalcBattleInstanceBuilder {
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
    perPlayerData: CombatRollPerPlayerData
  ): Record<string, number | undefined> {
    return {};
  }

  _generateParticipant(
    side: "attacker" | "defender",
    perPlayerData: CombatRollPerPlayerData
  ): Participant {
    return {
      side: side,
      faction: this._getFaction(perPlayerData),
      units: this._getUnits(perPlayerData),
      unitUpgrades: this._getUnitUpgrades(perPlayerData),
      damagedUnits: {},
      battleEffects: this._getBattleEffects(perPlayerData),
      riskDirectHit: false,
    };
  }

  /**
   * Generate a BattleInstance from a combat roll and planet context.
   * Separate space and each planet into different battles.
   *
   * @param combatRoll
   * @param planetNameOrUndefinedForSpace
   */
  generate(
    combatRoll: CombatRoll,
    planetNameOrUndefinedForSpace: string | undefined
  ): BattleInstance {
    const place: Place = planetNameOrUndefinedForSpace
      ? Place.ground
      : Place.space;

    const attacker: Participant = this._generateParticipant(
      "attacker",
      combatRoll.self
    );
    const defender: Participant = this._generateParticipant(
      "defender",
      combatRoll.opponent
    );

    const battle: Battle = {
      place: place,
      attacker: attacker,
      defender: defender,
    };
    return setupBattle(battle);
  }
}
