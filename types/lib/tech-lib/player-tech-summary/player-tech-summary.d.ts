import { Tech } from "../tech/tech";
import { TechColorType } from "../schema/tech-schema";
export declare class PlayerTechSummary {
    private readonly _cardUtil;
    private readonly _find;
    private readonly _ownedTechNsids;
    private readonly _techColorToOwnedCount;
    static _getOwnedTechs(playerSlot: number): Array<Tech>;
    constructor(playerSlot: number);
    isOwned(techNsid: string): boolean;
    getOwnedCount(color: TechColorType): number;
}
