import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";

export class Faction {
  getAbilityNsidNames(): Array<NsidNameSchemaType> {
    return ["my-ability"];
  }

  getFlagshipNsidNames(): Array<NsidNameSchemaType> {
    return ["my-flagship"];
  }

  getHomeSystemTileNumber(): number {
    return 1;
  }

  getSource(): NsidNameSchemaType {
    return "my-source";
  }
}
