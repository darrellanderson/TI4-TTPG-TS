"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildConsume = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const mirror_computing_1 = require("../unit-lib/data/unit-modifiers/base/mirror-computing");
const sarween_tools_1 = require("../unit-lib/data/unit-modifiers/base/sarween-tools");
const war_machine_1 = require("../unit-lib/data/unit-modifiers/codex-ordinian/war-machine");
const xxekir_grom_1 = require("../unit-lib/data/unit-modifiers/codex-vigil/xxekir-grom");
class BuildConsume {
    constructor(objs, unitModifierNames) {
        this._entries = [];
        this._unitModifierNames = unitModifierNames;
        for (const obj of objs) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            let type = undefined;
            let value = 0;
            let name = "tradegood";
            if (nsid === "token:base/tradegood-commodity-1") {
                type = "tradegood";
                value = 1;
                if (unitModifierNames.includes(mirror_computing_1.MirrorComputing.name)) {
                    value *= 2;
                }
            }
            else if (nsid === "token:base/tradegood-commodity-3") {
                type = "tradegood";
                value = 3;
                if (unitModifierNames.includes(mirror_computing_1.MirrorComputing.name)) {
                    value *= 2;
                }
            }
            else if (nsid.startsWith("card.planet:")) {
                const planet = TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
                if (planet) {
                    type = "planet";
                    name = planet.getName();
                    value = planet.getResources();
                    if (unitModifierNames.includes(xxekir_grom_1.XxekirGrom.name)) {
                        value += planet.getInfluence();
                    }
                }
            }
            if (type) {
                this._entries.push({
                    obj: obj,
                    type,
                    name,
                    value,
                });
            }
        }
    }
    getEntries() {
        return this._entries;
    }
    getTradegoodValue() {
        return this._entries
            .filter((entry) => entry.type === "tradegood")
            .reduce((acc, entry) => acc + entry.value, 0);
    }
    getPlanetValue() {
        return this._entries
            .filter((entry) => entry.type === "planet")
            .reduce((acc, entry) => acc + entry.value, 0);
    }
    getTotalValue() {
        return this.getTradegoodValue() + this.getPlanetValue();
    }
    getTotalValueWithModifiers() {
        let total = this.getTotalValue().toString();
        if (this._unitModifierNames.includes(sarween_tools_1.SarweenTools.name)) {
            total += "+ST";
        }
        if (this._unitModifierNames.includes(war_machine_1.WarMachine.name)) {
            total += "+WM";
        }
        return total;
    }
    report() {
        const result = [];
        const tradegoods = this.getTradegoodValue();
        if (tradegoods > 0) {
            result.push(`tradegoods (${tradegoods})`);
        }
        for (const entry of this._entries) {
            if (entry.type === "planet") {
                result.push(`${entry.name} (${entry.value})`);
            }
        }
        const total = this.getTotalValueWithModifiers();
        return `consuming $${total}: ${result.join(", ")}`;
    }
}
exports.BuildConsume = BuildConsume;
//# sourceMappingURL=build-consume.js.map