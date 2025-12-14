import { Shuffle } from "ttpg-darrell";
import { Faction } from "../../faction-lib/faction/faction";

export class GenerateFactions {
  /**
   * Generate random factions, with some logic to deal with Keleres.
   *
   * @param count
   */
  generate(count: number): Array<Faction> {
    let sawKeleres: boolean = false;
    let factions: Array<Faction> = TI4.factionRegistry
      .getAllFactionsFilteredByConfigSources()
      .filter((faction: Faction): boolean => {
        return !faction.isExcludeFromDraft();
      })
      .filter((faction: Faction): boolean => {
        const abbr: string = faction.getAbbr();
        if (abbr.startsWith("Keleres")) {
          if (sawKeleres) {
            return false;
          }
          sawKeleres = true;
        }
        return true;
      });
    factions = new Shuffle<Faction>().shuffle(factions);

    return this._resolveOrThrow(count, factions);
  }

  _resolve(count: number, factions: Array<Faction>): Array<Faction> {
    const result: Array<Faction> = [];

    // Keleres uses either Argent, Mentak, or Xxcha home systems.
    // Prevent an impossible combination of factions.
    let sawKeleres: boolean = false;
    let sawArgent: boolean = false;
    let sawMentak: boolean = false;
    let sawXxcha: boolean = false;

    while (result.length < count && factions.length > 0) {
      const faction: Faction = factions.shift() as Faction;
      const abbr: string = faction.getAbbr();

      if (abbr.startsWith("Keleres")) {
        if (sawKeleres) {
          continue; // already present
        }
        if (sawArgent && sawMentak && sawXxcha) {
          continue; // all candidates already present
        }
        sawKeleres = true;
      }

      if (abbr === "Argent") {
        if (sawKeleres && sawMentak && sawXxcha) {
          continue; // keleres needs argent home system
        }
        sawArgent = true;
      }

      if (abbr === "Mentak") {
        if (sawKeleres && sawArgent && sawXxcha) {
          continue; // keleres needs mentak home system
        }
        sawMentak = true;
      }

      if (abbr === "Xxcha") {
        if (sawKeleres && sawArgent && sawMentak) {
          continue; // keleres needs xxcha home system
        }
        sawXxcha = true;
      }

      result.push(faction);
    }

    return result;
  }

  _resolveOrThrow(count: number, factions: Array<Faction>): Array<Faction> {
    const result: Array<Faction> = this._resolve(count, factions);
    if (result.length < count) {
      throw new Error("Insufficient factions");
    }
    return result;
  }
}
