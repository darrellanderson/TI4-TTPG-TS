import { SystemAttachmentSchemaType } from "../schema/system-attachment-schema";

export const SOURCE_TO_SYSTEM_ATTACHMENT_DATA: Record<
  string,
  Array<SystemAttachmentSchemaType>
> = {
  base: [
    {
      name: "Alpha Wormhole (Creuss)",
      nsidName: "alpha-wormhole.creuss",
      wormholes: ["alpha"],
    },
  ],
  pok: [
    {
      name: "Ion Storm",
      nsidName: "ion_storm",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
  ],
};
