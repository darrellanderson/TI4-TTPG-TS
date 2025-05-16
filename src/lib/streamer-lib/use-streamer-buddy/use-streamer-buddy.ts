import { world } from "@tabletop-playground/api";
import {
  IGlobal,
  NamespaceId,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";
import { GameData } from "../../game-data-lib/game-data/game-data";

export class UseStreamerBuddy implements IGlobal {
  public readonly onStreamerBuddyChanged = new TriggerableMulticastDelegate<
    (isActive: boolean) => void
  >();

  private readonly _namespaceId: NamespaceId;
  private _useStreeamerBuddy: boolean = false;

  readonly _onGameData = (gameData: GameData): void => {
    if (this._useStreeamerBuddy) {
      const json: string = JSON.stringify(gameData);
      const url: string = `http://localhost:8080/postkey_ttpg?key=buddy&timestamp=${TI4.config.timestamp}`;
      const fetchOptions = {
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: json,
        method: "POST",
      };
      fetch(url, fetchOptions);
    }
  };

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;
    this._load();
  }

  init(): void {
    TI4.events.onGameData.add(this._onGameData);
  }

  getUseStreamerBuddy(): boolean {
    return this._useStreeamerBuddy;
  }

  setUseStreamerBuddy(useStreamerBuddy: boolean): void {
    this._useStreeamerBuddy = useStreamerBuddy;
    this._save();
    this.onStreamerBuddyChanged.trigger(this._useStreeamerBuddy);
  }

  private _load(): void {
    const json: string | undefined = world.getSavedData(this._namespaceId);
    if (json && json.length > 0) {
      this._useStreeamerBuddy = JSON.parse(json);
    }
  }

  private _save(): void {
    const json: string = JSON.stringify(this._useStreeamerBuddy);
    world.setSavedData(json, this._namespaceId);
  }
}
