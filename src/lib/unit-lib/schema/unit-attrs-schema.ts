import { z } from "zod";

export const UnitSchema = z
  .enum([
    "carrier",
    "cruiser",
    "destroyer",
    "dreadnought",
    "fighter",
    "flagship",
    "infantry",
    "mech",
    "pds",
    "spacedock",
    "warsun",
  ])
  .readonly();
export type UnitType = z.infer<typeof UnitSchema>;

export const CombatAttrsSchema = z
  .object({
    dice: z.number().optional(),
    hit: z.number(),
    extraDice: z.number().optional(),
    rerollMisses: z.boolean().optional(),
    extraHitsOn: z
      .object({
        // e.g. jol-nar flagship
        count: z.number(),
        hit: z.number(),
      })
      .strict()
      .optional(),

    // TODO: better way to handle these on-offs.
    destroyInfantryInSpace: z.number().optional(), // AFB argent destroyer
    diceAsCount: z.boolean().optional(), // SpaceCombat winnu flagship
  })
  .strict()
  .readonly();
export type CombatAttrsType = z.infer<typeof CombatAttrsSchema>;

export const UnitAttrsSchema = z
  .object({
    name: z.string().min(1),
    unit: UnitSchema,
    upgradeLevel: z.number().optional(),
    cost: z.number().optional(),

    isShip: z.boolean().optional(),
    isGround: z.boolean().optional(),

    sustainDamage: z.boolean().optional(),
    planetaryShild: z.boolean().optional(),
    disablePlanetaryShield: z.boolean().optional(),

    antiFighterBarrage: CombatAttrsSchema.optional(),
    bombardment: CombatAttrsSchema.optional(),
    spaceCannon: CombatAttrsSchema.optional(),
    spaceCombat: CombatAttrsSchema.optional(),
    groundCombat: CombatAttrsSchema.optional(),
  })
  .strict()
  .readonly();
export type UnitAttrsType = z.infer<typeof UnitAttrsSchema>;
