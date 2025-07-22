import {
  GameObject,
  ObjectType,
  Vector,
  world,
} from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { RemoveByNsidOrSource } from "../remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";
import { LayoutAll } from "../../setup/layout/layout-all/layout-all";
import { scrubAll } from "../../setup/layout/layout-all/scrub-all";
import { Scoreboard } from "../score-lib/scoreboard/scoreboard";

export class StartGame implements IGlobal {
  private readonly _onStartGameRequest = (): void => {
    TI4.config.setTimestamp(Date.now() / 1000);
    TI4.timer.start(0, 1); // count up from zero

    this._applyPlayerCount();
    this._doRemove();
    this._maybeFlipScoreboard();

    TI4.events.onStartGameComplete.trigger();
  };

  init(): void {
    TI4.events.onStartGameRequest.add(this._onStartGameRequest);
  }

  _applyPlayerCount(): void {
    const currentCount = TI4.playerSeats.getAllSeats().length;
    if (currentCount === TI4.config.playerCount) {
      return; // already correct
    }

    scrubAll(undefined);

    const z: number = world.getTableHeight();
    const pos: Vector = new Vector(0, 0, z + 3);
    const yaw: number = 0;

    const playerCount: number = TI4.config.playerCount;
    const layout: LayoutAll = new LayoutAll(playerCount);
    layout.getLayout().doLayoutAtPoint(pos, yaw);
    world.resetScripting(); // mostly for the icon containers, they move at the end of layout
  }

  _doRemove(): void {
    const remove: RemoveByNsidOrSource =
      TI4.removeRegistry.createRemoveFromRegistryAndConfig();
    remove.removeAll();
  }

  _maybeFlipScoreboard(): void {
    const scoreboardLib: Scoreboard = new Scoreboard();
    const scoreboard: GameObject | undefined = scoreboardLib.getScoreboard();
    if (TI4.config.gamePoints > 10 && scoreboard) {
      const above: Vector = scoreboard.getPosition().add(new Vector(0, 0, 3));
      scoreboard.setObjectType(ObjectType.Regular);
      scoreboard.setPosition(above);
      scoreboard.setRotation([0, 0, 180]);
      scoreboard.snapToGround();
      scoreboard.setObjectType(ObjectType.Ground);
    }
    scoreboardLib.applyGamePoints(TI4.config.gamePoints);
  }
}
