import { UnitType } from "../schema/unit-attrs-schema";
import { UnitAttrs } from "../unit-attrs/unit-attrs";

export class UnitAttrsSet {
  private readonly _unitToAttrs: Map<UnitType, UnitAttrs> = new Map();
}
