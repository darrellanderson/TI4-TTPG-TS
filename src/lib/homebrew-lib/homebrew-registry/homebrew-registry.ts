import { Spawn } from "ttpg-darrell";
import { SpawnMissingCards } from "../spawn-missing-cards/spawn-missing-cards";
import { HomebrewModuleType } from "./homebrew-schema";

/**
 * Homebrew modules register via this class.
 */
export class HomebrewRegistry {
  public load(params: HomebrewModuleType): void {
    if (params.factions) {
      TI4.factionRegistry.load(params.sourceAndPackageId, params.factions);
    }

    if (params.systems) {
      TI4.systemRegistry.load(params.sourceAndPackageId, params.systems);
    }

    if (params.planetAttachments) {
      TI4.planetAttachmentRegistry.load(
        params.sourceAndPackageId,
        params.planetAttachments
      );
    }
    if (params.systemAttachments) {
      TI4.systemAttachmentRegistry.load(
        params.sourceAndPackageId,
        params.systemAttachments
      );
    }

    if (params.unitAttrs) {
      TI4.unitAttrsRegistry.load(
        params.sourceAndPackageId.source,
        params.unitAttrs
      );
    }
    if (params.unitModifiers) {
      TI4.unitModifierRegistry.load(
        params.sourceAndPackageId.source,
        params.unitModifiers
      );
    }

    if (params.technologies) {
      TI4.techRegistry.load(
        params.sourceAndPackageId.source,
        params.technologies
      );
    }

    if (params.remove) {
      TI4.removeRegistry.load(params.sourceAndPackageId.source, params.remove);
    }

    if (params.nsidToTemplateId) {
      Spawn.inject(params.nsidToTemplateId);

      const spawnMissingCards = new SpawnMissingCards();
      for (const nsid of Object.keys(params.nsidToTemplateId)) {
        if (SpawnMissingCards.shouldSpawnMissingCards(nsid)) {
          spawnMissingCards.spawnAndAddMissingCards(nsid);
        }
      }
    }
  }
}
