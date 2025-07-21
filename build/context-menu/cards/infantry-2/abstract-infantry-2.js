"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractInfantry2 = exports.ACTION_NAME = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
exports.ACTION_NAME = "*Roll Infantry";
class AbstractInfantry2 extends ttpg_darrell_1.AbstractRightClickCard {
    constructor(cardNsid, rollValue) {
        const customActionHandler = (object, player, identifier) => {
            if (identifier === exports.ACTION_NAME) {
                const rollPos = object.getPosition();
                const infantryCount = this.countInfantryOnCard(object);
                const params = this.createDiceGroupParams(rollPos, player, infantryCount);
                ttpg_darrell_1.DiceGroup.roll(params);
            }
        };
        super(cardNsid, exports.ACTION_NAME, customActionHandler);
        this._onRollFinished = (diceResults, player) => {
            const msg = this.getMessage(diceResults, player);
            const color = api_1.world.getSlotColor(player.getSlot());
            ttpg_darrell_1.Broadcast.broadcastAll(msg, color);
        };
        this._rollValue = rollValue;
    }
    countInfantryOnCard(card) {
        const nsidToInfantryCount = new Map();
        nsidToInfantryCount.set("unit:base/infantry", 1);
        nsidToInfantryCount.set("token:base/infantry-1", 1);
        nsidToInfantryCount.set("token:base/infantry-3", 3);
        let totalInfantryCount = 0;
        const atopCard = new ttpg_darrell_1.Atop(card);
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const infantryCount = nsidToInfantryCount.get(nsid);
            if (infantryCount !== undefined) {
                const pos = obj.getPosition();
                if (atopCard.isAtop(pos)) {
                    totalInfantryCount += infantryCount;
                }
            }
        }
        return totalInfantryCount;
    }
    createDiceGroupParams(rollPos, player, infantryCount) {
        const diceParams = [];
        for (let i = 0; i < infantryCount; i++) {
            diceParams.push({
                sides: 10,
                hit: this._rollValue,
            });
        }
        const params = {
            doFakeRoll: api_1.GameWorld.getExecutionReason() === "unittest",
            diceParams,
            player,
            position: rollPos,
            callback: this._onRollFinished,
        };
        return params;
    }
    getMessage(diceResults, player) {
        let totalHits = 0;
        const rollValues = diceResults
            .map((diceResult) => {
            const isHit = diceResult.hit;
            if (isHit) {
                totalHits += 1;
            }
            return `${isHit ? "#" : ""}${diceResult.value}`;
        })
            .join(", ");
        const playerName = TI4.playerName.getByPlayer(player);
        const msg = `${playerName} resurrected ${totalHits} infantry: ${rollValues}`;
        return msg;
    }
}
exports.AbstractInfantry2 = AbstractInfantry2;
//# sourceMappingURL=abstract-infantry-2.js.map