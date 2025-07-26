import { DraftState } from "../draft-state/draft-state";
export declare class DraftActivityFinish {
    private readonly _draftState;
    private readonly _find;
    constructor(draftState: DraftState);
    finishAll(): this;
    movePlayersToSeats(): this;
    moveSpeakerToken(): this;
    unpackFactions(): this;
    unpackMap(): this;
    setTurnOrder(): this;
    dealMinorFactionAlliances(): this;
}
