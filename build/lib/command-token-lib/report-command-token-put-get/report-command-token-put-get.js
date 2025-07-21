"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCommandTokenPutGet = exports.PerContainerReportCommandTokenPutGet = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const REPORT_DELAY_MSECS = 2000;
/**
 * Report players' adding/removing command tokens.
 */
class PerContainerReportCommandTokenPutGet {
    constructor(container) {
        this._timeoutHandle = undefined;
        this._insertCount = 0;
        this._removeCount = 0;
        this._report = () => {
            this._timeoutHandle = undefined;
            const playerSlot = this._container.getOwningPlayerSlot();
            const color = api_1.world.getSlotColor(playerSlot);
            const msg = this._getMessageAndResetCounts();
            ttpg_darrell_1.Broadcast.chatAll(msg, color);
        };
        this._onInserted = (_container, _insertedObjects, _player) => {
            this._insertCount += _insertedObjects.length;
            if (this._timeoutHandle) {
                clearTimeout(this._timeoutHandle);
            }
            this._timeoutHandle = setTimeout(this._report, REPORT_DELAY_MSECS);
        };
        this._onRemoved = (_container, _removedObject, _player) => {
            this._removeCount += 1;
            if (this._timeoutHandle) {
                clearTimeout(this._timeoutHandle);
            }
            this._timeoutHandle = setTimeout(this._report, REPORT_DELAY_MSECS);
        };
        this._container = container;
        container.onInserted.add(this._onInserted);
        container.onRemoved.add(this._onRemoved);
    }
    _getMessageAndResetCounts() {
        const playerSlot = this._container.getOwningPlayerSlot();
        const playerName = TI4.playerName.getBySlot(playerSlot);
        const parts = [playerName];
        const plural = this._insertCount > 1 || this._removeCount > 1 ? "s" : "";
        if (this._insertCount > 0) {
            parts.push(`inserted ${this._insertCount}`);
            this._insertCount = 0;
        }
        if (this._removeCount > 0) {
            parts.push(`removed ${this._removeCount}`);
            this._removeCount = 0;
        }
        parts.push(`command token${plural}`);
        return parts.join(" ");
    }
}
exports.PerContainerReportCommandTokenPutGet = PerContainerReportCommandTokenPutGet;
class ReportCommandTokenPutGet {
    init() {
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeAdd(obj);
        }
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeAdd(obj);
        });
    }
    _maybeAdd(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (obj instanceof api_1.Container &&
            nsid === "container.token.command:base/generic") {
            new PerContainerReportCommandTokenPutGet(obj);
        }
    }
}
exports.ReportCommandTokenPutGet = ReportCommandTokenPutGet;
//# sourceMappingURL=report-command-token-put-get.js.map