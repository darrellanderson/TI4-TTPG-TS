import {
  globalEvents,
  Player,
  PlayerPermission,
  refPackageId,
  Sound,
  world,
} from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

const packageId: string = refPackageId;

export class OnWhisper implements IGlobal {
  static readonly __sound: Sound = world.importSound(
    "digi-blip-hi-2x.flac",
    packageId
  );

  static chirpAtPlayer(player: Player): void {
    const startTime: number = 0;
    const volume: number = 1;
    const loop: boolean = false;
    const players: PlayerPermission = new PlayerPermission().addPlayer(player);
    OnWhisper.__sound.play(startTime, volume, loop, players);
  }

  private readonly _onWhisper = (
    _sender: Player,
    recipient: Player,
    _message: string
  ): void => {
    OnWhisper.chirpAtPlayer(recipient);
  };

  init(): void {
    globalEvents.onWhisper.add(this._onWhisper);
  }
}
