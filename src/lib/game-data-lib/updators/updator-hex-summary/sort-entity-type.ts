import { EntityType } from "./hex-summary-codes";

export class SortEntityType {
  sort(entityTypes: Array<EntityType>): void {
    entityTypes.sort((a: EntityType, b: EntityType) => {
      // Sort by region.
      const aPlanetIndex: number = a.planetIndex;
      const bPlanetIndex: number = b.planetIndex;
      if (aPlanetIndex < bPlanetIndex) {
        return -1;
      } else if (aPlanetIndex > bPlanetIndex) {
        return 1;
      }

      // Attachments always last.
      const aAttachment: number = a.attachment ? 1 : 0;
      const bAttachment: number = b.attachment ? 1 : 0;
      if (aAttachment < bAttachment) {
        return -1;
      } else if (aAttachment > bAttachment) {
        return 1;
      }

      // Sort by color.
      const aColor = a.colorCode ?? "";
      const bColor = b.colorCode ?? "";
      if (aColor < bColor) {
        return -1;
      } else if (aColor > bColor) {
        return 1;
      }

      // Move tokens to back of region-color list.
      // (Why?  This is the way the other encoder did things, keep it.)
      const aToken: number = a.token ? 1 : 0;
      const bToken: number = b.token ? 1 : 0;
      if (aToken < bToken) {
        return -1;
      } else if (aToken > bToken) {
        return 1;
      }

      // Sort by increasing count.
      const aCount: number = a.count;
      const bCount: number = b.count;
      if (aCount < bCount) {
        return -1;
      } else if (aCount > bCount) {
        return 1;
      }

      // Arbitrary but consistent final tie breaker.
      const aCode: string = a.code;
      const bCode: string = b.code;
      if (aCode < bCode) {
        return -1;
      }
      return 1;
    });
  }
}
