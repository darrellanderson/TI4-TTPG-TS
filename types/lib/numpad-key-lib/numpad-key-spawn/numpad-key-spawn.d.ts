export declare class NumpadKeySpawn {
    private readonly _keyToNsid;
    private readonly _onScriptButtonPressed;
    constructor(keyToNsid: Record<number, string>);
    destroy(): void;
}
