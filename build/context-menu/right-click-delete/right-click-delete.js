"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickDelete = exports.ACTION_DELETE = void 0;
const api_1 = require("@tabletop-playground/api");
exports.ACTION_DELETE = "Delete";
/**
 * Disable the default delete (delete key), replace with a context menu item.
 */
class RightClickDelete {
    constructor() {
        this._onCustomAction = (obj, _player, action) => {
            if (action === exports.ACTION_DELETE && obj.isValid()) {
                obj.destroy();
            }
        };
    }
    init() {
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._addRightClickDelete(obj);
        }
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._addRightClickDelete(obj);
        });
    }
    _addRightClickDelete(obj) {
        process.nextTick(() => {
            obj.removeCustomAction(exports.ACTION_DELETE);
            obj.addCustomAction(exports.ACTION_DELETE);
        });
        obj.onCustomAction.remove(this._onCustomAction);
        obj.onCustomAction.add(this._onCustomAction);
    }
}
exports.RightClickDelete = RightClickDelete;
//# sourceMappingURL=right-click-delete.js.map