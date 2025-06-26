import { GameObject } from "@tabletop-playground/api";
import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
export type InitiativeEntry = {
    playerSlot: number;
    initiative: number;
    strategyCards: Array<GameObject>;
};
export declare class InitiativeOrder {
    private readonly _find;
    private readonly _playerSeats;
    static getStrategyCardNsidNameFirst(obj: GameObject): NsidNameSchemaType | undefined;
    _isAtopStrategyCardMat(strategyCard: GameObject): boolean;
    get(): Array<InitiativeEntry>;
    setTurnOrderFromStrategyCards(): void;
}
