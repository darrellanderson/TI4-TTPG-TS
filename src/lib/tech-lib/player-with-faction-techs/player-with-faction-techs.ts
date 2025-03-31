import { Faction } from "../../faction-lib/faction/faction";
import { RemoveByNsidOrSource } from "../../remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";
import { Tech } from "../tech/tech";

/**
 * Get all available techs for a player, including faction tech.
 * Faction unit upgrades remove the base version unit upgrades.
 */
export class PlayerWithFactionTechs {
  private readonly _faction: Faction | undefined;

  static getOwnedTechs(playerSlot: number): Array<Tech> {
    const techs: Array<Tech> = [];
    // TODO XXX
    return techs;
  }

  constructor(faction: Faction | undefined) {
    this._faction = faction;
  }

  get(): Array<Tech> {
    // Get all techs.
    let techs: Array<Tech> = this._getAllTechs();

    // Apply remove rules (e.g. codex replacement).
    techs = this._applyRemoveRules(techs);

    // Remove other factions' faction tech.
    techs = this._pruneOtherFactionTechs(techs);

    // Remove overriden unit upgrades.
    techs = this._pruneOverridenUnitUpgrades(techs);

    return techs;
  }

  /**
   * Get all techs, including ALL faction tech.
   */
  _getAllTechs(): Array<Tech> {
    return TI4.techRegistry.getAllTechs();
  }

  /**
   * Apply remove rules (e.g. codex replacement).
   */
  _applyRemoveRules(techs: Array<Tech>): Array<Tech> {
    const removeByNsidOrSource: RemoveByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();
    return techs.filter((tech: Tech): boolean => {
      return !removeByNsidOrSource.shouldRemove(tech.getNsid());
    });
  }

  /**
   * Remove other factions' faction tech.
   *
   * @param techs
   * @returns
   */
  _pruneOtherFactionTechs(techs: Array<Tech>): Array<Tech> {
    const factionTechNsids: Set<string> = new Set<string>();
    if (this._faction) {
      for (const nsid of this._faction.getFactionTechNsids()) {
        factionTechNsids.add(nsid);
      }
    }
    return techs.filter((tech: Tech): boolean => {
      return !tech.isFactionTech() || factionTechNsids.has(tech.getNsid());
    });
  }

  _pruneOverridenUnitUpgrades(techs: Array<Tech>): Array<Tech> {
    const removeNsidNames: Set<string> = new Set<string>();
    for (const tech of techs) {
      const replaceNsidName: string | undefined = tech.replacesNsidName();
      if (replaceNsidName) {
        removeNsidNames.add(replaceNsidName);
      }
    }
    return techs.filter((tech: Tech): boolean => {
      return !removeNsidNames.has(tech.getNsidName());
    });
  }
}
