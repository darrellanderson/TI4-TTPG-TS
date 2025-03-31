import { Tech } from "../tech/tech";

export class PlayerWithFactionTechs {
  _getAllTechs(): Array<Tech> {
    const techs: Array<Tech> = TI4.techRegistry.getAllTechs();
    return techs;
  }

  _pruneOverridenUnitUpgrades(techs: Array<Tech>): Array<Tech> {
    const removeNsidNames: Set<string> = new Set<string>();
    for (const tech of techs) {
      if (tech.replacesNsidName()) {
        removeNsidNames.add(tech.getNsid());
      }
    }
    return techs.filter((tech: Tech): boolean => {
      return !removeNsidNames.has(tech.getNsidName());
    });
  }
}
