import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { FactionTechSchemaType } from "../schema/faction-tech-schema";

export class FactionTech {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: FactionTechSchemaType;

  constructor(source: NsidNameSchemaType, params: FactionTechSchemaType) {
    this._source = source;
    this._params = params;
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): string {
    return `card.tf-faction-tech:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }
}
