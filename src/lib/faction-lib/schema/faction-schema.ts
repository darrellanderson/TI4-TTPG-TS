import { z } from "zod";

import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";

export const FactionSchema = z
  .object({
    nsidName: NsidNameSchema,

    name: z.string().min(1), // human-readable name
    abbr: z.string().min(1), // abbreviation

    abilities: z.array(NsidNameSchema),
    commodities: z.number().int().min(0),
    factionTechs: z.array(NsidNameSchema).length(2),
    home: z.number().int().min(0),
    homeSurrogate: z.number().int().min(0).optional(), // home is off-map, place this tile in home pos
    leaders: z
      .object({
        agents: z.array(NsidNameSchema),
        commanders: z.array(NsidNameSchema),
        heroes: z.array(NsidNameSchema),
        mechs: z.array(NsidNameSchema),
      })
      .strict()
      .readonly(),
    promissories: z.array(NsidNameSchema),
    startingTechs: z.array(NsidNameSchema),
    startingUnits: z
      .object({
        carrier: z.number().int().min(0).optional(),
        cruiser: z.number().int().min(0).optional(),
        destroyer: z.number().int().min(0).optional(),
        dreadnought: z.number().int().min(0).optional(),
        fighter: z.number().int().min(0).optional(),
        flagship: z.number().int().min(0).optional(),
        infantry: z.number().int().min(0).optional(),
        mech: z.number().int().min(0).optional(),
        pds: z.number().int().min(0).optional(),
        spaceDock: z.number().int().min(0).optional(),
        warSun: z.number().int().min(0).optional(),
      })
      .strict()
      .readonly(),
    unitOverrides: z.array(NsidNameSchema), // automatic units (flagship, etc), NOT mech or upgrades (those have cards)

    extras: z
      .array(
        z
          .object({
            nsid: z.string(),
            count: z.number().int().min(0).optional(),
          })
          .strict()
          .readonly()
      )
      .optional(),
  })
  .strict()
  .readonly();

export type FactionSchemaType = z.infer<typeof FactionSchema>;
