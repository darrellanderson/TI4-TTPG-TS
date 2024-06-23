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
    {
      name: "Beta Wormhole (Creuss)",
      nsidName: "beta-wormhole.creuss",
      wormholes: ["beta"],
    },
  ],
  pok: [
    {
      name: "Dimensional Tear",
      nsidName: "dimensional-tear",
      anomalies: ["gravity-rift"],
    },
    {
      name: "Ion Storm",
      nsidName: "ion-storm",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    {
      name: "Gamma Relay",
      //cardNsid: "card.exploration.frontier:pok/gamma-relay",
      nsidName: "gamma-relay",
    },
    {
      name: "Gamma Wormhole",
      //cardNsid: "card.exploration.cultural:pok/gamma-wormhole",
      nsidName: "gamma-wormhole",
    },
    {
      name: "Gamma Wormhole (Creuss)",
      nsidName: "gamma-wormhole.creuss",
      wormholes: ["gamma"],
    },
    {
      name: "Mirage",
      //cardNsid: "card.exploration.frontier:pok/mirage",
      nsidName: "mirage",
      planets: [
        {
          name: "Mirage",
          nsidName: "mirage",
          resources: 1,
          influence: 2,
          traits: ["cultural"],
          localPosition: { x: 3, y: -1.88 },
          radius: 3,
          isLegendary: true,
          legendaryNsidName: "mirage-flight-academy",
        },
      ],
    },
  ],
};
