import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";

export class Faction {
  getAbilityNsids(): Array<string> {
    return ["faction-ability:my-source/my-ability"];
  }

  getFlagshipNsids(): Array<string> {
    return ["flagship:my-source/my-flagship"];
  }

  getHomeSystemTileNumber(): number {
    return 1;
  }

  getNsid(): NsidNameSchemaType {
    return "faction:my-source/my-faction";
  }
}
