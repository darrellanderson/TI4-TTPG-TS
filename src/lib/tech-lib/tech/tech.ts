import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { TechSchemaType } from "../schema/tech-schema";

export class Tech {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: TechSchemaType;

  constructor(source: NsidNameSchemaType, params: TechSchemaType) {
    this._source = source;
    this._params = params;
  }

  getNsid(): string {
    return `card.technology.${this._params.color}:${this._source}/${this._params.nsidName}`;
  }
}
