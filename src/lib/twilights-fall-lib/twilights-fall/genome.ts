import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { GenomeSchemaType } from "../schema/genome-schema";

export class Genome {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: GenomeSchemaType;

  constructor(source: NsidNameSchemaType, params: GenomeSchemaType) {
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
    return `card.tf-genome:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }
}
