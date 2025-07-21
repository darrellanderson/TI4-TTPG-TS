"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatorObjectives = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const right_click_score_private_1 = require("../../../../context-menu/right-click-score/right-click-score-private");
const right_click_score_public_1 = require("../../../../context-menu/right-click-score/right-click-score-public");
class UpdatorObjectives {
    update(gameData) {
        const controlTokens = this._getControlTokens();
        const objectiveCards = this._getRelevantCards();
        // Root objectives.
        gameData.objectives = this._fillObjectivesType(objectiveCards);
        // Per-player scored objectives.
        const playerSlotToCardNames = new Map();
        for (const objectiveCard of objectiveCards) {
            const cardDetails = objectiveCard.getCardDetails();
            const cardName = cardDetails.name;
            // Is card in a player-scoring card holder?
            const cardHolder = objectiveCard.getHolder();
            if (cardHolder) {
                const holderNsid = ttpg_darrell_1.NSID.get(cardHolder);
                const owningPlayerSlot = cardHolder.getOwningPlayerSlot();
                if (holderNsid === "card-holder:base/player-scoring") {
                    let cardNames = playerSlotToCardNames.get(owningPlayerSlot);
                    if (!cardNames) {
                        cardNames = [];
                        playerSlotToCardNames.set(owningPlayerSlot, cardNames);
                    }
                    cardNames.push(cardName);
                }
            }
            // Look for control tokens on card.
            const atop = new ttpg_darrell_1.Atop(objectiveCard);
            for (const controlToken of controlTokens) {
                const pos = controlToken.getPosition();
                if (atop.isAtop(pos)) {
                    const owningPlayerSlot = controlToken.getOwningPlayerSlot();
                    let cardNames = playerSlotToCardNames.get(owningPlayerSlot);
                    if (!cardNames) {
                        cardNames = [];
                        playerSlotToCardNames.set(owningPlayerSlot, cardNames);
                    }
                    cardNames.push(cardName);
                }
            }
        }
        gameData.players.forEach((playerData, seatIndex) => {
            const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(seatIndex);
            const cardNames = playerSlotToCardNames.get(playerSlot);
            if (cardNames) {
                playerData.objectives = cardNames;
            }
            else {
                playerData.objectives = [];
            }
        });
    }
    _getControlTokens() {
        const controlTokens = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("token.control:")) {
                controlTokens.push(obj);
            }
        }
        return controlTokens;
    }
    _getRelevantCards() {
        const objectiveCards = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            if (obj instanceof api_1.Card) {
                if (obj.isHeld()) {
                    continue;
                }
                const snapPoint = obj.getSnappedToPoint();
                if (snapPoint) {
                    const tags = snapPoint.getTags();
                    if (tags.includes("discard-agenda") ||
                        tags.includes("active-agenda")) {
                        continue;
                    }
                }
                const nsid = ttpg_darrell_1.NSID.get(obj);
                if (right_click_score_private_1.RightClickScorePrivate.isScorablePrivate(obj) ||
                    right_click_score_public_1.RightClickScorePublic.isScorablePublic(obj) ||
                    nsid === "card.relic:pok/the-obsidian" // not scorable, but wanted for streamer display
                ) {
                    objectiveCards.push(obj);
                }
            }
        }
        return objectiveCards;
    }
    _fillObjectivesType(objectiveCards) {
        const public1s = [];
        const public2s = [];
        const secrets = [];
        const agendas = [];
        const relics = [];
        const other = [];
        for (const card of objectiveCards) {
            const nsid = ttpg_darrell_1.NSID.get(card);
            if (nsid.startsWith("card.objective.public-1:")) {
                public1s.push(card);
            }
            else if (nsid.startsWith("card.objective.public-2:")) {
                public2s.push(card);
            }
            else if (nsid.startsWith("card.objective.secret:")) {
                // If a secret objective is on an "extra" slot on the stage 1/2 mat count it as a public.
                let consumed = false;
                const snapPoint = card.getSnappedToPoint();
                if (snapPoint) {
                    const mat = snapPoint.getParentObject();
                    if (mat) {
                        const matNsid = ttpg_darrell_1.NSID.get(mat);
                        if (matNsid === "mat:base/objective-1" ||
                            matNsid === "mat:base/objective-2" ||
                            matNsid === "mat:base/agenda-laws") {
                            public1s.push(card);
                            consumed = true;
                        }
                    }
                }
                if (!consumed) {
                    secrets.push(card);
                }
            }
            else if (nsid.startsWith("card.relic:")) {
                relics.push(card);
            }
            else {
                other.push(card); // support for the throne
            }
        }
        const getCardNames = (cards) => {
            return cards.map((card) => {
                const cardDetails = card.getCardDetails();
                return cardDetails.name;
            });
        };
        const objectivesType = {
            "Public Objectives I": getCardNames(public1s),
            "Public Objectives II": getCardNames(public2s),
            "Secret Objectives": getCardNames(secrets),
            Agenda: getCardNames(agendas),
            Other: getCardNames(other),
            Relics: getCardNames(relics),
        };
        return objectivesType;
    }
}
exports.UpdatorObjectives = UpdatorObjectives;
//# sourceMappingURL=updator-objectives.js.map