"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThatWhichMoldsFlesh = void 0;
exports.ThatWhichMoldsFlesh = {
    name: "That Which Molds Flesh",
    description: "When producing Infantry and/or Fighters, up to 2 do not count against the production limit",
    owner: "self",
    priority: "adjust",
    triggers: [
        { cardClass: "commander", nsidName: "that-which-molds-flesh" },
        { cardClass: "alliance", nsidName: "vuilraith" },
    ],
    applies: (combatRoll) => {
        return combatRoll.getRollType() === "production";
    },
    apply: (combatRoll) => {
        const infantryAttrs = combatRoll.self.unitAttrsSet.get("infantry");
        if (infantryAttrs) {
            infantryAttrs.setSharedProduceQuantityDoesNotCountAgainstProductionLimits(2);
        }
        const fighterAttrs = combatRoll.self.unitAttrsSet.get("fighter");
        if (fighterAttrs) {
            fighterAttrs.setSharedProduceQuantityDoesNotCountAgainstProductionLimits(2);
        }
    },
};
//# sourceMappingURL=that-which-molds-flesh.js.map