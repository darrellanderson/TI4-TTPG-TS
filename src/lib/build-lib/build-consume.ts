import { GameObject } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { Planet } from "../system-lib/planet/planet";

import { MirrorComputing } from "../unit-lib/data/unit-modifiers/base/mirror-computing";
import { SarweenTools } from "../unit-lib/data/unit-modifiers/base/sarween-tools";
import { WarMachine } from "../unit-lib/data/unit-modifiers/codex-ordinian/war-machine";
import { XxekirGrom } from "../unit-lib/data/unit-modifiers/codex-vigil/xxekir-grom";
import { Faction } from "../faction-lib/faction/faction";
import { ArchonsGift } from "../unit-lib/data/unit-modifiers/thunders-edge/archons-gift";

export type BuildConsumeType = "tradegood" | "planet";

export type BuildConsumeEntry = {
  obj: GameObject;
  type: BuildConsumeType;
  name: string;
  res: number;
  inf: number;
};

export class BuildConsume {
  private readonly _entries: Array<BuildConsumeEntry> = [];
  private readonly _unitModifierNames: Array<string>;

  constructor(objs: Array<GameObject>, unitModifierNames: Array<string>) {
    this._unitModifierNames = unitModifierNames;

    for (const obj of objs) {
      const nsid: string = NSID.get(obj);
      let type: BuildConsumeType | undefined = undefined;
      let res: number = 0;
      let inf: number = 0;
      let name: string = "tradegood";
      if (nsid === "token:base/tradegood-commodity-1") {
        type = "tradegood";
        res = 1;
        inf = 1;
        if (unitModifierNames.includes(MirrorComputing.name)) {
          res *= 2;
          inf *= 2;
        }
      } else if (nsid === "token:base/tradegood-commodity-3") {
        type = "tradegood";
        res = 3;
        inf = 3;
        if (unitModifierNames.includes(MirrorComputing.name)) {
          res *= 2;
          inf *= 2;
        }
      } else if (nsid.startsWith("card.planet:")) {
        const planet: Planet | undefined =
          TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
        if (planet) {
          type = "planet";
          name = planet.getName();
          res = planet.getResources();
          inf = planet.getInfluence();
          if (unitModifierNames.includes(XxekirGrom.name)) {
            res += planet.getInfluence();
            inf += planet.getResources();
          }
          if (unitModifierNames.includes(ArchonsGift.name)) {
            res = Math.max(planet.getResources(), planet.getInfluence());
            inf = res;
          }
        }
      } else if (nsid.startsWith("card.deepwrought-ocean:")) {
        res = 1;
        inf = 1;
      }

      if (type) {
        this._entries.push({
          obj: obj,
          type,
          name,
          res,
          inf,
        });
      }
    }
  }

  getEntries(): Array<BuildConsumeEntry> {
    return this._entries;
  }

  getTradegoodValue(): number {
    return this._entries
      .filter((entry) => entry.type === "tradegood")
      .reduce((acc, entry) => acc + entry.res, 0);
  }

  getPlanetRes(): number {
    return this._entries
      .filter((entry) => entry.type === "planet")
      .reduce((acc, entry) => acc + entry.res, 0);
  }

  getPlanetInf(): number {
    return this._entries
      .filter((entry) => entry.type === "planet")
      .reduce((acc, entry) => acc + entry.inf, 0);
  }

  getTotalRes(): number {
    return this.getTradegoodValue() + this.getPlanetRes();
  }

  getTotalResWithModifiers(): string {
    let total: string = this.getTotalRes().toString();
    if (this._unitModifierNames.includes(SarweenTools.name)) {
      total += "+ST";
    }
    if (this._unitModifierNames.includes(WarMachine.name)) {
      total += "+WM";
    }
    return total;
  }

  getTotalInf(): number {
    return this.getTradegoodValue() + this.getPlanetInf();
  }

  reportRes(): string {
    const result: Array<string> = [];

    const tradegoods: number = this.getTradegoodValue();
    if (tradegoods > 0) {
      result.push(`tradegoods (${tradegoods})`);
    }

    for (const entry of this._entries) {
      if (entry.type === "planet") {
        result.push(`${entry.name} (${entry.res})`);
      }
    }

    const total: string = this.getTotalResWithModifiers();
    return `consuming $${total}: ${result.join(", ")}`;
  }

  reportInf(): string {
    const result: Array<string> = [];

    const tradegoods: number = this.getTradegoodValue();
    if (tradegoods > 0) {
      result.push(`tradegoods (${tradegoods})`);
    }

    for (const entry of this._entries) {
      if (entry.type === "planet") {
        result.push(`${entry.name} (${entry.inf})`);
      }
    }

    const total: string = this.getTotalInf().toString();
    return `consuming $${total}: ${result.join(", ")}`;
  }

  _getPlayerSlotWithFactionUnit(unit: string): number {
    let bastionPlayerSlot: number = -1;
    TI4.factionRegistry
      .getPlayerSlotToFaction()
      .forEach((faction: Faction, playerSlot: number): void => {
        if (faction.getUnitOverrideNsids().includes(unit)) {
          bastionPlayerSlot = playerSlot;
        }
      });
    return bastionPlayerSlot;
  }
}
