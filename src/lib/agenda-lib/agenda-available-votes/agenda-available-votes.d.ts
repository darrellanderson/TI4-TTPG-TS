import { Card } from "@tabletop-playground/api";
import { PlayerSlot } from "ttpg-darrell";
export declare class AgendaAvailableVotes {
    private readonly _cardUtil;
    private readonly _find;
    _getPlayerSlotToPerPlanetBonus(): Map<PlayerSlot, number>;
    _isRepresentativeGovernment(): boolean;
    _getXxekirGromOmegaPlayerSlots(): Set<PlayerSlot>;
    _getFaceUpPlanetCards(): Array<Card>;
    getPlayerSlotToAvailableVotes(): Map<PlayerSlot, number>;
}
