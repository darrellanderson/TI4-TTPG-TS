import { CombatAttrsSchemaType } from "../schema/unit-attrs-schema";
export declare class CombatAttrs {
    private _crit?;
    private _critCount;
    private _dice;
    private _extraDice;
    private _hit;
    private _rerollMisses;
    private _range;
    constructor(params: CombatAttrsSchemaType);
    /**
     * Apply overrides to the given attributes.
     * If an attribute is missing, do not change it.
     *
     * @param override
     * @returns
     */
    applyOverride(override: CombatAttrsSchemaType): this;
    addHit(delta: number): this;
    addDice(delta: number): this;
    addExtraDice(delta: number): this;
    getCrit(): number | undefined;
    getCritCount(): number;
    getDice(): number;
    getExtraDice(): number;
    getHit(): number;
    getRange(): number;
    getRerollMisses(): boolean;
    setCrit(value: number | undefined): this;
    setCritCount(value: number): this;
    setDice(value: number): this;
    setExtraDice(value: number): this;
    setHit(value: number): this;
    setRange(value: number): this;
    setRerollMisses(value: boolean): this;
}
