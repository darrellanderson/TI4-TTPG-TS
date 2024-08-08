import { Color, Container, GameObject, world } from "@tabletop-playground/api";
import { ColorLib, LayoutObjects, Spawn } from "ttpg-darrell";

import { UnitType } from "../../lib/unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../lib/unit-lib/unit-attrs/unit-attrs";

export class LayoutUnitBox extends LayoutObjects {
  constructor(unit: UnitType, playerSlot: number) {
    super();

    const slotColor: Color = world.getSlotColor(playerSlot);
    const objColor: Color = new ColorLib().colorToObjectColor(slotColor);

    const source: string = unit === "mech" ? "pok" : "base";
    const containerNsid: string = `container.unit:${source}/${unit}`;
    const unitNsid: string = `unit:${source}/${unit}`;

    const unitAttrs: UnitAttrs = TI4.unitAttrsRegistry
      .defaultUnitAttrsSet()
      .getOrThrow(unit);
    const componentCount: number = unitAttrs.getComponentCount();

    // Create the container.
    const container: GameObject = Spawn.spawnOrThrow(containerNsid);
    container.setOwningPlayerSlot(playerSlot);
    container.setPrimaryColor(objColor);
    if (container instanceof Container) {
      for (let i = 0; i < componentCount; i++) {
        const unit: GameObject = Spawn.spawnOrThrow(unitNsid);
        unit.setOwningPlayerSlot(playerSlot);
        unit.setPrimaryColor(objColor);
        container.insert([unit]);
      }
    }

    this.add(container);
  }
}
