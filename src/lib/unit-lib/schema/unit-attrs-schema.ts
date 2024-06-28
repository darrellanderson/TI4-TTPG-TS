import { z } from "zod";
import { NsidNameSchema } from "../../system-lib/schema/basic-types-schema";

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
    dice: z.number().optional(), // N dice per object
    hit: z.number(), // hit in N or better
    extraDice: z.number().optional(), // N extra dice overall (not per object)
    rerollMisses: z.boolean().optional(),
    crit: z.number().optional(), // crit on N or better, e.g. jol-nar flagship
    critCount: z.number().optional(), // N extra hits on crit
    range: z.number().optional(), // range in hexes: 0=local, 1=adjacent
  })
  .strict()
  .readonly();
export type CombatAttrsSchemaType = z.infer<typeof CombatAttrsSchema>;

export const UnitAttrsSchema = z
  .object({
    name: z.string().min(1), // e.g. "Carrier II"
    unit: UnitSchema, // base unit type, unit upgrades overrride
    componentCount: z.number().optional(), // component count, e.g. fighters = 10

    // Faction attr or tech ("card.technology.unit:{source}/{nsidName}").
    // Missing: base unit, "x": faction base unit, "x-2": unit upgrade.
    nsidName: NsidNameSchema.optional(),

    cost: z.number().optional(),
    producePerCost: z.number().optional(), // e.g. 2 for fighters

    isShip: z.boolean().optional(),
    isGround: z.boolean().optional(),

    sustainDamage: z.boolean().optional(),
    planetaryShield: z.boolean().optional(),
    disablePlanetaryShield: z.boolean().optional(),

    antiFighterBarrage: CombatAttrsSchema.optional(),
    bombardment: CombatAttrsSchema.optional(),
    spaceCannon: CombatAttrsSchema.optional(),
    spaceCombat: CombatAttrsSchema.optional(),
    groundCombat: CombatAttrsSchema.optional(),

    // Destroyer Strike Wing Alpha 2's AFB can destroy infantry in space.
    afbDestroyInfantryInSpace: z.number().optional(),
  })
  .strict()
  .readonly();
export type UnitAttrsSchemaType = z.infer<typeof UnitAttrsSchema>;
