import { Container, GameObject, Player } from "@tabletop-playground/api";
import { Find, IGlobal, SwapSplitCombine } from "ttpg-darrell";

export class RSwapSplitCombine extends SwapSplitCombine implements IGlobal {
  private readonly _find: Find = new Find();

  constructor() {
    super([
      {
        src: {
          nsids: ["token:base/infantry-1", "unit:base/infantry"],
          count: 3,
        },
        dst: { nsid: "token:base/infantry-3", count: 1 },
        repeat: true,
      },
      {
        src: { nsids: ["token:base/fighter-1", "unit:base/fighter"], count: 3 },
        dst: { nsid: "token:base/fighter-3", count: 1 },
        repeat: true,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-1"], count: 3 },
        dst: { nsid: "token:base/tradegood-commodity-3", count: 1 },
        requireFaceUp: true,
        repeat: true,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-1"], count: 3 },
        dst: { nsid: "token:base/tradegood-commodity-3", count: 1 },
        requireFaceDown: true,
        repeat: true,
      },
      {
        src: { nsids: ["token:base/infantry-3"], count: 1 },
        dst: { nsid: "token:base/infantry-1", count: 3 },
        repeat: false,
      },
      {
        src: { nsids: ["token:base/fighter-3"], count: 1 },
        dst: { nsid: "token:base/fighter-1", count: 3 },
        repeat: false,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-3"], count: 1 },
        dst: { nsid: "token:base/tradegood-commodity-1", count: 3 },
        requireFaceUp: true,
        repeat: false,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-3"], count: 1 },
        dst: { nsid: "token:base/tradegood-commodity-1", count: 3 },
        requireFaceDown: true,
        repeat: false,
      },
      {
        src: { nsids: ["token:base/fighter-1"], count: 1 },
        dst: { nsid: "unit:base/fighter", count: 1 },
        repeat: false,
      },
      {
        src: { nsids: ["token:base/infantry-1"], count: 1 },
        dst: { nsid: "unit:base/infantry", count: 1 },
        repeat: false,
      },
      {
        src: { nsids: ["unit:base/fighter"], count: 1 },
        dst: { nsid: "token:base/fighter-1", count: 1 },
        repeat: false,
      },
      {
        src: { nsids: ["unit:base/infantry"], count: 1 },
        dst: { nsid: "token:base/infantry-1", count: 1 },
        repeat: false,
      },
    ]);

    this.addOverrideCreate(
      "unit:base/fighter",
      (player: Player): GameObject | undefined => {
        return this.getPlastic("fighter", player);
      }
    );
    this.addOverrideCreate(
      "unit:base/infantry",
      (player: Player): GameObject | undefined => {
        return this.getPlastic("infantry", player);
      }
    );
    this.addOverrideDestroy(
      "unit:base/fighter",
      (obj: GameObject, player: Player): void => {
        this.putPlastic("fighter", player, obj);
      }
    );
    this.addOverrideDestroy(
      "unit:base/infantry",
      (obj: GameObject, player: Player): void => {
        this.putPlastic("infantry", player, obj);
      }
    );
  }

  getPlasticContainer(
    unit: "infantry" | "fighter",
    player: Player
  ): Container | undefined {
    const playerSlot: number = player.getSlot();
    const nsid: string = `container.unit:base/${unit}`;
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      playerSlot,
      skipContained
    );
    return container;
  }

  getPlastic(
    unit: "infantry" | "fighter",
    player: Player
  ): GameObject | undefined {
    const container: Container | undefined = this.getPlasticContainer(
      unit,
      player
    );
    let result: GameObject | undefined = undefined;
    if (container && container.getNumItems() > 0) {
      result = container.takeAt(0, [0, 0, 0]);
    }
    return result;
  }

  putPlastic(
    unit: "infantry" | "fighter",
    player: Player,
    obj: GameObject
  ): boolean {
    const container: Container | undefined = this.getPlasticContainer(
      unit,
      player
    );
    let result: boolean = false;
    if (container) {
      container.insert([obj]);
      result = true;
    }
    return result;
  }
}
