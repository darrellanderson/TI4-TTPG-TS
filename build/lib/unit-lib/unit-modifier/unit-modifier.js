"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitModifier = void 0;
class UnitModifier {
    static schemaTriggerToNsid(source, trigger) {
        if (trigger.overrideSource) {
            source = trigger.overrideSource;
        }
        switch (trigger.cardClass) {
            case "action":
            case "agenda":
            case "alliance":
            case "promissory":
            case "relic":
            case "technology.blue":
            case "technology.green":
            case "technology.red":
            case "technology.yellow":
            case "technology.unit-upgrade":
                return `card.${trigger.cardClass}:${source}/${trigger.nsidName}`;
            case "agent":
            case "commander":
            case "hero":
            case "mech":
                return `card.leader.${trigger.cardClass}:${source}/${trigger.nsidName}`;
            case "faction-ability":
                return `faction-ability:${source}/${trigger.nsidName}`;
            case "legendary":
                return `card.legendary-planet:${source}/${trigger.nsidName}`;
            case "unit":
                return `unit:${source}/${trigger.nsidName}`;
        }
    }
    static sortByApplyOrder(modifiers) {
        const priorityToSortValue = {
            mutate: 1,
            "mutate-late": 2,
            adjust: 3,
            choose: 4,
        };
        return modifiers.sort((a, b) => {
            const aValue = priorityToSortValue[a.getPriority()];
            const bValue = priorityToSortValue[b.getPriority()];
            return aValue - bValue;
        });
    }
    constructor(params) {
        this._params = params;
    }
    applies(combatRoll) {
        return this._params.applies(combatRoll);
    }
    apply(combatRoll) {
        this._params.apply(combatRoll);
    }
    getDescription() {
        return this._params.description;
    }
    getName() {
        return this._params.name;
    }
    getOwner() {
        return this._params.owner;
    }
    getPriority() {
        return this._params.priority;
    }
    isActiveIdle() {
        var _a;
        return (_a = this._params.isActiveIdle) !== null && _a !== void 0 ? _a : false;
    }
}
exports.UnitModifier = UnitModifier;
//# sourceMappingURL=unit-modifier.js.map