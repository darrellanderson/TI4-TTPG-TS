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
  value: number;
};

export class BuildConsume {
  private readonly _entries: Array<BuildConsumeEntry> = [];
  private readonly _unitModifierNames: Array<string>;

  constructor(objs: Array<GameObject>, unitModifierNames: Array<string>) {
    this._unitModifierNames = unitModifierNames;

    for (const obj of objs) {
      const nsid: string = NSID.get(obj);
      let type: BuildConsumeType | undefined = undefined;
      let value: number = 0;
      let name: string = "tradegood";
      if (nsid === "token:base/tradegood-commodity-1") {
        type = "tradegood";
        value = 1;
        if (unitModifierNames.includes(MirrorComputing.name)) {
          value *= 2;
        }
      } else if (nsid === "token:base/tradegood-commodity-3") {
        type = "tradegood";
        value = 3;
        if (unitModifierNames.includes(MirrorComputing.name)) {
          value *= 2;
        }
      } else if (nsid.startsWith("card.planet:")) {
        const planet: Planet | undefined =
          TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
        if (planet) {
          type = "planet";
          name = planet.getName();
          value = planet.getResources();
          if (unitModifierNames.includes(XxekirGrom.name)) {
            value += planet.getInfluence();
          }
          if (unitModifierNames.includes(ArchonsGift.name)) {
            value = Math.max(planet.getResources(), planet.getInfluence());
          }
        }
      } else if (nsid.startsWith("card.deepwrought-ocean:")) {
        value == 1;
      }

      if (type) {
        this._entries.push({
          obj: obj,
          type,
          name,
          value,
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
      .reduce((acc, entry) => acc + entry.value, 0);
  }

  getPlanetValue(): number {
    return this._entries
      .filter((entry) => entry.type === "planet")
      .reduce((acc, entry) => acc + entry.value, 0);
  }

  getTotalValue(): number {
    return this.getTradegoodValue() + this.getPlanetValue();
  }

  getTotalValueWithModifiers(): string {
    let total: string = this.getTotalValue().toString();
    if (this._unitModifierNames.includes(SarweenTools.name)) {
      total += "+ST";
    }
    if (this._unitModifierNames.includes(WarMachine.name)) {
      total += "+WM";
    }
    return total;
  }

  report(): string {
    const result: Array<string> = [];

    const tradegoods: number = this.getTradegoodValue();
    if (tradegoods > 0) {
      result.push(`tradegoods (${tradegoods})`);
    }

    for (const entry of this._entries) {
      if (entry.type === "planet") {
        result.push(`${entry.name} (${entry.value})`);
      }
    }

    const total: string = this.getTotalValueWithModifiers();
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
