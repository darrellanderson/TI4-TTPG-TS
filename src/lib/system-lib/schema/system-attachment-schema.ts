import { z } from "zod";
import { AnomalySchema, WormholeSchema } from "./basic-types-schema";
import { PlanetSchema } from "./planet-schema";

export const SystemAttachmentSchema = z
  .object({
    name: z.string(),
    nsid: z.string(),

    anomalies: z.array(AnomalySchema).optional(),
    wormholes: z.array(WormholeSchema).optional(),
    wormholesFaceDown: z.array(WormholeSchema).optional(),

    planets: z.array(PlanetSchema).optional(),

    img: z.string().optional(),
    imgPackageId: z.string().optional(),
  })
  .strict();

export type SystemAttachmentSchemaType = z.infer<typeof SystemAttachmentSchema>;
