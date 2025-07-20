import { Player } from "@tabletop-playground/api";
import { PerfWidget } from "ttpg-darrell";
import { AbstractSlashCommand } from "../abstract-slash-command/abstract-slash-command";

export class SlashPerf extends AbstractSlashCommand {
  private _perfWidget: PerfWidget | undefined = undefined;

  getSlashCommand(): `/${string}` {
    return "/perf";
  }

  getDescription(): string {
    return "Toggle the performance widget (FPS).";
  }

  isHostOnly(): boolean {
    return true;
  }

  run(_argv: Array<string>, player: Player): void {
    if (this._perfWidget) {
      this._perfWidget.detach().destroy();
      this._perfWidget = undefined;
    } else {
      this._perfWidget = new PerfWidget()
        .toggleVisibility(player.getSlot())
        .attachToScreen();
    }
  }
}
