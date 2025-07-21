"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutMats = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const layout_config_1 = require("../layout-config");
class LayoutMats {
    constructor(playerSlot) {
        if (playerSlot < 0) {
            throw new Error("must have a player slot");
        }
        const buildMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.player:base/build");
        const planetMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.player:base/planet");
        const techMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.player:base/technology");
        const techDeckMat = ttpg_darrell_1.Spawn.spawnOrThrow("mat.player:base/technology-deck");
        buildMat.setOwningPlayerSlot(playerSlot);
        planetMat.setOwningPlayerSlot(playerSlot);
        techMat.setOwningPlayerSlot(playerSlot);
        techDeckMat.setOwningPlayerSlot(playerSlot);
        this._layout = new ttpg_darrell_1.LayoutObjects()
            .setChildDistance(layout_config_1.LayoutConfig.spacing)
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .add(buildMat)
            .add(planetMat)
            .add(techMat)
            .add(techDeckMat);
        this._layout.addAfterLayout(() => {
            buildMat.setObjectType(api_1.ObjectType.Ground);
            planetMat.setObjectType(api_1.ObjectType.Ground);
            techMat.setObjectType(api_1.ObjectType.Ground);
            techDeckMat.setObjectType(api_1.ObjectType.Ground);
        });
        this._layout.addAfterLayout(() => {
            const snapPoints = techDeckMat.getAllSnapPoints();
            const snapPoint = snapPoints[0];
            this._spawnTechDeck(snapPoint);
        });
    }
    getLayout() {
        return this._layout;
    }
    _spawnTechDeck(snapPoint) {
        if (snapPoint) {
            const nsids = ttpg_darrell_1.Spawn.getAllNsids().filter((nsid) => nsid.startsWith("card.technology"));
            const pos = snapPoint.getGlobalPosition().add([0, 0, 10]);
            const deck = ttpg_darrell_1.Spawn.spawnMergeDecksOrThrow(nsids, pos);
            // Remove faction tech.
            if (deck instanceof api_1.Card) {
                this._filterTechDeck(deck);
            }
            deck.snapToGround();
            deck.snap();
        }
    }
    _filterTechDeck(deck) {
        deck.setName("Technology");
        const filtered = new ttpg_darrell_1.CardUtil().filterCards(deck, (nsid) => {
            let result = false;
            const tech = TI4.techRegistry.getByNsid(nsid);
            if (!tech || tech.isFactionTech()) {
                result = true;
            }
            return result;
        });
        if (filtered) {
            ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(filtered);
        }
    }
}
exports.LayoutMats = LayoutMats;
//# sourceMappingURL=layout-mats.js.map