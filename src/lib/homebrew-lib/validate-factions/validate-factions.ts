import { Spawn } from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";
import { AbstractValidate } from "../abstract-validate/abstract-validate";

export class ValidateFactions extends AbstractValidate {
  getCommandName(): string {
    return "factions";
  }

  getDescription(): string {
    return "Validate factions";
  }

  getErrors(errors: Array<string>): void {
    const registeredLeaderNsids: Set<string> = this.getCardNsids("card.leader");
    const registeredTechNsids: Set<string> =
      this.getCardNsids("card.technology");

    TI4.factionRegistry.getAllFactions().forEach((faction: Faction): void => {
      const leaderNsids: Array<string> = this._getLeaderNsids(faction);
      const missingLeaders: Array<string> = this.getSrcMissingFromDst(
        new Set(leaderNsids),
        registeredLeaderNsids
      );

      const techNsids: Array<string> = this._getTechNsids(faction);
      const missingTech: Array<string> = this.getSrcMissingFromDst(
        new Set(techNsids),
        registeredTechNsids
      );

      const otherNsids: Array<string> = this._getOtherNsids(faction);
      const missingOther: Array<string> = otherNsids.filter(
        (nsid: string): boolean => {
          return !Spawn.has(nsid);
        }
      );

      const missing: Array<string> = [
        ...missingLeaders,
        ...missingTech,
        ...missingOther,
      ];
      if (missing.length > 0) {
        errors.push(`${faction.getName()} is missing ${missing.join(", ")}`);
      }
    });
  }

  _getLeaderNsids(faction: Faction): Array<string> {
    return [
      ...faction.getAgentNsids(),
      ...faction.getCommanderNsids(),
      ...faction.getHeroNsids(),
    ];
  }

  _getTechNsids(faction: Faction): Array<string> {
    return faction.getFactionTechNsids();
  }

  _getOtherNsids(faction: Faction): Array<string> {
    const nsids: Array<string> = [
      ...faction.getExtras(),
      faction.getCommandTokenNsid(),
      faction.getControlTokenNsid(),
    ];

    let tileNumber: number;
    let nsid: string | undefined;

    tileNumber = faction.getHomeSystemTileNumber();
    nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
    if (nsid) {
      nsids.push(nsid);
    }

    tileNumber = faction.getHomeSurrogateTileNumber();
    nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
    if (nsid) {
      nsids.push(nsid);
    }

    return nsids;
  }
}
