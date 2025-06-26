import { IGlobal, PlayerSlot } from "ttpg-darrell";
export declare const ACTION_REPORT_ACTION_CARDS: string;
export declare const ACTION_REPORT_PROMISSORY_NOTES: string;
export declare const ACTION_REPORT_SECRET_OBJECTIVES: string;
export type ReportCardType = "action" | "promissory" | "secret";
/**
 * Yssaril commander "card.leader.commander:pok/so-ata"
 * or alliance: "card.alliance:pok/yssaril"
 * "After another player activates a system that contains your units: You may
 * look at that player's action cards, promissory notes, or secret objectives."
 */
export declare abstract class AbstractSoAta implements IGlobal {
    private readonly _find;
    private readonly _cardNsid;
    private readonly _onCustomAction;
    constructor(cardNsid: string);
    init(): void;
    _getReportCardType(customActionName: string): ReportCardType | undefined;
    _getCards(reportCardType: ReportCardType, playerSlot: PlayerSlot): Array<string>;
    _doReport(reportCardType: ReportCardType, clickingPlayerSlot: PlayerSlot, reportToPlayerSlot: PlayerSlot, cardNames: Array<string>): void;
}
