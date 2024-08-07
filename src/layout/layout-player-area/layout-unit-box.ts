import { Container, GameObject } from "@tabletop-playground/api";
import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";
import { LayoutObjects, Spawn } from "ttpg-darrell";

export class LayoutUnitBox extends LayoutObjects {
  constructor(unit: UnitType) {
    super();

    const source: string = unit === "mech" ? "pok" : "base";
    const containerNsid: string = `container.unit:${source}/${unit}`;
    const unitNsid: string = `unit:${source}/${unit}`;

    const unitAttrs: UnitAttrs = TI4.unitAttrsRegistry
      .defaultUnitAttrsSet()
      .getOrThrow(unit);
    const componentCount: number = unitAttrs.getComponentCount();

    // Create the container.
    const container: GameObject = Spawn.spawnOrThrow(containerNsid);
    if (container instanceof Container) {
      for (let i = 0; i < componentCount; i++) {
        const unit: GameObject = Spawn.spawnOrThrow(unitNsid);
        container.insert([unit]);
      }
    }

    this.add(container);
  }
}
