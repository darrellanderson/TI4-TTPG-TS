import { GameObject, Vector, world } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class TFSetupFactionSheets {
  setup(): void {
    const nsids: Array<string> = [
      "sheet.faction:twilights-fall/tf-black",
      "sheet.faction:twilights-fall/tf-blue",
      "sheet.faction:twilights-fall/tf-green",
      "sheet.faction:twilights-fall/tf-orange",
      "sheet.faction:twilights-fall/tf-pink",
      "sheet.faction:twilights-fall/tf-purple",
      "sheet.faction:twilights-fall/tf-red",
      "sheet.faction:twilights-fall/tf-yellow",
    ];

    const find: Find = new Find();
    const matNsid: string = "mat.deck:twilights-fall/twilights-fall";
    const owningPlayerSlot: number | undefined = undefined;
    const skipContained = true;
    const mat: GameObject | undefined = find.findGameObject(
      matNsid,
      owningPlayerSlot,
      skipContained
    );
    if (!mat) {
      throw new Error(`Could not find mat for ${matNsid}`);
    }

    const sheets: Array<GameObject> = nsids.map((nsid): GameObject => {
      return TI4.spawn.spawnOrThrow(nsid);
    });
    const firstSheet: GameObject | undefined = sheets[0];
    if (!firstSheet) {
      throw new Error(`Could not find first sheet for ${nsids.join(", ")}`);
    }

    const matExtent: Vector = mat.getExtent(false, false);
    const sheetExtent: Vector = firstSheet.getExtent(false, false);

    const first: Vector = mat.getPosition();
    first.x -= matExtent.x + sheetExtent.x + 5;

    const dY: number = -15;
    const z: number = world.getTableHeight() + 10;

    sheets.forEach((sheet: GameObject, index: number): void => {
      const pos: Vector = new Vector(first.x, first.y + dY * index, z);
      sheet.setScale([0.5, 0.5, 1]);
      sheet.setPosition(pos);
      sheet.snapToGround();
    });
  }
}
