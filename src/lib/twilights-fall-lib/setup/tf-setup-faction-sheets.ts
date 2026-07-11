import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, Shuffle } from "ttpg-darrell";

const KEY_TF_DRAFT_FACTIONS: string = "__tfDraftFactions";

export class TFSetupFactionSheets {
  static getChosenFactionNsidNames(): Array<string> {
    const configStr: string | undefined = world.getSavedData(
      KEY_TF_DRAFT_FACTIONS,
    );
    if (!configStr) {
      throw new Error("No saved data for chosen factions");
    }
    return JSON.parse(configStr);
  }

  static setChosenFactionNsidNames(
    chosenFactionNsidNames: Array<string>,
  ): void {
    const configStr: string = JSON.stringify(chosenFactionNsidNames);
    world.setSavedData(configStr, KEY_TF_DRAFT_FACTIONS);
  }

  _getFactionSheetNsid(factionNsidName: string): string {
    return `sheet.faction:twilights-fall/${factionNsidName}`;
  }

  setup(): void {
    const factionNsidNames: Array<string> = [
      "tf-black",
      "tf-blue",
      "tf-green",
      "tf-orange",
      "tf-pink",
      "tf-purple",
      "tf-red",
      "tf-yellow",
    ].sort();
    const chosenFactionNsidNames: Array<string> = new Shuffle<string>()
      .shuffle(factionNsidNames)
      .slice(0, TI4.config.playerCount)
      .sort()
      .reverse(); // draft UI renders bottom to top
    console.log(
      "TFSetupFactionSheets chosen factions:",
      chosenFactionNsidNames,
    );
    TFSetupFactionSheets.setChosenFactionNsidNames(chosenFactionNsidNames);

    const find: Find = new Find();
    const matNsid: string = "mat.deck:twilights-fall/twilights-fall";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained = true;
    const mat: GameObject | undefined = find.findGameObject(
      matNsid,
      owningPlayerSlot,
      skipContained,
    );
    if (!mat) {
      throw new Error(`Could not find mat for ${matNsid}`);
    }
    const matExtent: Vector = mat.getExtent(false, false);

    let nextPos: Vector | undefined = undefined;
    factionNsidNames.forEach((factionNsidName: string): void => {
      const sheetNsid: string = this._getFactionSheetNsid(factionNsidName);
      const sheet: GameObject = TI4.spawn.spawnOrThrow(sheetNsid);
      sheet.setScale([0.5, 0.5, 1]);

      const sheetExtent: Vector = sheet.getExtent(false, false);
      if (!nextPos) {
        const bottomRightAndAbove: Vector = mat
          .getPosition()
          .add(new Vector(-matExtent.x, matExtent.y, 10));
        nextPos = bottomRightAndAbove.add([
          -sheetExtent.x - 5,
          -sheetExtent.y,
          0,
        ]);
      } else {
        nextPos.y -= sheetExtent.y * 2 + 1;
      }
      sheet.setPosition(nextPos);
      sheet.snapToGround();

      // If not in the chosen set, shrink more.
      if (!chosenFactionNsidNames.includes(factionNsidName)) {
        sheet.setScale([0.25, 0.25, 1]);
      }
    });
  }
}
