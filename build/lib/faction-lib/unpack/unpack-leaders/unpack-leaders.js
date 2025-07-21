"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpackLeaders = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_unpack_1 = require("../abstract-unpack/abstract-unpack");
class UnpackLeaders extends abstract_unpack_1.AbstractUnpack {
    constructor(faction, playerSlot) {
        super(faction, playerSlot);
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._find = new ttpg_darrell_1.Find();
        this._removeByNsidOrSource =
            TI4.removeRegistry.createRemoveFromRegistryAndConfig();
    }
    unpack() {
        const leaderSheet = this._findLeaderSheetOrThrow();
        const snapPoints = leaderSheet.getAllSnapPoints();
        if (snapPoints.length !== 4) {
            throw new Error("Unexpected number of snap points");
        }
        const deck = this.spawnDeckAndFilterSourcesOrThrow("card.leader:");
        let nsids;
        let snapPoint;
        nsids = this.getFaction().getAgentNsids();
        snapPoint = snapPoints[3];
        if (snapPoint) {
            const rot = new api_1.Rotator(0, 0, 180);
            this._unpackLeaders(deck, nsids, snapPoint, rot);
        }
        nsids = this.getFaction().getCommanderNsids();
        snapPoint = snapPoints[2];
        if (snapPoint) {
            const rot = new api_1.Rotator(0, 0, 0);
            this._unpackLeaders(deck, nsids, snapPoint, rot);
        }
        nsids = this.getFaction().getHeroNsids();
        snapPoint = snapPoints[1];
        if (snapPoint) {
            const rot = new api_1.Rotator(0, 0, 0);
            this._unpackLeaders(deck, nsids, snapPoint, rot);
        }
        nsids = this.getFaction().getMechNsids();
        snapPoint = snapPoints[0];
        if (snapPoint) {
            const rot = new api_1.Rotator(0, 0, 180);
            this._unpackLeaders(deck, nsids, snapPoint, rot);
        }
        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(deck);
    }
    remove() {
        const nsids = [
            ...this.getFaction().getAgentNsids(),
            ...this.getFaction().getCommanderNsids(),
            ...this.getFaction().getHeroNsids(),
            ...this.getFaction().getMechNsids(),
        ];
        const nsidSet = new Set(nsids);
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsidSet.has(nsid)) {
                const pos = obj.getPosition();
                const closest = this._find.closestOwnedCardHolderOwner(pos);
                if (closest === this.getPlayerSlot()) {
                    ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
                }
            }
        }
    }
    _findLeaderSheetOrThrow() {
        const nsid = "sheet:pok/leader";
        const skipContained = true;
        const leaderSheet = this._find.findGameObject(nsid, this.getPlayerSlot(), skipContained);
        if (!leaderSheet) {
            throw new Error("Leader sheet not found");
        }
        return leaderSheet;
    }
    _unpackLeaders(deck, leaderNsids, snapPoint, rotator) {
        const leaderNsidsAsSet = new Set(leaderNsids);
        const leaders = this._cardUtil.filterCards(deck, (nsid) => leaderNsidsAsSet.has(nsid));
        if (leaderNsids.length > 0) {
            if (!leaders) {
                throw new Error(`Leaders not found (faction "${this.getFaction().getName()}", leaders [${leaderNsids.join(", ")}])`);
            }
            const above = snapPoint.getGlobalPosition().add([0, 0, 10]);
            const leadersCards = this._cardUtil.separateDeck(leaders);
            for (const leaderCard of leadersCards) {
                leaderCard.setPosition(above);
                leaderCard.setRotation(rotator);
                leaderCard.snapToGround();
                above.y -= 2;
            }
        }
    }
}
exports.UnpackLeaders = UnpackLeaders;
//# sourceMappingURL=unpack-leaders.js.map