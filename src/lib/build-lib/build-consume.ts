import { GameObject } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

import { Planet } from "../system-lib/planet/planet";

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
      } else if (nsid === "token:base/tradegood-commodity-3") {
        type = "tradegood";
        value = 3;
      } else if (nsid.startsWith("card.planet:")) {
        const planet: Planet | undefined =
          TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
        if (planet) {
          type = "planet";
          name = planet.getName();
          value = planet.getResources();
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
    let value: number = this._entries
      .filter((entry) => entry.type === "tradegood")
      .reduce((acc, entry) => acc + entry.value, 0);

    if (this._unitModifierNames.includes("Mirror Computing")) {
      value *= 2;
    }

    return value;
  }

  getPlanetValue(): number {
    return this._entries
      .filter((entry) => entry.type === "planet")
      .reduce((acc, entry) => acc + entry.value, 0);
  }

  report(): string {
    const result: Array<string> = [];

    const tradegoods: number = this.getTradegoodValue();
    if (tradegoods > 0) {
      result.push(`${tradegoods} tradegoods`);
    }

    for (const entry of this._entries) {
      if (entry.type === "planet") {
        result.push(`${entry.name} (${entry.value})`);
      }
    }

    return `consuming ${result.join(", ")}`;
  }
}
