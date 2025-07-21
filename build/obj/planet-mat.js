"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetMat = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class PlanetMat {
    constructor(obj) {
        this._actionNameToPlanetCardNsid = new Map();
        this._obj = obj;
        this._obj.onCustomAction.add((_obj, _player, actionName) => {
            const nsid = this._actionNameToPlanetCardNsid.get(actionName);
            if (nsid) {
                const cardUtil = new ttpg_darrell_1.CardUtil();
                const planetCard = cardUtil.fetchCard(nsid);
                if (planetCard) {
                    const pos = this._obj.getPosition().add([0, 0, 10]);
                    planetCard.setPosition(pos);
                    planetCard === null || planetCard === void 0 ? void 0 : planetCard.snapToGround();
                }
            }
        });
        TI4.events.onSystemActivated.add((system, _player) => {
            for (const actionName of this._actionNameToPlanetCardNsid.keys()) {
                this._obj.removeCustomAction(actionName);
            }
            for (const planet of system.getPlanets()) {
                const actionName = "*Fetch " + planet.getName();
                const nsid = planet.getPlanetCardNsid();
                this._actionNameToPlanetCardNsid.set(actionName, nsid);
                this._obj.addCustomAction(actionName);
            }
        });
    }
}
exports.PlanetMat = PlanetMat;
new PlanetMat(api_1.refObject);
//# sourceMappingURL=planet-mat.js.map