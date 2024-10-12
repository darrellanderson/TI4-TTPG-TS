import { SOURCE_TO_REMOVE_NSIDS } from "../data/remove.data";

export class RemoveRegistry {
  private readonly _sourceToRemoveNsids: Map<string, Array<string>> = new Map();

  public getAllNsids(): Array<string> {
    const result: Array<string> = [];
    for (const nsids of this._sourceToRemoveNsids.values()) {
      result.push(...nsids);
    }
    return result;
  }

  public getAllSources(): Array<string> {
    return [...this._sourceToRemoveNsids.keys()];
  }

  public getRemoveBySource(source: string): Array<string> {
    const result: Array<string> | undefined =
      this._sourceToRemoveNsids.get(source);
    return [...(result ?? [])];
  }

  public load(source: string, nsids: Array<string>): this {
    if (this._sourceToRemoveNsids.has(source)) {
      throw new Error(`Source already exists: ${source}`);
    }
    this._sourceToRemoveNsids.set(source, nsids);
    return this;
  }

  public loadDefaultData(): this {
    for (const [source, nsids] of Object.entries(SOURCE_TO_REMOVE_NSIDS)) {
      this.load(source, nsids);
    }
    return this;
  }
}
