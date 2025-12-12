import { GameWorld, Player } from "@tabletop-playground/api";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";
import {
  Broadcast,
  DiceGroup,
  DiceGroupParams,
  DiceParams,
  DiceResult,
} from "ttpg-darrell";

export class SlashPlague extends AbstractSlashCommand {
  readonly _diceCallback = (
    diceResults: Array<DiceResult>,
    player: Player
  ): void => {
    const playerName: string = TI4.playerName.getByPlayer(player);
    const hits: number = diceResults.filter((dr) => dr.hit).length;
    const formatted: string = diceResults
      .map((dr) => DiceGroup.format(dr))
      .join(", ");
    const message: string = `${playerName} Plague (${diceResults.length}): [${formatted}] => Hits: ${hits}`;
    Broadcast.broadcastAll(message);
  };

  getSlashCommand(): `/${string}` {
    return "/plague";
  }

  getDescription(): string {
    return "'/plague N' to roll N dice infantry.";
  }

  isHostOnly(): boolean {
    return false;
  }

  run(_argv: Array<string>, player: Player): void {
    const diceCountStr: string | undefined = _argv[0] ?? "";
    const diceCount: number = parseInt(diceCountStr);

    const diceParams: Array<DiceParams> = [];
    for (let i = 0; i < diceCount; i++) {
      diceParams.push({
        sides: 10,
        hit: 6,
      });
    }

    const diceGroupParams: DiceGroupParams = {
      diceParams,
      player,
      position: player.getCursorPosition(),
      callback: this._diceCallback,
      doFakeRoll: GameWorld.getExecutionReason() === "unittest",
    };
    DiceGroup.roll(diceGroupParams);
  }
}
