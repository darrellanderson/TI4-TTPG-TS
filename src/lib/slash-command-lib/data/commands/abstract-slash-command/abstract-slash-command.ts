import { Player } from "@tabletop-playground/api";

export abstract class AbstractSlashCommand {
  abstract getSlashCommand(): `/${string}`;
  abstract isHostOnly(): boolean;
  abstract run(argv: Array<string>, player: Player): void;
}
