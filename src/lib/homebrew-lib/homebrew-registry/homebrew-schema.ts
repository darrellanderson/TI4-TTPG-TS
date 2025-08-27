import { z } from "zod";
import { FactionSchema } from "../../faction-lib/schema/faction-schema";
import { PlanetAttachmentSchema } from "../../system-lib/schema/planet-attachment-schema";
import { SourceAndPackageIdSchema } from "../../system-lib/schema/basic-types-schema";
import { SystemAttachmentSchema } from "../../system-lib/schema/system-attachment-schema";
import { SystemSchema } from "../../system-lib/schema/system-schema";
import { TechSchema } from "../../tech-lib/schema/tech-schema";
import { UnitModifierSchema } from "../../unit-lib/schema/unit-modifier-schema";
import { UnitAttrsSchema } from "../../unit-lib/schema/unit-attrs-schema";

export const HomebrewModuleSchema = z.object({
  // Each of source and package id uniquely identifies a module.
  // Source is used in all relevant NSIDs.
  sourceAndPackageId: SourceAndPackageIdSchema,

  factions: z.array(FactionSchema).optional(),
  systems: z.array(SystemSchema).optional(),

  planetAttachments: z.array(PlanetAttachmentSchema).optional(),
  systemAttachments: z.array(SystemAttachmentSchema).optional(),

  unitAttrs: z.array(UnitAttrsSchema).optional(),
  unitModifiers: z.array(UnitModifierSchema).optional(),

  technologies: z.array(TechSchema).optional(),

  remove: z.array(z.string()).optional(), // NSIDs

  nsidToTemplateId: z.record(z.string(), z.string()).optional(),
});

export type HomebrewModuleType = z.infer<typeof HomebrewModuleSchema>;

/*
export function validateHomebrewModule(homebrew: HomebrewModuleType): void {
  HomebrewModuleSchema.parse(homebrew);
}
*/
