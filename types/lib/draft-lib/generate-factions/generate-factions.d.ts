import { Faction } from "../../faction-lib/faction/faction";
export declare class GenerateFactions {
    /**
     * Generate random factions, with some logic to deal with Keleres.
     *
     * @param count
     */
    generate(count: number): Array<Faction>;
    _resolve(count: number, factions: Array<Faction>): Array<Faction>;
    _resolveOrThrow(count: number, factions: Array<Faction>): Array<Faction>;
}
