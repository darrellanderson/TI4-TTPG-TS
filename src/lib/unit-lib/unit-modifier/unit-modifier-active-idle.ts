import { GameObject } from "@tabletop-playground/api";

export class UnitModifierActiveIdle {
  private static readonly ACTIVE_KEY: string = "isActive";

  static isActive(obj: GameObject): boolean {
    const value: string = obj.getSavedData(UnitModifierActiveIdle.ACTIVE_KEY);
    return value === "true";
  }

  static setActive(obj: GameObject, active: boolean): void {
    const value: string = active ? "true" : "false";
    obj.setSavedData(value, UnitModifierActiveIdle.ACTIVE_KEY);
  }
}
