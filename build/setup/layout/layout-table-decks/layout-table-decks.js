"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutTableDecks = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
class LayoutTableDecks {
    static _spawnDeck(nsidPrefix, snapPointTag) {
        const find = new ttpg_darrell_1.Find();
        const snapPoint = find.findSnapPointByTag(snapPointTag);
        if (!snapPoint) {
            throw new Error(`Snap point not found: ${snapPointTag}`);
        }
        const nsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => nsid.startsWith(nsidPrefix));
        const pos = snapPoint.getGlobalPosition().add([0, 0, 10]);
        const deck = ttpg_darrell_1.Spawn.spawnMergeDecksOrThrow(nsids, pos);
        deck.snapToGround();
        deck.snap();
    }
    constructor() {
        this._layout = new ttpg_darrell_1.LayoutObjects();
        const explorationMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.deck:pok/exploration");
        const baseMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.deck:base/base");
        const planetMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.deck:base/planet");
        const factionReferenceMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.deck:base/faction-reference");
        const eventMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.deck:base/event");
        const planetsAndBase = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .add(planetMat)
            .add(baseMat)
            .addAfterLayout(() => {
            planetMat.setObjectType(api_1.ObjectType.Ground);
            baseMat.setObjectType(api_1.ObjectType.Ground);
        });
        const factionAndEvent = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .add(factionReferenceMat)
            .add(eventMat)
            .addAfterLayout(() => {
            factionReferenceMat.setObjectType(api_1.ObjectType.Ground);
            eventMat.setObjectType(api_1.ObjectType.Ground);
        });
        this._layout
            .setChildDistance(layout_config_1.LayoutConfig.spacingWide)
            .setIsVertical(true)
            .add(explorationMat)
            .add(planetsAndBase)
            .add(factionAndEvent)
            .addAfterLayout(() => {
            explorationMat.setObjectType(api_1.ObjectType.Ground);
        });
        this._layout.addAfterLayout(() => {
            LayoutTableDecks._spawnDeck("card.action", "deck-action");
            LayoutTableDecks._spawnDeck("card.agenda", "deck-agenda");
            LayoutTableDecks._spawnDeck("card.objective.secret", "deck-objective-secret");
            LayoutTableDecks._spawnDeck("card.planet", "deck-planet");
            LayoutTableDecks._spawnDeck("card.legendary-planet", "deck-legendary-planet");
            LayoutTableDecks._spawnDeck("card.exploration.cultural", "deck-exploration-cultural");
            LayoutTableDecks._spawnDeck("card.exploration.industrial", "deck-exploration-industrial");
            LayoutTableDecks._spawnDeck("card.exploration.hazardous", "deck-exploration-hazardous");
            LayoutTableDecks._spawnDeck("card.exploration.frontier", "deck-exploration-frontier");
            LayoutTableDecks._spawnDeck("card.relic", "deck-relic");
            LayoutTableDecks._spawnDeck("card.faction-reference", "deck-faction-reference");
            LayoutTableDecks._spawnDeck("card.event", "deck-event");
        });
        const speakerToken = ttpg_darrell_1.Spawn.spawnOrThrow("token:base/speaker");
        const codex4scenario = ttpg_darrell_1.Spawn.spawnOrThrow("container:codex.liberation/liberation-scenario");
        this._layout.addAfterLayout(() => {
            const center = this._layout.getCenter();
            const { h } = this._layout.calculateSize();
            let extent = speakerToken.getExtent(false, false);
            let dx = h / 2 + layout_config_1.LayoutConfig.spacingWide + extent.x;
            let pos = center.add([-dx, 0, 10]);
            speakerToken.setPosition(pos);
            speakerToken.snapToGround();
            extent = codex4scenario.getExtent(false, false);
            dx = layout_config_1.LayoutConfig.spacingWide + extent.x;
            pos = pos.add([-dx, 0, 10]);
            codex4scenario.setPosition(pos);
            codex4scenario.snapToGround();
            codex4scenario.setObjectType(api_1.ObjectType.Ground);
        });
    }
    getLayout() {
        return this._layout;
    }
}
exports.LayoutTableDecks = LayoutTableDecks;
//# sourceMappingURL=layout-table-decks.js.map