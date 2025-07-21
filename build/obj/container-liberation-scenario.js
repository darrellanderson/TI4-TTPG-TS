"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * Codex 4: Liberation of Ordinian
 */
class ContainerLiberationScenario {
    constructor(gameObject) {
        this._onStartGameComplete = () => {
            const find = new ttpg_darrell_1.Find();
            const cardUtil = new ttpg_darrell_1.CardUtil();
            // Move ordinian system tile, planet and legendary card here.
            const ordinianSystemTile = find.findGameObject("tile.system:codex.liberation/1800");
            if (ordinianSystemTile) {
                this._addToContainer(ordinianSystemTile);
            }
            const ordinianPlanet = cardUtil.fetchCard("card.planet:codex.liberation/ordinian");
            if (ordinianPlanet) {
                this._addToContainer(ordinianPlanet);
            }
            const ordinianLegendary = cardUtil.fetchCard("card.legendary-planet:codex.liberation/barren-husk");
            if (ordinianLegendary) {
                this._addToContainer(ordinianLegendary);
            }
            // Spawn leaders.
            const leaders = ttpg_darrell_1.Spawn.spawn("card.leader:codex.liberation/0");
            if (leaders) {
                this._addToContainer(leaders);
            }
            // Spawn techs.
            const redTechs = ttpg_darrell_1.Spawn.spawn("card.technology.red:codex.liberation/0");
            if (redTechs) {
                this._addToContainer(redTechs);
            }
            const yellowTechs = ttpg_darrell_1.Spawn.spawn("card.technology.yellow:codex.liberation/null-reference");
            if (yellowTechs) {
                this._addToContainer(yellowTechs);
            }
            // Spawn objectives.
            const public1 = ttpg_darrell_1.Spawn.spawn("card.objective.public-1:codex.liberation/liberate-ordinian");
            if (public1) {
                this._addToContainer(public1);
            }
            const public2 = ttpg_darrell_1.Spawn.spawn("card.objective.public-2:codex.liberation/control-ordinian");
            if (public2) {
                this._addToContainer(public2);
            }
        };
        if (!(gameObject instanceof api_1.Container)) {
            throw new Error("ContainerLiberationScenario requires a Container object.");
        }
        this._container = gameObject;
        TI4.events.onStartGameComplete.add(this._onStartGameComplete);
    }
    _addToContainer(gameObject) {
        const inside = gameObject.getContainer();
        if (inside) {
            const above = inside.getPosition().add([0, 0, 10]);
            inside.take(gameObject, above);
        }
        this._container.addObjects([gameObject]);
    }
}
new ContainerLiberationScenario(api_1.refContainer);
//# sourceMappingURL=container-liberation-scenario.js.map