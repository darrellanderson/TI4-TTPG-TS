"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickExplore = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
class RightClickExplore {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._isDistantSuns = false;
        this._onFactionsChanged = () => {
            const before = this._isDistantSuns;
            this._isDistantSuns = RightClickExplore._checkIsDistantSuns();
            // If the Distant Suns ability was added or removed, update tiles.
            if (this._isDistantSuns !== before) {
                const skipContained = false;
                for (const obj of api_1.world.getAllObjects(skipContained)) {
                    this._maybeSetCustomActions(obj);
                }
            }
        };
        this._customActionHandler = (obj, player, identifier) => {
            if (identifier === "*Explore Frontier") {
                const frontierTokenObj = this._getFrontierToken(obj);
                if (frontierTokenObj) {
                    this._exploreFrontierToken(frontierTokenObj, player);
                }
                else {
                    const msg = "Explore failed: missing frontier token";
                    ttpg_darrell_1.Broadcast.chatOne(player, msg);
                }
                return;
            }
            const system = TI4.systemRegistry.getBySystemTileObjId(obj.getId());
            if (system) {
                const parts = identifier.split(" ");
                const actionPart = parts.shift(); // remove "*Explore"
                let trait = parts.pop();
                const planetName = parts.join(" ");
                if (actionPart && trait && planetName) {
                    trait = trait.substring(1, trait.length - 1); // remove parens
                    for (const planet of system.getPlanets()) {
                        if (planet.getName() === planetName) {
                            if (actionPart === "*Explore") {
                                this._explorePlanet(system, planet, trait, player);
                            }
                            if (actionPart === "*Distant-Suns") {
                                this._exploreDistantSuns(system, planet, trait, player);
                            }
                        }
                    }
                }
            }
        };
    }
    static _checkIsDistantSuns() {
        for (const faction of TI4.factionRegistry
            .getPlayerSlotToFaction()
            .values()) {
            if (faction.getAbilityNsids().includes("faction-ability:pok/distant-suns")) {
                return true;
            }
        }
        return false;
    }
    init() {
        this._isDistantSuns = RightClickExplore._checkIsDistantSuns();
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeSetCustomActions(obj);
        }
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeSetCustomActions(obj);
        });
        TI4.events.onFactionChanged.add(this._onFactionsChanged);
    }
    _maybeSetCustomActions(obj) {
        const nsid = ttpg_darrell_1.NSID.get(obj);
        if (nsid.startsWith("tile.system:")) {
            this._setSystemCustomActions(obj);
        }
    }
    _setSystemCustomActions(systemTileObj) {
        const system = TI4.systemRegistry.getBySystemTileObjId(systemTileObj.getId());
        if (system) {
            systemTileObj.onCustomAction.remove(this._customActionHandler);
            systemTileObj.onCustomAction.add(this._customActionHandler);
            // Regular explore actions.
            for (const planet of system.getPlanets()) {
                const planetName = planet.getName();
                for (const trait of ["cultural", "hazardous", "industrial"]) {
                    const actionName = `*Explore ${planetName} (${trait})`;
                    systemTileObj.removeCustomAction(actionName);
                    if (planet.getTraits().includes(trait)) {
                        systemTileObj.addCustomAction(actionName);
                    }
                }
            }
            // Add Distant Suns actions.
            for (const planet of system.getPlanets()) {
                const planetName = planet.getName();
                for (const trait of ["cultural", "hazardous", "industrial"]) {
                    const actionName = `*Distant-Suns ${planetName} (${trait})`;
                    const tooltip = "Naaz-Rokha with mech: draw 2, choose 1";
                    systemTileObj.removeCustomAction(actionName);
                    if (this._isDistantSuns && planet.getTraits().includes(trait)) {
                        systemTileObj.addCustomAction(actionName, tooltip);
                    }
                }
            }
            // Frontier exploration.
            const actionFrontier = `*Explore Frontier`;
            systemTileObj.removeCustomAction(actionFrontier);
            if (system.getPlanets().length === 0) {
                systemTileObj.addCustomAction(actionFrontier);
            }
        }
    }
    _getExploreDeck(trait) {
        const deckTag = `deck-exploration-${trait}`;
        const discardTag = `discard-exploration-${trait}`;
        const shuffleDiscard = true;
        const deck = this._find.findDeckOrDiscard(deckTag, discardTag, shuffleDiscard);
        return deck;
    }
    _getFrontierToken(systemTileObj) {
        const pos = systemTileObj.getPosition();
        const systemHex = TI4.hex.fromPosition(pos);
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid === "token.attachment.system:pok/frontier") {
                const objHex = TI4.hex.fromPosition(obj.getPosition());
                if (systemHex === objHex) {
                    return obj;
                }
            }
        }
    }
    _explorePlanet(system, planet, trait, player) {
        let deck = this._getExploreDeck(trait);
        let card = undefined;
        if (deck) {
            if (deck.getStackSize() > 1) {
                card = deck.takeCards(1);
            }
            else if (deck.getStackSize() === 1) {
                card = deck;
                deck = undefined;
            }
        }
        if (card) {
            this._applyExploreCardToPlanet(card, trait, system, planet, player);
        }
    }
    _applyExploreCardToPlanet(card, trait, system, planet, player) {
        const cardNsid = ttpg_darrell_1.NSID.get(card);
        this._maybeAddPlanetAttachment(planet, cardNsid);
        this._maybeAddSystemAttachment(system, cardNsid);
        const pos = planet.getPosition();
        const animSpeed = 1;
        card.setPosition(pos.add([0, 0, 10]), animSpeed);
        card.setRotation([0, 0, 180]);
        card.snapToGround();
        const playerName = TI4.playerName.getByPlayer(player);
        const planetName = planet.getName();
        const cardName = card.getCardDetails().name;
        const msg = `${playerName} explored ${planetName} (${trait}): ${cardName}`;
        ttpg_darrell_1.Broadcast.chatAll(msg, player.getPlayerColor());
    }
    _exploreFrontierToken(frontierTokenObj, player) {
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(frontierTokenObj);
        let deck = this._getExploreDeck("frontier");
        let card = undefined;
        if (deck) {
            if (deck.getStackSize() > 1) {
                card = deck.takeCards(1);
            }
            else if (deck.getStackSize() === 1) {
                card = deck;
                deck = undefined;
            }
        }
        if (card) {
            const pos = frontierTokenObj.getPosition();
            const system = TI4.systemRegistry.getByPosition(pos);
            if (system) {
                const cardNsid = ttpg_darrell_1.NSID.get(card);
                this._maybeAddSystemAttachment(system, cardNsid);
            }
            const animSpeed = 1;
            card.setPosition(pos.add([0, 0, 10]), animSpeed);
            card.setRotation([0, 0, 180]);
            card.snapToGround();
            const playerName = TI4.playerName.getByPlayer(player);
            const cardName = card.getCardDetails().name;
            const msg = `${playerName} explored frontier: ${cardName}`;
            ttpg_darrell_1.Broadcast.chatAll(msg, player.getPlayerColor());
        }
    }
    _maybeAddPlanetAttachment(planet, exploreCardNsid) {
        const planetAttachment = TI4.planetAttachmentRegistry.getByCardNsid(exploreCardNsid);
        if (planetAttachment) {
            const container = planetAttachment
                .getObj()
                .getContainer();
            const pos = planet.getPosition().add([0, 0, 10]);
            if (container && container.take(planetAttachment.getObj(), pos)) {
                planetAttachment.getObj().snapToGround();
                const success = planetAttachment.attach();
                if (success) {
                    planetAttachment.doLayout();
                }
            }
        }
    }
    _maybeAddSystemAttachment(system, exploreCardNsid) {
        const systemAttachment = TI4.systemAttachmentRegistry.getByCardNsid(exploreCardNsid);
        if (systemAttachment) {
            const pos = system.getObj().getPosition().add([0, 0, 10]);
            const container = systemAttachment
                .getObj()
                .getContainer();
            if (container && container.take(systemAttachment.getObj(), pos)) {
                systemAttachment.getObj().snapToGround();
                const success = systemAttachment.attach();
                if (success) {
                    systemAttachment.doLayout();
                }
            }
        }
    }
    _exploreDistantSuns(system, planet, trait, player) {
        let deck = this._getExploreDeck(trait);
        let card1 = undefined;
        let card2 = undefined;
        if (deck) {
            if (deck.getStackSize() > 1) {
                card1 = deck.takeCards(1);
            }
            else if (deck.getStackSize() === 1) {
                card1 = deck;
                deck = undefined;
            }
        }
        if (deck) {
            if (deck.getStackSize() > 1) {
                card2 = deck.takeCards(1);
            }
            else if (deck.getStackSize() === 1) {
                card2 = deck;
                deck = undefined;
            }
        }
        if (card1 && !card2) {
            this._applyExploreCardToPlanet(card1, trait, system, planet, player);
        }
        else if (card1 && card2) {
            const pos = planet.getPosition();
            const d = 2;
            const left = pos.add([0, -d, 3]);
            const right = pos.add([0, d, 3]);
            card1.setPosition(left, 1);
            card1.setRotation([0, 0, 180]);
            card1.snapToGround();
            card2.setPosition(right, 1);
            card2.setRotation([0, 0, 180]);
            card2.snapToGround();
            this._addChoice(card1, () => {
                this._removeUIs(card1);
                this._removeUIs(card2);
                this._applyExploreCardToPlanet(card1, trait, system, planet, player);
                ttpg_darrell_1.GarbageContainer.tryRecycle(card2, player);
            });
            this._addChoice(card2, () => {
                this._removeUIs(card1);
                this._removeUIs(card2);
                this._applyExploreCardToPlanet(card2, trait, system, planet, player);
                ttpg_darrell_1.GarbageContainer.tryRecycle(card1, player);
            });
        }
    }
    _addChoice(card, callback) {
        const scale = 2;
        const button = new api_1.Button()
            .setFontSize(7 * scale)
            .setText("Choose");
        button.onClicked.add(callback);
        const ui = new api_1.UIElement();
        ui.widget = button;
        const extent = card.getExtent(false, false);
        ui.position = new api_1.Vector(-extent.x, 0, -extent.z - 0.1);
        ui.rotation = new api_1.Rotator(180, 180, 0);
        ui.scale = 1 / scale;
        card.addUI(ui);
    }
    _removeUIs(card) {
        for (const ui of card.getUIs()) {
            card.removeUIElement(ui);
        }
    }
}
exports.RightClickExplore = RightClickExplore;
//# sourceMappingURL=right-click-explore.js.map