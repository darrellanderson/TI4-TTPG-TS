import {
  UnitModifierCardClassType,
  UnitModifierOwnerType,
  UnitModifierPriorityType,
  UnitModifierSchemaType,
} from "../schema/unit-modifier-schema";

export class UnitModifier {
  private readonly _params: UnitModifierSchemaType;

  public static schemaToNsid(
    source: string,
    schema: UnitModifierSchemaType
  ): string | undefined {
    switch (schema.cardClass) {
      case "action":
        return `card.action:${source}/${schema.nsidName}`;
      case "agenda":
        return `card.agenda:${source}/${schema.nsidName}`;
      case "agent":
        return `card.leader.agent:${source}/${schema.nsidName}`;
      case "alliance":
        return `card.alliance:${source}/${schema.nsidName}`;
      case "commander":
        return `card.leader.commander:${source}/${schema.nsidName}`;
      case "hero":
        return `card.leader.hero:${source}/${schema.nsidName}`;
      case "legendary":
        return `card.legendary-planet:${source}/${schema.nsidName}`;
      case "promissory":
        return `card.promissory:${source}/${schema.nsidName}`;
      case "relic":
        return `card.relic:${source}/${schema.nsidName}`;
      case "technology":
        return `card.technology:${source}/${schema.nsidName}`;
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
