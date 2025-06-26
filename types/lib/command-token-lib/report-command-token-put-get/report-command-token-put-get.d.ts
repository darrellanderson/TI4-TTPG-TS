import { Container, GameObject } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
/**
 * Report players' adding/removing command tokens.
 */
export declare class PerContainerReportCommandTokenPutGet {
    private readonly _container;
    private _timeoutHandle;
    private _insertCount;
    private _removeCount;
    constructor(container: Container);
    _getMessageAndResetCounts(): string;
    private readonly _report;
    private readonly _onInserted;
    private readonly _onRemoved;
}
export declare class ReportCommandTokenPutGet implements IGlobal {
    init(): void;
    _maybeAdd(obj: GameObject): void;
}
