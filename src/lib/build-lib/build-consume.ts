import { GameObject } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { Planet } from "../system-lib/planet/planet";

import { MirrorComputing } from "../unit-lib/data/unit-modifiers/base/mirror-computing";
import { SarweenTools } from "../unit-lib/data/unit-modifiers/base/sarween-tools";
import { WarMachine } from "../unit-lib/data/unit-modifiers/codex-ordinian/war-machine";
import { XxekirGrom } from "../unit-lib/data/unit-modifiers/codex-vigil/xxekir-grom";

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
        }
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

    let extras: string = "";
    if (this._unitModifierNames.includes(SarweenTools.name)) {
      extras += "+ST";
    }
    if (this._unitModifierNames.includes(WarMachine.name)) {
      extras += "+WM";
    }

    const total: number = this.getTotalValue();
    return `consuming $${total}${extras}: ${result.join(", ")}`;
  }
}
