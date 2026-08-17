import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
import { UnitUpgradeSchemaType } from "../schema/unit-upgrade-schema";

export class UnitUpgrade {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: UnitUpgradeSchemaType;

  constructor(source: NsidNameSchemaType, params: UnitUpgradeSchemaType) {
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
    return `card.tf-unit-upgrade:${this._source}/${this._params.nsidName}`;
  }

  getNsidName(): string {
    return this._params.nsidName;
  }
}
