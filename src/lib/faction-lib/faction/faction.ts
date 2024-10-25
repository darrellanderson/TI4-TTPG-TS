import { GameObject } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

import { FactionSchemaType } from "../schema/faction-schema";
import {
  NsidNameSchemaType,
  SourceAndPackageIdSchemaType,
} from "../../system-lib/schema/basic-types-schema";
import { Tech } from "../../tech-lib/tech/tech";

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
      return TI4.factionRegistry.rewriteNsid(
        `card.leader.agent:${source}/${agent}`
      );
    });
  }

  /**
   * Caution, there may be '.omega' version!
   * @returns
   */
  getAllianceNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    const nsid: string = `card.alliance:${source}/${this._params.nsidName}`;
    const result: Array<string> = [nsid];
    const before: string = `${nsid}.omega`;
    const after: string = TI4.factionRegistry.rewriteNsid(before);
    if (before !== after) {
      result.push(after);
    }
    return result;
  }

  getCommanderNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return this._params.leaders.commanders.map((commander): string => {
      return TI4.factionRegistry.rewriteNsid(
        `card.leader.commander:${source}/${commander}`
      );
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

  getExtraCount(nsid: string): number {
    let result: number = 0;
    if (this._params.extras) {
      for (const extra of this._params.extras) {
        if (extra.nsid === nsid) {
          result = extra.count ?? 1;
          break;
        }
      }
    }
    return result;
  }

  getExtras(): Array<string> {
    let result: Array<string> = [];
    if (this._params.extras) {
      result = this._params.extras.map((extra): string => extra.nsid);
    }
    return result;
  }

  getFactionSheetNsid(): string {
    const source: string = this._sourceAndPackageId.source;
    return `sheet.faction:${source}/${this._params.nsidName}`;
  }

  getFactionTechNsids(): Array<string> {
    const result: Array<string> = [];
    for (const factionTech of this._params.factionTechs) {
      const techs: Array<Tech> =
        TI4.techRegistry.getByNsidNameMaybeOmegaToo(factionTech);
      const nsids: Array<string> = techs.map((tech) => tech.getNsid());
      result.push(...nsids);
      // If not found, add a bogus entry.  Validate will catch and report.
      if (nsids.length === 0) {
        result.push(`card.technology.unknown:unknown/${factionTech}`);
      }
    }
    return result;
  }

  getHeroNsids(): Array<string> {
    let source: string = this._sourceAndPackageId.source;
    if (source === "base") {
      source = "pok"; // aliance got added in PoK
    }
    return this._params.leaders.heroes.map((hero): string => {
      return TI4.factionRegistry.rewriteNsid(
        `card.leader.hero:${source}/${hero}`
      );
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
      return TI4.factionRegistry.rewriteNsid(
        `card.leader.mech:${source}/${mech}`
      );
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
      return TI4.factionRegistry.rewriteNsid(
        `card.promissory:${source}/${promissory}`
      );
    });
  }

  getStartingTechNsids(): Array<string> {
    const result: Array<string> = [];
    for (const startingTech of this._params.startingTechs) {
      const techs: Array<Tech> =
        TI4.techRegistry.getByNsidNameMaybeOmegaToo(startingTech);
      const nsids: Array<string> = techs.map((tech) => tech.getNsid());
      result.push(...nsids);
      // If not found, add a bogus entry.  Validate will catch and report.
      if (nsids.length === 0) {
        result.push(`card.technology.unknown:unknown/${startingTech}`);
      }
    }
    return result;
  }

  getStartingUnits(): Record<string, number> {
    const result: Record<string, number> = {};

    // eslint-disable-next-line prefer-const
    for (let [unit, count] of Object.entries(this._params.startingUnits)) {
      if (unit === "spaceDock") {
        unit = "space-dock";
      } else if (unit === "warSun") {
        unit = "war-sun";
      }
      result[unit] = count;
    }

    // his._params.startingUnits;

    return result;
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
