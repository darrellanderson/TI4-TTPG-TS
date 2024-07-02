import {
  UnitModifierOwnerType,
  UnitModifierPriorityType,
  UnitModifierSchemaType,
  UnitModifierTriggerType,
} from "../schema/unit-modifier-schema";

export class UnitModifier {
  private readonly _params: UnitModifierSchemaType;

  public static schemaTriggerToNsid(
    source: string,
    trigger: UnitModifierTriggerType
  ): string | undefined {
    switch (trigger.cardClass) {
      case "action":
        return `card.action:${source}/${trigger.nsidName}`;
      case "agenda":
        return `card.agenda:${source}/${trigger.nsidName}`;
      case "agent":
        return `card.leader.agent:${source}/${trigger.nsidName}`;
      case "alliance":
        return `card.alliance:${source}/${trigger.nsidName}`;
      case "commander":
        return `card.leader.commander:${source}/${trigger.nsidName}`;
      case "hero":
        return `card.leader.hero:${source}/${trigger.nsidName}`;
      case "legendary":
        return `card.legendary-planet:${source}/${trigger.nsidName}`;
      case "promissory":
        return `card.promissory:${source}/${trigger.nsidName}`;
      case "relic":
        return `card.relic:${source}/${trigger.nsidName}`;
      case "technology":
        return `card.technology:${source}/${trigger.nsidName}`;
    }
    return undefined;
  }

  static sortByApplyOrder(
    modifiers: Array<UnitModifierSchemaType>
  ): Array<UnitModifierSchemaType> {
    const priorityToSortValue = {
      mutate: 1,
      adjust: 2,
      choose: 3,
    };
    return modifiers.sort((a, b) => {
      const aValue: number = priorityToSortValue[a.priority];
      const bValue: number = priorityToSortValue[b.priority];
      return aValue - bValue;
    });
  }

  constructor(params: UnitModifierSchemaType) {
    this._params = params;
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

  isCombat(): boolean {
    return this._params.isCombat ?? false;
  }
}
