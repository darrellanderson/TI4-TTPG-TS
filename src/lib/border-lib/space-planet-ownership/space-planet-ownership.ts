import { GameObject, Vector } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";

import { Planet } from "../../system-lib/planet/planet";
import { System } from "../../system-lib/system/system";
import { UnitAttrs } from "../../unit-lib/unit-attrs/unit-attrs";
import { UnitPlastic } from "../../unit-lib/unit-plastic/unit-plastic";
import { UnitType } from "../../unit-lib/schema/unit-attrs-schema";

export type ControlType = {
  obj: GameObject;
  owningPlayerSlot: PlayerSlot;
  hex: HexType;
  system: System;
  planet: Planet | undefined;
};

export class SpacePlanetOwnership {
  private readonly _hexToSystem: Map<HexType, System> = new Map();

  constructor() {
    const skipContained: boolean = true;
    const systems: Array<System> =
      TI4.systemRegistry.getAllSystemsWithObjs(skipContained);
    for (const system of systems) {
      const obj: GameObject = system.getObj();
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      this._hexToSystem.set(hex, system);
    }
  }

  _createControlTypeFromUnitPlastic(
    unitPlastic: UnitPlastic
  ): ControlType | undefined {
    const hex: HexType = unitPlastic.getHex();
    const system: System | undefined = this._hexToSystem.get(hex);
    if (!system) {
      return undefined;
    }

    const result: ControlType = {
      obj: unitPlastic.getObj(),
      owningPlayerSlot: unitPlastic.getOwningPlayerSlot(),
      hex,
      system,
      planet: undefined,
    };

    const unitType: UnitType = unitPlastic.getUnit();
    const unitAttrs: UnitAttrs = TI4.unitAttrsRegistry
      .defaultUnitAttrsSet()
      .getOrThrow(unitType);
    if (!unitAttrs.isShip()) {
      result.planet = unitPlastic.getPlanetClosest();
    }
    return result;
  }

  _createControlTypeFromControlToken(
    controlToken: GameObject
  ): ControlType | undefined {
    const pos: Vector = controlToken.getPosition();
    const hex: HexType = TI4.hex.fromPosition(pos);
    const system: System | undefined = this._hexToSystem.get(hex);
    if (!system) {
      return undefined;
    }
    const planet: Planet | undefined = system.getPlanetClosest(pos);

    return {
      obj: controlToken,
      owningPlayerSlot: controlToken.getOwningPlayerSlot(),
      hex,
      system,
      planet,
    };
  }
}
