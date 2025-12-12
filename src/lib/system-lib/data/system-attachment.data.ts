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
      name: "Frontier",
      nsidName: "frontier",
      doNotAttach: true,
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
      wormholes: ["gamma"],
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
          radius: 2.7,
          isLegendary: true,
          legendaryNsidName: "mirage-flight-academy",
        },
      ],
    },
  ],
  ["thunders-edge"]: [
    {
      name: "Avernus",
      nsidName: "avernus",
      planets: [
        {
          name: "Avernus",
          nsidName: "avernus",
          resources: 2,
          influence: 0,
          traits: ["hazardous"],
          isLegendary: true,
          legendaryNsidName: "the-nucleus",
        },
      ],
      customModel: true,
    },
    {
      name: "Thunder's Edge",
      nsidName: "thunders-edge",
      planets: [
        {
          name: "Thunder's Edge",
          nsidName: "thunders-edge",
          resources: 5,
          influence: 1,
          isLegendary: true,
          legendaryNsidName: "jupiter-brain",
          radius: 5.5,
        },
      ],
      customModel: true,
    },
    {
      name: "Ingress",
      nsidName: "ingress",
      isIngress: true,
    },
    {
      name: "Crimson Breach",
      nsidName: "crimson-breach",
      isBreachFaceUp: true,
      customModel: true,
      doNotLock: true,
    },
    {
      name: "Crimson Sever",
      nsidName: "crimson-sever",
      isDestroyWormhole: true,
      customModel: true,
      doNotLock: true,
    },
  ],
};
