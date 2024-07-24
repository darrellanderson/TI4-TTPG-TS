import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
import { FactionSchemaType } from "../schema/faction-schema";

export class Faction {
  private readonly _source: NsidNameSchemaType;
  private readonly _params: FactionSchemaType;

  constructor(source: NsidNameSchemaType, params: FactionSchemaType) {
    this._source = source;
    this._params = params;
  }

  getAbbr(): string {
    return this._params.abbr;
  }

  getAbilityNsids(): Array<string> {
    return this._params.abilities.map((ability): string => {
      return `faction-ability:${this._source}/${ability}`;
    });
  }

  getAgentNsids(): Array<string> {
    return this._params.leaders.agents.map((agent): string => {
      return `card.leader.agent:${this._source}/${agent}`;
    });
  }

  getCommanderNsids(): Array<string> {
    return this._params.leaders.commanders.map((commander): string => {
      return `card.leader.commander:${this._source}/${commander}`;
    });
  }

  getCommodities(): number {
    return this._params.commodities;
  }

  getHeroNsids(): Array<string> {
    return this._params.leaders.heroes.map((hero): string => {
      return `card.leader.hero:${this._source}/${hero}`;
    });
  }

  getHomeSurrogateTileNumber(): number {
    return this._params.homeSurrogate ?? -1;
  }

  getHomeSystemTileNumber(): number {
    return this._params.home;
  }

  getMechNsids(): Array<string> {
    return this._params.leaders.mechs.map((mech): string => {
      return `card.leader.mech:${this._source}/${mech}`;
    });
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

  getStartingTechNsids(): Array<string> {
    throw new Error("need to know tech color, source");
  }

  getStartingUnits(): { [unit: string]: number } {
    return this._params.startingUnits;
  }

  getTechNsids(): Array<string> {
    throw new Error("need to know tech color, source");
  }

  getUnitOverrideNsids(): Array<string> {
    return this._params.unitOverrides.map((unitOverride): string => {
      // Mech got added in PoK so base factions can have pok mech.
      // If mech use that format, and if base swap to pok for it.
      if (this._params.leaders.mechs.includes(unitOverride)) {
        let source = this._source;
        if (source === "base") {
          source = "pok";
        }
        return `card.leader.mech:${source}/${unitOverride}`;
      }
      return `unit:${this._source}/${unitOverride}`;
    });
  }
}
