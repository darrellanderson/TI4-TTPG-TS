export declare class MapStringHyperlanes {
    static get(playerCount: number): string;
    /**
     * Shift systems with an overlaying hyperlane to the closest open slot
     * (could be in another ring!), then apply the hyperlanes to the map string.
     *
     * @param mapString
     * @param playerCount
     * @returns
     */
    addHyperlanes(mapString: string, hyperlanesMapString: string): string;
}
