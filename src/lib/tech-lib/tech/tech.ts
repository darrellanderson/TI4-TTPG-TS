import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { TechColorType, TechSchemaType } from "../schema/tech-schema";

export class Tech {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: TechSchemaType;

  static sortByLevel(techs: Array<Tech>): Array<Tech> {
    return techs.sort((a: Tech, b: Tech): number => {
      const aLevel: number = a.getLevel();
      const bLevel: number = b.getLevel();
      if (aLevel !== bLevel) {
        return aLevel - bLevel;
      }
      // Break ties by alpha order of name.
      return a.getName().localeCompare(b.getName());
    });
  }

  constructor(source: NsidNameSchemaType, params: TechSchemaType) {
    this._source = source;
    this._params = params;
  }

  getColor(): TechColorType {
    return this._params.color;
  }

  getLevel(): number {
    return (
      (this._params.prerequisites.blue ?? 0) +
      (this._params.prerequisites.green ?? 0) +
      (this._params.prerequisites.red ?? 0) +
      (this._params.prerequisites.yellow ?? 0)
    );
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): string {
    return `card.technology.${this._params.color}:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }

  isFactionTech(): boolean {
    return this._params.isFactionTech ? true : false;
  }
}
