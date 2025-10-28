import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import {
  UnitModifierOwnerType,
  UnitModifierPriorityType,
  UnitModifierSchemaType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";
import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";

export class UnitModifier {
  private readonly _params: UnitModifierSchemaType;

  public static schemaTriggerToNsid(
    source: NsidNameSchemaType,
    trigger: UnitModifierTriggerType
  ): string {
    if (trigger.overrideSource) {
      source = trigger.overrideSource;
    }
    switch (trigger.cardClass) {
      case "action":
      case "agenda":
      case "alliance":
      case "breakthrough":
      case "event":
      case "promissory":
      case "relic":
      case "technology.blue":
      case "technology.green":
      case "technology.red":
      case "technology.yellow":
      case "technology.unit-upgrade":
      case "tf-ability":
      case "tf-action":
      case "tf-genome":
      case "tf-paradigm":
      case "tf-unit-upgrade":
        return `card.${trigger.cardClass}:${source}/${trigger.nsidName}`;
      case "agent":
      case "commander":
      case "hero":
      case "mech":
        return `card.leader.${trigger.cardClass}:${source}/${trigger.nsidName}`;
      case "faction-ability":
        return `faction-ability:${source}/${trigger.nsidName}`;
      case "legendary":
        return `card.legendary-planet:${source}/${trigger.nsidName}`;
      case "unit":
        return `unit:${source}/${trigger.nsidName}`;
      case "custom":
        return trigger.nsidName;
    }
  }

  static sortByApplyOrder(modifiers: Array<UnitModifier>): Array<UnitModifier> {
    const priorityToSortValue = {
      mutate: 1,
      "mutate-late": 2,
      adjust: 3,
      "adjust-late": 4,
      choose: 5,
      "choose-late": 6,
    };
    return modifiers.sort((a, b) => {
      const aValue: number = priorityToSortValue[a.getPriority()];
      const bValue: number = priorityToSortValue[b.getPriority()];
      return aValue - bValue;
    });
  }

  constructor(params: UnitModifierSchemaType) {
    this._params = params;
  }

  applies(combatRoll: CombatRoll): boolean {
    return this._params.applies(combatRoll);
  }

  apply(combatRoll: CombatRoll): void {
    this._params.apply(combatRoll);
  }

  getDescription(): string | undefined {
    return this._params.description;
  }

  getName(): string {
    return this._params.name;
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
}
