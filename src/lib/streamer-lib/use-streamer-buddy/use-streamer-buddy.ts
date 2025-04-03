import { world } from "@tabletop-playground/api";
import { IGlobal, NamespaceId } from "ttpg-darrell";

export class UseStreamerBuddy implements IGlobal {
  private readonly _namespaceId: NamespaceId;
  private _useStreeamerBuddy: boolean = false;
  private _intervalHandle: NodeJS.Timeout | undefined = undefined;

  readonly _intervalRunnable: () => void = () => {
    // TODO XXX
  };

  constructor(namespaceId: NamespaceId) {
    this._namespaceId = namespaceId;
    this._load();
  }

  init(): void {
    this._load();
    if (this._useStreeamerBuddy) {
      this._startUsingStreamerBuddy();
    }
  }

  getUseStreamerBuddy(): boolean {
    return this._useStreeamerBuddy;
  }

  setUseStreamerBuddy(useStreamerBuddy: boolean): void {
    this._useStreeamerBuddy = useStreamerBuddy;
    this._save();

    if (this._intervalHandle) {
      clearInterval(this._intervalHandle);
      this._intervalHandle = undefined;
    }
    if (this._useStreeamerBuddy) {
      this._startUsingStreamerBuddy();
    }
  }

  private _startUsingStreamerBuddy(): void {
    this._intervalHandle = setInterval(this._intervalRunnable, 3000);
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
