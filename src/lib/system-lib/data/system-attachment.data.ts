import { SystemAttachmentSchemaType } from "../schema/system-attachment-schema";

export const SOURCE_TO_SYSTEM_ATTACHMENT_DATA: Record<
  string,
  Array<SystemAttachmentSchemaType>
> = {
  base: [
    {
      name: "Alpha Wormhole (Creuss)",
      nsidName: "wormhole-alpha.creuss",
      imgFaceDown: true,
      wormholes: ["alpha"],
    },
    {
      name: "Beta Wormhole (Creuss)",
      nsidName: "wormhole-beta.creuss",
      imgFaceDown: true,
      wormholes: ["beta"],
    },
  ],
  pok: [
    {
      name: "Dimensional Tear",
      nsidName: "dimensional-tear.vuilraith",
      imgFaceDown: true,
      anomalies: ["gravity-rift"],
    },
    {
      name: "Dimensional Tear",
      nsidName: "dimensional-tear.nekro",
      imgFaceDown: true,
      anomalies: ["gravity-rift"],
    },
    {
      name: "Ion Storm",
      nsidName: "ion-storm",
      imgFaceDown: true,
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    },
    {
      name: "Gamma Wormhole",
      //cardNsid: "card.exploration.cultural:pok/gamma-wormhole",
      nsidName: "wormhole-gamma",
    },
    {
      name: "Gamma Wormhole (Creuss)",
      nsidName: "wormhole-gamma.creuss",
      imgFaceDown: true,
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
