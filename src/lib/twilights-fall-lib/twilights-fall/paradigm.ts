import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { ParadigmSchemaType } from "../schema/paradigm-schema";

export class Paradigm {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: ParadigmSchemaType;

  constructor(source: NsidNameSchemaType, params: ParadigmSchemaType) {
    this._source = source;
    this._params = params;
  }

  getOrigin(): string {
    return this._params.origin;
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): string {
    return `card.tf-paradigm:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }
}
