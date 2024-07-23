import { z } from "zod";

import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";
import { UnitSchema } from "../../unit-lib/schema/unit-attrs-schema";

export const FactionSchema = z
  .object({
    name: z.string(),
    nsidName: NsidNameSchema,

    // Automatic units (flagship, carrier, etc), NOT mech or upgrades.
    unitOverrides: z.array(NsidNameSchema),

    abilities: z.array(NsidNameSchema),
    techs: z.array(NsidNameSchema),
    startingTechs: z.array(NsidNameSchema),
    startingUnits: z.map(UnitSchema, z.number().int().min(0)),
  })
  .strict()
  .readonly();
