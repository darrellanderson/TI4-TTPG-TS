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
    doNotLock: z.boolean().optional(), // do not lock the attachment

    anomalies: z.array(AnomalySchema).optional(),
    wormholes: z.array(WormholeSchema).optional(),
    wormholesFaceDown: z.array(WormholeSchema).optional(),
    isDestroyWormhole: z.boolean().optional(),

    planets: z.array(PlanetSchema).optional(),

    isIngress: z.boolean().optional(),
    isEgress: z.boolean().optional(),
    isBreachFaceUp: z.boolean().optional(),

    customModel: z.boolean().optional(), // for auto-generation, do not create round token version
  })
  .strict()
  .readonly();

export type SystemAttachmentSchemaType = z.infer<typeof SystemAttachmentSchema>;
