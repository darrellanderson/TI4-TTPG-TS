import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
import { FactionSchemaType } from "../schema/faction-schema";

export class Faction {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: FactionSchemaType;

  constructor(source: NsidNameSchemaType, params: FactionSchemaType) {
    this._source = source;
    this._params = params;
  }

  getAbilityNsids(): Array<string> {
    return this._params.abilities.map((ability): string => {
      return `faction-ability:${this._source}/${ability}`;
    });
  }

  getHomeSurrogateTileNumber(): number {
    return this._params.homeSurrogate ?? -1;
  }

  getHomeSystemTileNumber(): number {
    return this._params.home;
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): NsidNameSchemaType {
    return `faction:${this._source}/${this._params.nsidName}`;
  }

  getPromissoryNsids(): Array<string> {
    return this._params.promissories.map((promissory): string => {
      return `card.promissory:${this._source}/${promissory}`;
    });
  }

  getUnitOverrideNsids(): Array<string> {
    return this._params.unitOverrides.map((unitOverride): string => {
      // Mech got added in PoK so base factions can have pok mech.
      // Check a mech exists with either the faction source or pok.
      const nsids: Array<string> = [
        `card.leader.mech:${this._source}/${unitOverride}`,
        `card.leader.mech:pok/${unitOverride}`,
      ];
      for (const nsid of nsids) {
        if (TI4.unitAttrsRegistry.rawByNsid(nsid)) {
          return nsid;
        }
      }
      return `unit:${this._source}/${unitOverride}`;
    });
  }
}
