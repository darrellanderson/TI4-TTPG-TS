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
}
