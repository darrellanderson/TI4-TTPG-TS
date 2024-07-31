import { Container, GameObject } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";
import { Vector } from "ttpg-mock";

export class AddCommandTokens {
  private readonly _find: Find = new Find();

  addCommandTokens(playerSlot: number, count: number): boolean {
    let nsid: string;

    nsid = "container.token.command:base/generic";
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      playerSlot,
      skipContained
    );
    if (!container) {
      return false;
    }

    nsid = "sheet:base/command";
    const sheet: GameObject | undefined = this._find.findGameObject(
      nsid,
      playerSlot
    );
    if (!sheet) {
      return false;
    }

    let pos: Vector = new Vector(33, 16, 5);
    const commandTokens: Array<GameObject> = container.getItems();
    let successCount: number = 0;
    for (let i = 0; i < count; i++) {
      const commandToken: GameObject | undefined = commandTokens.shift();
      const showAnimation: boolean = false;
      const keep: boolean = false;
      if (
        commandToken !== undefined &&
        container.take(commandToken, pos, showAnimation, keep)
      ) {
        commandToken.snapToGround();
        successCount++;
      }
      pos = pos.add([0, 2, 0]);
    }

    return successCount === count;
  }
}
