import { HexType } from "ttpg-darrell";
export declare class RefreshAllPlanets {
    private readonly _cardUtil;
    _getSystemHexes(): Set<HexType>;
    /**
     * Refresh all planet cards that are not on a system hex or in a card holder.
     */
    refresh(alsoRefreshTechAgentRelic: boolean): void;
}
