import { PlanetAttachmentSchemaType } from "../schema/planet-attachment-schema";

export const SOURCE_TO_PLANET_ATTACHMENT_DATA: Record<
  string,
  Array<PlanetAttachmentSchemaType>
> = {
  pok: [
    {
      name: "Demilitarized Zone",
      nsidName: "dmz",
      isDestroyPlanet: true,
    },
    {
      name: "Stellar Converter",
      nsidName: "stellar_converter",
      isDestroyPlanet: true,
    },
  ],
};
