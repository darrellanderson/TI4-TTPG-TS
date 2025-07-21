export declare abstract class AbstractValidate {
    abstract getCommandName(): string;
    abstract getDescription(): string;
    /**
     * Get the errors from the validation.
     * @param errors The array to populate with errors.
     */
    abstract getErrors(errors: Array<string>): void;
    /**
     * Get the set of card NSIDs where the registered decks match the nsid prefix.
     *
     * @param cardNsidPrefix
     * @returns
     */
    getCardNsids(cardNsidPrefix: string): Set<string>;
    /**
     * Return items in src that are not in dst.
     *
     * @param src
     * @param dst
     * @returns
     */
    getSrcMissingFromDst(src: Set<string>, dst: Set<string>): Array<string>;
}
