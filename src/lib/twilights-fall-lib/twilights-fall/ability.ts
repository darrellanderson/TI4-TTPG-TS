import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { AbilityColorType, AbilitySchemaType } from "../schema/ability-schema";

export class Ability {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: AbilitySchemaType;

  constructor(source: NsidNameSchemaType, params: AbilitySchemaType) {
    this._source = source;
    this._params = params;
  }

  getColor(): AbilityColorType {
    return this._params.color;
  }

  getOrigin(): string {
    return this._params.origin;
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): string {
    return `card.tf-ability:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }
}
