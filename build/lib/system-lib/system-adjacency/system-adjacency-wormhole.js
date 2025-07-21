"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdjacencyWormhole = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_modifier_active_idle_1 = require("../../unit-lib/unit-modifier/unit-modifier-active-idle");
class SystemAdjacencyWormhole {
    constructor() {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
    }
    addTags(hexToSystem, adjacency, faction) {
        // Add wormholes in systems (inclues attachments).
        for (const [hex, system] of hexToSystem) {
            for (const wormhole of system.getWormholes()) {
                // System into wormhole.
                adjacency.addLink({
                    src: hex,
                    dst: wormhole,
                    distance: 0.5,
                    isTransit: true,
                });
                // Wormhole into system.
                adjacency.addLink({
                    src: wormhole,
                    dst: hex,
                    distance: 0.5,
                    isTransit: false,
                });
            }
        }
        if (faction) {
            this._applyFaction(faction, adjacency);
        }
        this._applyCreussFlagship(adjacency);
        this._applyCards(adjacency);
    }
    _applyFaction(faction, adjacency) {
        if (faction
            .getAbilityNsids()
            .includes("faction-ability:base/quantum-entanglement")) {
            adjacency.addLink({
                src: "alpha",
                dst: "beta",
                distance: 0,
                isTransit: true,
            });
            adjacency.addLink({
                src: "beta",
                dst: "alpha",
                distance: 0,
                isTransit: true,
            });
        }
    }
    _applyCreussFlagship(adjacency) {
        const nsid = "unit.flagship:base/creuss";
        const playerSlot = -1;
        const skipContained = true;
        const creussFlagship = this._find.findGameObject(nsid, playerSlot, skipContained);
        if (creussFlagship) {
            const pos = creussFlagship.getPosition();
            const hex = TI4.hex.fromPosition(pos);
            adjacency.addLink({
                src: hex,
                dst: "delta",
                distance: 0.5,
                isTransit: true,
            });
            adjacency.addLink({
                src: "delta",
                dst: hex,
                distance: 0.5,
                isTransit: false,
            });
        }
    }
    _applyCards(adjacency) {
        let card;
        const allowFaceDown = false;
        const rejectSnapPointTags = ["discard"];
        card = this._find.findCard("card.agenda:base/wormhole_reconstruction");
        if (card &&
            this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)) {
            adjacency.addLink({
                src: "alpha",
                dst: "beta",
                distance: 0,
                isTransit: true,
            });
            adjacency.addLink({
                src: "beta",
                dst: "alpha",
                distance: 0,
                isTransit: true,
            });
        }
        card = this._find.findCard("card.action:base/lost_star_chart");
        if (card &&
            this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)) {
            adjacency.addLink({
                src: "alpha",
                dst: "beta",
                distance: 0,
                isTransit: true,
            });
            adjacency.addLink({
                src: "beta",
                dst: "alpha",
                distance: 0,
                isTransit: true,
            });
        }
        // Creuss agent, can be applied for any player.
        // "After a player activates a system that contains a non-delta
        // wormhole: You may exhaust this card; if you do, that system is
        // adjacent to all other systems that contain a wormhole during
        // this tactical action."
        card = this._find.findCard("card.leader.agent.creuss:pok/emissary_taivra");
        if (card &&
            this._cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags) &&
            unit_modifier_active_idle_1.UnitModifierActiveIdle.isActive(card)) {
            for (const a of SystemAdjacencyWormhole.WORMHOMES) {
                for (const b of SystemAdjacencyWormhole.WORMHOMES) {
                    if (a !== b) {
                        adjacency.addLink({
                            src: a,
                            dst: b,
                            distance: 0,
                            isTransit: true,
                        });
                    }
                }
            }
        }
    }
}
exports.SystemAdjacencyWormhole = SystemAdjacencyWormhole;
SystemAdjacencyWormhole.WORMHOMES = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
];
//# sourceMappingURL=system-adjacency-wormhole.js.map