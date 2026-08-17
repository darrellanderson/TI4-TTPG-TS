import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { EchoSchemaType } from "../schema/echo-schema";

export class Echo {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: EchoSchemaType;

  constructor(source: NsidNameSchemaType, params: EchoSchemaType) {
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
    return `card.tf-echo:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }
}
