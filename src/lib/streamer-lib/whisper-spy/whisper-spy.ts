import { Color, globalEvents, Player, world } from "@tabletop-playground/api";
import { Broadcast, IGlobal, NamespaceId, PlayerSlot } from "ttpg-darrell";

/**
 * Report whisper CONTENTS to the streamer.
 */
export class WhisperSpy implements IGlobal {
  private readonly _namespaceId: NamespaceId;
  private readonly _reportToPlayerNames: Set<string> = new Set();

  private readonly _onWhisper = (
    sender: Player,
    recipient: Player,
    message: string
  ): void => {
    const src: string = TI4.playerName.getByPlayer(sender);
    const srcColor: Color = world.getSlotColor(sender.getSlot());
    const dst: string = TI4.playerName.getByPlayer(recipient);
    const spyMsg: string = `[WHISPER SPY ${src} -> ${dst}: ${message}]`;
    for (const player of world.getAllPlayers()) {
      if (this._reportToPlayerNames.has(player.getName())) {
        if (this.isLegalReportTo(player)) {
          Broadcast.chatOne(player, spyMsg, srcColor);
        } else {
          const errMsg: string =
            "[WHISPER SPY: <error, can only report to unseated observers>]";
          Broadcast.chatOne(player, errMsg, Broadcast.ERROR);
        }
      }
    }
  };

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;
    this._load();
  }

  init(): void {
    globalEvents.onWhisper.add(this._onWhisper);
  }

  /**
   * To prevent abuse, only report to unseated players.
   *
   * @param player
   */
  isLegalReportTo(player: Player): boolean {
    const playerSlot: PlayerSlot = player.getSlot();
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
    return seatIndex === -1;
  }

  hasReportTo(player: Player): boolean {
    return this._reportToPlayerNames.has(player.getName());
  }

  addReportTo(player: Player): void {
    const playerName: string = player.getName();
    this._reportToPlayerNames.add(playerName);
    this._save();
  }

  removeReportTo(player: Player): void {
    const playerName: string = player.getName();
    this._reportToPlayerNames.delete(playerName);
    this._save();
  }

  private _save(): void {
    const json: string = JSON.stringify(Array.from(this._reportToPlayerNames));
    world.setSavedData(json, this._namespaceId);
  }

  private _load(): void {
    const json: string | undefined = world.getSavedData(this._namespaceId);
    if (json && json.length > 0) {
      const names: Array<string> = JSON.parse(json);
      this._reportToPlayerNames.clear();
      for (const name of names) {
        this._reportToPlayerNames.add(name);
      }
    }
  }
}
