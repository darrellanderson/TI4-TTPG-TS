import { z } from "zod";
import {
  AnomalySchema,
  NsidNameSchema,
  WormholeSchema,
} from "./basic-types-schema";
import { PlanetSchema } from "./planet-schema";

export const SystemAttachmentSchema = z
  .object({
    name: z.string(),
    nsidName: NsidNameSchema, // NSID "token.attachment.system:${source}/${nsidName}"

    anomalies: z.array(AnomalySchema).optional(),
    wormholes: z.array(WormholeSchema).optional(),
    wormholesFaceDown: z.array(WormholeSchema).optional(),

    planets: z.array(PlanetSchema).optional(),

    imgFaceDown: z.boolean().optional(),
    imgPackageId: z.string().optional(),
  })
  .strict()
  .readonly();

export type SystemAttachmentSchemaType = z.infer<typeof SystemAttachmentSchema>;
