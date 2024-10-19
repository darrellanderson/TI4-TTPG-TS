import { FactionSchemaType } from "../schema/faction-schema";
import {
  NsidNameSchemaType,
  SourceAndPackageIdSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { GameObject } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class Faction {
  private readonly _sourceAndPackageId: SourceAndPackageIdSchemaType;
  private readonly _params: FactionSchemaType;
  private readonly _find: Find = new Find();

  constructor(
    sourceAndPackageId: SourceAndPackageIdSchemaType,
    params: FactionSchemaType
  ) {
    this._sourceAndPackageId = sourceAndPackageId;
    this._params = params;
  }

  getAbbr(): string {
    return this._params.abbr;
  }

  getAbilityNsids(): Array<string> {
    const source: string = this._sourceAndPackageId.source;
    return this._params.abilities.map((ability): string => {
      return `faction-ability:${source}/${ability}`;
    });
  }

  getAgentNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return this._params.leaders.agents.map((agent): string => {
      return `card.leader.agent:${source}/${agent}`;
    });
  }

  getAllianceNsid(): string {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return `card.alliance:${source}/${this._params.nsidName}`;
  }

  getCommanderNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return this._params.leaders.commanders.map((commander): string => {
      return `card.leader.commander:${source}/${commander}`;
    });
  }

  getCommandTokenNsid(): string {
    const source: string = this._sourceAndPackageId.source;
    return `token.command:${source}/${this._params.nsidName}`;
  }

  getCommodities(): number {
    return this._params.commodities;
  }

  getControlTokenNsid(): string {
    const source: string = this._sourceAndPackageId.source;
    return `token.control:${source}/${this._params.nsidName}`;
  }

  getFactionTechNsidNames(): Array<string> {
    return this._params.factionTechs; // need color to form full nsid
  }

  getHeroNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return this._params.leaders.heroes.map((hero): string => {
      return `card.leader.hero:${source}/${hero}`;
    });
  }

  getHomeSurrogateTileNumber(): number {
    return this._params.homeSurrogate ?? -1;
  }

  getHomeSystemTileNumber(): number {
    return this._params.home;
  }

  getHomeSystemTileObj(playerSlot: number): GameObject | undefined {
    const tileNumber: number = this.getHomeSystemTileNumber();
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
    if (nsid) {
      const skipContained: boolean = true;
      return this._find.findGameObject(nsid, playerSlot, skipContained);
    }
    return undefined;
  }

  getIcon(): string {
    return `icon/faction/${this._params.nsidName}.png`;
  }

  getIconPackageId(): string {
    return this._sourceAndPackageId.packageId;
  }

  getMechNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return this._params.leaders.mechs.map((mech): string => {
      return `card.leader.mech:${source}/${mech}`;
    });
  }

  getName(): string {
    return this._params.name;
  }

  getNsid(): NsidNameSchemaType {
    const source: string = this._sourceAndPackageId.source;
    return `faction:${source}/${this._params.nsidName}`;
  }

  getPromissoryNsids(): Array<string> {
    const source: string = this._sourceAndPackageId.source;
    return this._params.promissories.map((promissory): string => {
      return `card.promissory:${source}/${promissory}`;
    });
  }

  getStartingTechNsidNames(): Array<string> {
    return this._params.startingTechs;
  }

  getStartingUnits(): { [unit: string]: number } {
    return this._params.startingUnits;
  }

  getUnitOverrideNsids(): Array<string> {
    return this._params.unitOverrides.map((unitOverride): string => {
      let source: string = this._sourceAndPackageId.source;
      // Mech got added in PoK so base factions can have pok mech.
      // If mech use that format, and if base swap to pok for it.
      if (this._params.leaders.mechs.includes(unitOverride)) {
        if (source === "base") {
          source = "pok";
        }
        return `card.leader.mech:${source}/${unitOverride}`;
      }
      return `unit:${source}/${unitOverride}`;
    });
  }
}
