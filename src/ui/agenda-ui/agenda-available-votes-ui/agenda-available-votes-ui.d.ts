import { LongRichTextUI } from "../../button-ui/long-richtext-ui";
/**
 * Show available votes, with externally-pokable reset.
 *
 * Feature request for editable available votes, but that
 * requires persistence.  Perhaps add +/- vote tokens homebrewers can add.
 * Or a vote +- counter?  Tokens you can flip to ignore might be cleanest.
 */
export declare class AgendaAvailableVotesUI extends LongRichTextUI {
    static getAvailableVotesRichText(fontSize: number): string;
    constructor(scaledWidth: number, scale: number);
    update(): this;
}
