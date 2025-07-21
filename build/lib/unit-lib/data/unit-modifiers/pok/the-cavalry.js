"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheCavalry = void 0;
const unit_attrs_1 = require("../../../unit-attrs/unit-attrs");
exports.TheCavalry = {
    name: "The Cavalry",
    description: "One non-fighter ship gains the SUSTAIN DAMAGE, combat value, and ANTI-FIGHTER BARRAGE of the Nomad flagship (this modifier adds a new unit for AFB/space combat, remove the affected unit from normal setup)",
    owner: "self",
    priority: "mutate",
    triggers: [{ cardClass: "promissory", nsidName: "the-cavalry" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return rollType === "antiFighterBarrage" || rollType === "spaceCombat";
    },
    apply: (combatRoll) => {
        const memoria1 = TI4.unitAttrsRegistry.rawByNsid("unit:pok/memoria");
        const memoria2 = TI4.unitAttrsRegistry.rawByNsid("card.technology.unit-upgrade:pok/memoria-2");
        if (memoria1 && memoria2) {
            let name = "The Cavalry";
            let memoriaWhich = memoria1;
            const memoria2Nsid = unit_attrs_1.UnitAttrs.schemaToNsid("pok", memoria2);
            if (combatRoll.find.findCard(memoria2Nsid) !== undefined) {
                name = "The Cavalry II";
                memoriaWhich = memoria2;
            }
            const cavalry = Object.assign(Object.assign({}, memoriaWhich), { name, unit: "the-cavalry" });
            combatRoll.self.addSyntheticUnit(cavalry, 1);
        }
    },
};
//# sourceMappingURL=the-cavalry.js.map