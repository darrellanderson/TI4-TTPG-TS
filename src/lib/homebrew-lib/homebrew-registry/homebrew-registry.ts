import { Spawn } from "ttpg-darrell";
import { SpawnMissingCards } from "../spawn-missing-cards/spawn-missing-cards";

import { FactionSchemaType } from "../../faction-lib/schema/faction-schema";
import { PlanetAttachmentSchemaType } from "../../system-lib/schema/planet-attachment-schema";
import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
import { SystemAttachmentSchemaType } from "../../system-lib/schema/system-attachment-schema";
import { SystemSchemaType } from "../../system-lib/schema/system-schema";
import { TechSchemaType } from "../../tech-lib/schema/tech-schema";
import { UnitAttrsSchemaType } from "../../unit-lib/schema/unit-attrs-schema";
import { UnitModifierSchemaType } from "../../unit-lib/schema/unit-modifier-schema";

export type HomebrewModuleType = {
  // Each of source and package id uniquely identifies a module.
  // Source is used in all relevant NSIDs.
  sourceAndPackageId: SourceAndPackageIdSchemaType;

  factions?: Array<FactionSchemaType>;
  systems?: Array<SystemSchemaType>;

  planetAttachments?: Array<PlanetAttachmentSchemaType>;
  systemAttachments?: Array<SystemAttachmentSchemaType>;

  unitAttrs?: Array<UnitAttrsSchemaType>;
  unitModifiers?: Array<UnitModifierSchemaType>;

  technologies?: Array<TechSchemaType>;

  remove?: Array<string>; // NSIDs

  nsidToTemplateId?: {
    [key: string]: string;
  };
};

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
