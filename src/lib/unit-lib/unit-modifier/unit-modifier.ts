import { UnitModifierSchemaType } from "../schema/unit-modifier-schema";

export class UnitModifier {
  private readonly _params: UnitModifierSchemaType;

  constructor(params: UnitModifierSchemaType) {
    this._params = params;
  }

  getDescription(): string | undefined {
    return this._params.description;
  }

  getName(): string {
    return this._params.name;
  }

  getNsidNames(): string[] {
    return [...(this._params.nsidNames ?? [])];
  }

  getOwner(): "self" | "opponent" | "any" {
    return this._params.owner;
  }

  getPriority(): "mutate" | "adjust" | "choose" {
    return this._params.priority;
  }

  isActiveIdle(): boolean {
    return this._params.isActiveIdle ?? false;
  }

  isCombat(): boolean {
    return this._params.isCombat ?? false;
  }
}
