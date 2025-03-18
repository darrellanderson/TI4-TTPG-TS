import {
  Color,
  Container,
  GameObject,
  globalEvents,
  Player,
  world,
} from "@tabletop-playground/api";
import { Broadcast, IGlobal, NSID } from "ttpg-darrell";

const REPORT_DELAY_MSECS: number = 2000;

/**
 * Report players' adding/removing command tokens.
 */
export class PerContainerReportCommandTokenPutGet {
  private readonly _container: Container;

  private _timeoutHandle: NodeJS.Timeout | undefined = undefined;
  private _insertCount: number = 0;
  private _removeCount: number = 0;

  constructor(container: Container) {
    this._container = container;

    container.onInserted.add(this._onInserted);
    container.onRemoved.add(this._onRemoved);
  }

  _getMessageAndResetCounts(): string {
    const playerSlot: number = this._container.getOwningPlayerSlot();
    const playerName: string = TI4.playerName.getBySlot(playerSlot);

    const parts: Array<string> = [playerName];
    const plural: string =
      this._insertCount > 1 || this._removeCount > 1 ? "s" : "";
    if (this._insertCount > 0) {
      parts.push(`inserted ${this._insertCount}`);
      this._insertCount = 0;
    }
    if (this._removeCount > 0) {
      parts.push(`removed ${this._removeCount}`);
      this._removeCount = 0;
    }
    parts.push(`command token${plural}`);

    return parts.join(" ");
  }

  private readonly _report = (): void => {
    this._timeoutHandle = undefined;
    const playerSlot: number = this._container.getOwningPlayerSlot();
    const color: Color = world.getSlotColor(playerSlot);
    const msg: string = this._getMessageAndResetCounts();
    Broadcast.chatAll(msg, color);
  };

  private readonly _onInserted = (
    _container: Container,
    _insertedObjects: GameObject[],
    _player: Player
  ): void => {
    this._insertCount += _insertedObjects.length;
    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }
    this._timeoutHandle = setTimeout(this._report, REPORT_DELAY_MSECS);
  };

  private readonly _onRemoved = (
    _container: Container,
    _removedObject: GameObject,
    _player: Player
  ): void => {
    this._removeCount += 1;
    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }
    this._timeoutHandle = setTimeout(this._report, REPORT_DELAY_MSECS);
  };
}

export class ReportCommandTokenPutGet implements IGlobal {
  init() {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAdd(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAdd(obj);
    });
  }

  _maybeAdd(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (
      obj instanceof Container &&
      nsid === "container.token.command:base/generic"
    ) {
      new PerContainerReportCommandTokenPutGet(obj);
    }
  }
}
