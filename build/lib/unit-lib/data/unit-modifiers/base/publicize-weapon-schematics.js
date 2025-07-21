"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicizeWeaponSchematics = void 0;
exports.PublicizeWeaponSchematics = {
    name: "Publicize Weapon Schematics",
    description: "War Suns lose SUSTAIN DAMAGE",
    owner: "any",
    priority: "adjust",
    triggers: [{ cardClass: "agenda", nsidName: "publicize-weapon-schematics" }],
    applies: (combatRoll) => {
        const rollType = combatRoll.getRollType();
        return (rollType === "antiFighterBarrage" ||
            rollType === "spaceCannonOffense" ||
            rollType === "spaceCombat");
    },
    apply: (combatRoll) => {
        let warSun;
        warSun = combatRoll.self.unitAttrsSet.get("war-sun");
        if (warSun) {
            warSun.setDisableSustainDamage(true);
        }
        warSun = combatRoll.opponent.unitAttrsSet.get("war-sun");
        if (warSun) {
            warSun.setDisableSustainDamage(true);
        }
    },
};
//# sourceMappingURL=publicize-weapon-schematics.js.map