import { Faction } from "../../faction-lib/faction/faction";

export class ParseFactions {
  parseFactions(config: string, errors: Array<string>): Faction[] | undefined {
    let index: number;

    const prefix = "factions=";
    index = config.indexOf(prefix);
    if (index !== -1) {
      config = config.substring(index + prefix.length);
    } else {
      // factions= MUST exist to find them.
      return undefined;
    }

    const suffix = "&";
    index = config.indexOf(suffix);
    if (index !== -1) {
      config = config.substring(0, index);
    }

    config = config.toLowerCase();

    const nsidNames: Array<string> = config.split("|");
    const factions: Array<Faction> = [];

    for (const nsidName of nsidNames) {
      const faction: Faction | undefined =
        TI4.factionRegistry.getByNsidName(nsidName);
      if (faction) {
        factions.push(faction);
      } else {
        errors.push(`unknown faction "${nsidName}"`);
      }
    }

    return factions.length > 0 ? factions : undefined;
  }
}
