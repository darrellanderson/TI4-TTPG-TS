"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustodiansToken = void 0;
exports.createFromObject = createFromObject;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class CustodiansToken {
    constructor(obj) {
        this._find = new ttpg_darrell_1.Find();
        this._actionName = "*Score";
        this._customActionHandler = (_obj, player, actionName) => {
            if (actionName === this._actionName) {
                this.score(player.getSlot());
            }
        };
        this._obj = obj;
        obj.addCustomAction(this._actionName);
        obj.onCustomAction.add(this._customActionHandler);
    }
    score(playerSlot) {
        const skipContained = true;
        const container = this._find.findContainer("container.token.control:base/generic", playerSlot, skipContained);
        if (container) {
            const pos = container.getPosition().add([0, 0, 10]);
            const controlToken = container.takeAt(0, pos);
            if (controlToken) {
                const controlTokenExtent = controlToken.getExtent(false, false);
                const custodiansTokenExtent = this._obj.getExtent(false, false);
                const controlD = Math.max(controlTokenExtent.x, controlTokenExtent.y);
                const custodiansD = Math.max(custodiansTokenExtent.x, custodiansTokenExtent.y);
                const d = custodiansD - controlD;
                const dst = this._obj
                    .getPosition()
                    .add([
                    Math.random() * d,
                    Math.random() * d,
                    api_1.world.getTableHeight() + 10,
                ]);
                controlToken.setPosition(dst);
                controlToken.snapToGround();
            }
        }
    }
}
exports.CustodiansToken = CustodiansToken;
function createFromObject(obj, executionReason) {
    if (executionReason !== "unittest") {
        new CustodiansToken(obj);
    }
}
createFromObject(api_1.refObject, api_1.GameWorld.getExecutionReason());
//# sourceMappingURL=custodians-token.js.map