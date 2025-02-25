import {
  Color,
  Container,
  GameObject,
  ObjectType,
  Vector,
} from "@tabletop-playground/api";
import { ColorLib, ColorsType, LayoutObjects, Spawn } from "ttpg-darrell";

import { UnitType } from "../../../lib/unit-lib/schema/unit-attrs-schema";
import { UnitAttrs } from "../../../lib/unit-lib/unit-attrs/unit-attrs";

export class LayoutUnitBox {
  private readonly _layout: LayoutObjects = new LayoutObjects();

  constructor(unit: UnitType, playerSlot: number) {
    const isAnonymousUnitBox = playerSlot === 19;
    const colorLib: ColorLib = new ColorLib();
    let objColor: Color | undefined = undefined;
    if (isAnonymousUnitBox) {
      objColor = TI4.playerColor.getAnonymousColor();
    } else {
      const colorsType: ColorsType =
        colorLib.getColorsByPlayerSlotOrThrow(playerSlot);
      objColor = colorLib.parseColorOrThrow(colorsType.plastic);
    }

    const source: string = unit === "mech" ? "pok" : "base";
    const containerNsid: string = `container.unit:${source}/${unit}`;
    const unitNsid: string = `unit:${source}/${unit}`;

    const unitTag: string = `${unit}(${playerSlot})`;
    let tags: Array<string>;

    const unitAttrs: UnitAttrs = TI4.unitAttrsRegistry
      .defaultUnitAttrsSet()
      .getOrThrow(unit);
    let componentCount: number = unitAttrs.getComponentCount();
    if (isAnonymousUnitBox) {
      componentCount = 1; // anonymous gets one
    }

    // Create the container.
    const container: GameObject = Spawn.spawnOrThrow(containerNsid);
    container.setOwningPlayerSlot(playerSlot);
    container.setPrimaryColor(objColor);
    container.setRotation([0, 0, 180]); // image on top, flip because using UI instead
    if (container instanceof Container) {
      tags = container.getContainerTags();
      if (!tags.includes(unitTag)) {
        tags.push(unitTag);
        container.setContainerTags(tags);
      }
      if (isAnonymousUnitBox) {
        container.setType(1); // infinite
      }
    }
    if (container instanceof Container) {
      const above: Vector = container.getPosition().add([0, 0, 10]);
      for (let i = 0; i < componentCount; i++) {
        const unit: GameObject = Spawn.spawnOrThrow(unitNsid, above);
        unit.setOwningPlayerSlot(playerSlot);
        unit.setPrimaryColor(objColor);
        tags = unit.getTags();
        if (!tags.includes(unitTag)) {
          tags.push(unitTag);
          unit.setTags(tags);
        }

        container.insert([unit]);
      }
    }

    this._layout.add(container);

    this._layout.addAfterLayout(() => {
      container.setObjectType(ObjectType.Ground);
    });
  }

  getLayout(): LayoutObjects {
    return this._layout;
  }
}
