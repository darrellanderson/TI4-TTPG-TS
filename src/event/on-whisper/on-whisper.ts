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
  private static __sound: Sound | undefined = undefined;

  static chirpAtPlayer(player: Player): void {
    const startTime: number = 0;
    const volume: number = 1;
    const loop: boolean = false;
    const players: PlayerPermission = new PlayerPermission().addPlayer(player);
    const sound: Sound | undefined = OnWhisper.__sound;
    if (sound) {
      sound.play(startTime, volume, loop, players);
    }
  }

  private readonly _onWhisper = (
    _sender: Player,
    recipient: Player,
    _message: string
  ): void => {
    OnWhisper.chirpAtPlayer(recipient);
  };

  init(): void {
    OnWhisper.__sound = world.importSound("digi-blip-hi-2x.flac", packageId);
    globalEvents.onWhisper.add(this._onWhisper);
  }
}
