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
    imgFaceDown: z.boolean().optional(), // has separate back image?
    doNotAttach: z.boolean().optional(), // do not attach, or add to registry
    scaleModel: z.number().optional(), // override default x/y size

    anomalies: z.array(AnomalySchema).optional(),
    wormholes: z.array(WormholeSchema).optional(),
    wormholesFaceDown: z.array(WormholeSchema).optional(),
    isDestroyWormhole: z.boolean().optional(),

    planets: z.array(PlanetSchema).optional(),
  })
  .strict()
  .readonly();

export type SystemAttachmentSchemaType = z.infer<typeof SystemAttachmentSchema>;
