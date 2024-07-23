import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";

export class Faction {
  getAbilityNsids(): Array<string> {
    return [];
  }

  getFlagshipNsids(): Array<string> {
    return [];
  }

  getHomeSystemTileNumber(): number {
    return 0;
  }

  getNsid(): NsidNameSchemaType {
    return "";
  }

  getPromissoryNsids(): Array<string> {
    return [];
  }
}
