import {
  UnitModifierCardClassType,
  UnitModifierOwnerType,
  UnitModifierPriorityType,
  UnitModifierSchemaType,
} from "../schema/unit-modifier-schema";

export class UnitModifier {
  private readonly _params: UnitModifierSchemaType;

  constructor(params: UnitModifierSchemaType) {
    this._params = params;
  }

  getCardClass(): UnitModifierCardClassType | undefined {
    return this._params.cardClass;
  }

  getDescription(): string | undefined {
    return this._params.description;
  }

  getLinkToNsidName(): string | undefined {
    return this._params.linkToNsidName;
  }

  getName(): string {
    return this._params.name;
  }

  getNsidName(): string | undefined {
    return this._params.nsidName;
  }

  getOwner(): UnitModifierOwnerType {
    return this._params.owner;
  }

  getPriority(): UnitModifierPriorityType {
    return this._params.priority;
  }

  isActiveIdle(): boolean {
    return this._params.isActiveIdle ?? false;
  }

  isCombat(): boolean {
    return this._params.isCombat ?? false;
  }
}
