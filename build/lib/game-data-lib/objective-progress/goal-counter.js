"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalCounter = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const unit_plastic_1 = require("../../unit-lib/unit-plastic/unit-plastic");
const system_adjacency_1 = require("../../system-lib/system-adjacency/system-adjacency");
class GoalCounter {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
    }
    _getSystemHexes() {
        const result = new Set();
        TI4.systemRegistry.getAllSystemsWithObjs().forEach((system) => {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            result.add(hex);
        });
        return result;
    }
    _getPlayerSlotToPlanetCards() {
        const result = new Map();
        // Do not count planet cards on system tiles.
        const validHexes = this._getSystemHexes();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            if (obj instanceof api_1.Card) {
                const nsid = ttpg_darrell_1.NSID.get(obj);
                if (nsid.startsWith("card.planet:")) {
                    const pos = obj.getPosition();
                    const hex = TI4.hex.fromPosition(pos);
                    if (!validHexes.has(hex)) {
                        const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                        let cards = result.get(playerSlot);
                        if (!cards) {
                            cards = [];
                            result.set(playerSlot, cards);
                        }
                        cards.push(obj);
                    }
                }
            }
        }
        return result;
    }
    _getPlayerSlotToHomePlanetCardNsids() {
        const playerSlotToHomePlanetCardNsids = new Map();
        const playerSlotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
        playerSlotToFaction.forEach((faction, playerSlot) => {
            const homeTile = faction.getHomeSystemTileNumber();
            const homeSystem = TI4.systemRegistry.getBySystemTileNumber(homeTile);
            if (homeSystem) {
                // Get my home planet card nsids.
                const myHomePlanetNsids = new Set();
                homeSystem.getPlanets().forEach((planet) => {
                    const nsid = planet.getPlanetCardNsid();
                    myHomePlanetNsids.add(nsid);
                });
                playerSlotToHomePlanetCardNsids.set(playerSlot, myHomePlanetNsids);
            }
        });
        return playerSlotToHomePlanetCardNsids;
    }
    _getAllHomePlanetCardNsids() {
        const allHomePlanetCardNsids = new Set();
        const playerSlotToHomePlanetCardNsids = this._getPlayerSlotToHomePlanetCardNsids();
        playerSlotToHomePlanetCardNsids.forEach((myHomePlanetNsids, _playerSlot) => {
            myHomePlanetNsids.forEach((nsid) => {
                allHomePlanetCardNsids.add(nsid);
            });
        });
        return allHomePlanetCardNsids;
    }
    _getPlayerSlotToHomeSystemHex() {
        const playerSlotToHomeSystemHex = new Map();
        TI4.factionRegistry
            .getPlayerSlotToFaction()
            .forEach((faction, playerSlot) => {
            const homeTile = faction.getHomeSystemTileNumber();
            const homeSystem = TI4.systemRegistry.getBySystemTileNumber(homeTile);
            if (homeSystem) {
                const pos = homeSystem.getObj().getPosition();
                const hex = TI4.hex.fromPosition(pos);
                playerSlotToHomeSystemHex.set(playerSlot, hex);
            }
        });
        return playerSlotToHomeSystemHex;
    }
    _getPlayerSlotToControlledPlanetHexes() {
        const playerSlotToControlledPlanetHexes = new Map();
        unit_plastic_1.UnitPlastic.getAll().forEach((plastic) => {
            const unitType = plastic.getUnit();
            if (unitType === "control-token" ||
                unitType === "infantry" ||
                unitType === "mech" ||
                unitType === "pds" ||
                unitType === "space-dock") {
                const playerSlot = plastic.getOwningPlayerSlot();
                const hex = plastic.getHex();
                let hexes = playerSlotToControlledPlanetHexes.get(playerSlot);
                if (!hexes) {
                    hexes = new Set();
                    playerSlotToControlledPlanetHexes.set(playerSlot, hexes);
                }
                hexes.add(hex);
            }
        });
        return playerSlotToControlledPlanetHexes;
    }
    /**
     * Count per-player number of flagships and war suns.
     *
     * @returns
     */
    countFlagshipsAndWarSuns() {
        const result = new Map();
        // Get all flagships and war suns (UnitPlastic restricts to valid hexes).
        const plastics = unit_plastic_1.UnitPlastic.getAll().filter((plastic) => {
            const nsid = ttpg_darrell_1.NSID.get(plastic.getObj());
            return (nsid.startsWith("unit:base/flagship") ||
                nsid.startsWith("unit:base/war-sun"));
        });
        for (const plastic of plastics) {
            const obj = plastic.getObj();
            const playerSlot = obj.getOwningPlayerSlot();
            const count = result.get(playerSlot) || 0;
            result.set(playerSlot, count + 1);
        }
        return result;
    }
    countInfResTgs() {
        const result = new Map();
        const gameData = TI4.lastGameData.getLastGameData();
        if (gameData) {
            gameData.players.forEach((player, index) => {
                let inf = 0;
                let res = 0;
                const planetTotals = player.planetTotals;
                if (planetTotals) {
                    inf = planetTotals.influence.total;
                    res = planetTotals.resources.total;
                }
                const tgs = player.tradeGoods || 0;
                const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(index);
                result.set(playerSlot, { inf, res, tgs });
            });
        }
        return result;
    }
    countMaxNonFighterShipsInSingleSystem() {
        const result = new Map();
        // Non-fighter ship UnitTypes.
        const nonFighterShips = new Set();
        TI4.unitAttrsRegistry
            .defaultUnitAttrsSet()
            .getAll()
            .forEach((unitAttrs) => {
            const unitType = unitAttrs.getUnit();
            if (unitAttrs.isShip() && unitType !== "fighter") {
                nonFighterShips.add(unitType);
            }
        });
        // Get all non-fighter ships (UnitPlastic restricts to valid hexes).
        const plastics = unit_plastic_1.UnitPlastic.getAll().filter((plastic) => {
            return nonFighterShips.has(plastic.getUnit());
        });
        // Group by hex.
        const hexToPlastics = new Map();
        for (const plastic of plastics) {
            const hex = plastic.getHex();
            let hexPlastics = hexToPlastics.get(hex);
            if (!hexPlastics) {
                hexPlastics = [];
                hexToPlastics.set(hex, hexPlastics);
            }
            hexPlastics.push(plastic);
        }
        // Count per-player number of non-fighter ships in each hex.
        for (const hexPlastics of hexToPlastics.values()) {
            // Per-player counts.
            const playerSlotToCount = new Map();
            for (const plastic of hexPlastics) {
                const playerSlot = plastic.getOwningPlayerSlot();
                let count = playerSlotToCount.get(playerSlot) || 0;
                count += 1;
                playerSlotToCount.set(playerSlot, count);
            }
            for (const [playerSlot, count] of playerSlotToCount.entries()) {
                const oldCount = result.get(playerSlot) || 0;
                if (count > oldCount) {
                    result.set(playerSlot, count);
                }
            }
        }
        return result;
    }
    countPlanetsAndGetNeighbors() {
        const result = new Map();
        // Fill in neighbors, initial planet count of 0.
        const playerSeats = TI4.playerSeats.getAllSeats();
        playerSeats.forEach((playerSeat, index) => {
            const leftIndex = (index + 1) % playerSeats.length;
            const left = playerSeats[leftIndex];
            const rightIndex = (index + playerSeats.length - 1) % playerSeats.length;
            const right = playerSeats[rightIndex];
            if (left && right) {
                result.set(playerSeat.playerSlot, {
                    planets: 0,
                    neighbors: [left.playerSlot, right.playerSlot],
                });
            }
        });
        // Count planets.  GameData does not have this info.
        const playerSlotToCards = this._getPlayerSlotToPlanetCards();
        playerSlotToCards.forEach((cards, playerSlot) => {
            const entry = result.get(playerSlot);
            if (entry) {
                entry.planets += cards.length;
            }
        });
        return result;
    }
    countPlanetsInOthersHome() {
        const result = new Map();
        const playerSlotToPlanetCards = this._getPlayerSlotToPlanetCards();
        const playerSlotToHomePlanetCardNsids = this._getPlayerSlotToHomePlanetCardNsids();
        const allHomePlanetCardNsids = this._getAllHomePlanetCardNsids();
        TI4.playerSeats
            .getAllSeats()
            .forEach((playerSeat) => {
            const playerSlot = playerSeat.playerSlot;
            const planetCards = playerSlotToPlanetCards.get(playerSlot);
            const myHomePlanetCardNsids = playerSlotToHomePlanetCardNsids.get(playerSlot);
            if (planetCards && myHomePlanetCardNsids) {
                let count = 0;
                planetCards.forEach((planetCard) => {
                    const nsid = ttpg_darrell_1.NSID.get(planetCard);
                    if (allHomePlanetCardNsids.has(nsid) &&
                        !myHomePlanetCardNsids.has(nsid)) {
                        count += 1;
                    }
                });
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countPlanetsNonHome(excludeCustodiaVigilia) {
        const result = new Map();
        const allHomePlanetCardNsids = this._getAllHomePlanetCardNsids();
        const playerSlotToPlanetCards = this._getPlayerSlotToPlanetCards();
        TI4.playerSeats
            .getAllSeats()
            .forEach((playerSeat) => {
            const playerSlot = playerSeat.playerSlot;
            const planetCards = playerSlotToPlanetCards.get(playerSlot);
            if (planetCards) {
                let count = 0;
                planetCards.forEach((planetCard) => {
                    const nsid = ttpg_darrell_1.NSID.get(planetCard);
                    if (excludeCustodiaVigilia &&
                        nsid === "card.planet:codex.vigil/custodia-vigilia") {
                        return;
                    }
                    if (!allHomePlanetCardNsids.has(nsid)) {
                        count += 1;
                    }
                });
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countPlanetTraits() {
        const result = new Map();
        const gameData = TI4.lastGameData.getLastGameData();
        if (gameData) {
            gameData.players.forEach((player, index) => {
                const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(index);
                let entry = result.get(playerSlot);
                if (!entry) {
                    entry = {
                        cultural: 0,
                        industrial: 0,
                        hazardous: 0,
                    };
                    result.set(playerSlot, entry);
                }
                const planetTotals = player.planetTotals;
                if (planetTotals) {
                    entry.cultural += planetTotals.traits.cultural;
                    entry.industrial += planetTotals.traits.industrial;
                    entry.hazardous += planetTotals.traits.hazardous;
                }
            });
        }
        return result;
    }
    countPlanetsWithAttachments() {
        const result = new Map();
        const playerSlotToPlanetCards = this._getPlayerSlotToPlanetCards();
        const ignoreAttachments = new Set([
            "token.attachment.planet:pok/sleeper-token",
            "token.attachment.planet:codex.vigil/custodia-vigilia",
        ]);
        playerSlotToPlanetCards.forEach((cards, playerSlot) => {
            let count = 0;
            cards.forEach((card) => {
                const nsid = ttpg_darrell_1.NSID.get(card);
                const planet = TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
                if (planet) {
                    count += planet
                        .getAttachments()
                        .filter((attachment) => {
                        // Some attachments are not *actually* attachments for this purpose.
                        const attachmentNsid = ttpg_darrell_1.NSID.get(attachment.getObj());
                        return !ignoreAttachments.has(attachmentNsid);
                    }).length;
                }
            });
            result.set(playerSlot, count);
        });
        return result;
    }
    countPlanetsWithStructuresOutsidePlayersHome() {
        const result = new Map();
        const structures = unit_plastic_1.UnitPlastic.getAll().filter((plastic) => {
            return (plastic.getUnit() === "space-dock" || plastic.getUnit() === "pds");
        });
        unit_plastic_1.UnitPlastic.assignPlanets(structures);
        // Per-player structures.
        const playerSlotToStructures = new Map();
        structures.forEach((structure) => {
            const playerSlot = structure.getOwningPlayerSlot();
            let playerStructures = playerSlotToStructures.get(playerSlot);
            if (!playerStructures) {
                playerStructures = [];
                playerSlotToStructures.set(playerSlot, playerStructures);
            }
            playerStructures.push(structure);
        });
        // Per-player home systems.
        const playerSlotToHomePlanetCardNsids = this._getPlayerSlotToHomePlanetCardNsids();
        playerSlotToStructures.forEach((playerStructures, playerSlot) => {
            const homeNsids = playerSlotToHomePlanetCardNsids.get(playerSlot);
            const nonHomePlanets = new Set();
            playerStructures.forEach((structure) => {
                const planet = structure.getPlanetClosest();
                if (planet) {
                    const nsid = planet.getPlanetCardNsid();
                    if (homeNsids && !homeNsids.has(nsid)) {
                        nonHomePlanets.add(nsid);
                    }
                }
            });
            const count = nonHomePlanets.size;
            result.set(playerSlot, count);
        });
        return result;
    }
    countPlanetsWithTechSpecialties() {
        const result = new Map();
        const playerSlotToPlanetCards = this._getPlayerSlotToPlanetCards();
        playerSlotToPlanetCards.forEach((cards, playerSlot) => {
            let count = 0;
            cards.forEach((card) => {
                const nsid = ttpg_darrell_1.NSID.get(card);
                const planet = TI4.systemRegistry.getPlanetByPlanetCardNsid(nsid);
                if (planet && planet.getTechs().length > 0) {
                    count += 1;
                }
            });
            result.set(playerSlot, count);
        });
        return result;
    }
    countStructures() {
        const result = new Map();
        const structures = unit_plastic_1.UnitPlastic.getAll().filter((plastic) => {
            return (plastic.getUnit() === "space-dock" || plastic.getUnit() === "pds");
        });
        // Per-player structures.
        const playerSlotToStructures = new Map();
        structures.forEach((structure) => {
            const playerSlot = structure.getOwningPlayerSlot();
            let playerStructures = playerSlotToStructures.get(playerSlot);
            if (!playerStructures) {
                playerStructures = [];
                playerSlotToStructures.set(playerSlot, playerStructures);
            }
            playerStructures.push(structure);
        });
        playerSlotToStructures.forEach((playerStructures, playerSlot) => {
            const count = playerStructures.length;
            result.set(playerSlot, count);
        });
        return result;
    }
    countSystemsWithControlledPlanetsInOrAdjToOthersHome() {
        const result = new Map();
        const playerSlotToHomeSystemHex = this._getPlayerSlotToHomeSystemHex();
        const allHomeSystemHexes = [
            ...playerSlotToHomeSystemHex.values(),
        ];
        const playerSlotToControlledPlanetHexes = this._getPlayerSlotToControlledPlanetHexes();
        // Final control check, different factions may have different
        // adjacency rules.
        const systemAdjacency = new system_adjacency_1.SystemAdjacency();
        playerSlotToHomeSystemHex.forEach((homeSystemHex, playerSlot) => {
            const otherHomeSystemHexes = allHomeSystemHexes.filter((hex) => {
                return hex !== homeSystemHex;
            });
            const adjHexes = new Set();
            const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
            otherHomeSystemHexes.forEach((otherHomeSystemHex) => {
                systemAdjacency
                    .getAdjHexes(otherHomeSystemHex, faction)
                    .forEach((adjHex) => {
                    adjHexes.add(adjHex);
                });
            });
            const controlledHexes = playerSlotToControlledPlanetHexes.get(playerSlot);
            if (controlledHexes) {
                let count = 0;
                controlledHexes.forEach((controlledHex) => {
                    if (adjHexes.has(controlledHex)) {
                        count += 1;
                    }
                });
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol() {
        const result = new Map();
        // Get all flagship and war sun hexes.
        const playerSlotToFlaghipOrWarSunHexes = new Map();
        unit_plastic_1.UnitPlastic.getAll().forEach((plastic) => {
            const nsid = ttpg_darrell_1.NSID.get(plastic.getObj());
            if (nsid.startsWith("unit:base/flagship") ||
                nsid.startsWith("unit:base/war-sun")) {
                const playerSlot = plastic.getOwningPlayerSlot();
                const hex = plastic.getHex();
                let hexes = playerSlotToFlaghipOrWarSunHexes.get(playerSlot);
                if (!hexes) {
                    hexes = new Set();
                    playerSlotToFlaghipOrWarSunHexes.set(playerSlot, hexes);
                }
                hexes.add(hex);
            }
        });
        // Get per-player and all home system hexes.
        const playerSlotToHomeSystemHex = this._getPlayerSlotToHomeSystemHex();
        const allHomeSystemHexes = new Set();
        playerSlotToHomeSystemHex.forEach((homeSystemHex, _playerSlot) => {
            allHomeSystemHexes.add(homeSystemHex);
        });
        // Get Mecatol hex.
        let mecatolHex = "<0,0,0>";
        const mecatol = TI4.systemRegistry.getBySystemTileNumber(18);
        if (mecatol) {
            const pos = mecatol.getObj().getPosition();
            mecatolHex = TI4.hex.fromPosition(pos);
        }
        // Count per-player.  (Map.forEach gets cranky with the HexType type.)
        const playerSlots = Array.from(playerSlotToFlaghipOrWarSunHexes.keys());
        playerSlots.forEach((playerSlot) => {
            const hexes = playerSlotToFlaghipOrWarSunHexes.get(playerSlot);
            const myHomeHex = playerSlotToHomeSystemHex.get(playerSlot);
            if (hexes) {
                let count = 0;
                hexes.forEach((hex) => {
                    if ((allHomeSystemHexes.has(hex) || hex === mecatolHex) &&
                        hex !== myHomeHex) {
                        count += 1;
                    }
                });
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countSystemsWithoutPlanetsWithUnits() {
        const result = new Map();
        const emptySystemHexes = new Set();
        TI4.systemRegistry
            .getAllSystemsWithObjs()
            .forEach((system) => {
            if (system.getPlanets().length === 0) {
                const pos = system.getObj().getPosition();
                const hex = TI4.hex.fromPosition(pos);
                emptySystemHexes.add(hex);
            }
        });
        unit_plastic_1.UnitPlastic.getAll().forEach((plastic) => {
            if (emptySystemHexes.has(plastic.getHex())) {
                const playerSlot = plastic.getOwningPlayerSlot();
                let count = result.get(playerSlot) || 0;
                count += 1;
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countSystemsWithShipsAdjToMecatol() {
        const result = new Map();
        let mecatolHex = "<0,0,0>";
        const mecatol = TI4.systemRegistry.getBySystemTileNumber(18);
        if (mecatol) {
            const pos = mecatol.getObj().getPosition();
            mecatolHex = TI4.hex.fromPosition(pos);
        }
        const shipTypes = new Set();
        TI4.unitAttrsRegistry
            .defaultUnitAttrsSet()
            .getAll()
            .forEach((unitAttrs) => {
            const unitType = unitAttrs.getUnit();
            if (unitAttrs.isShip()) {
                shipTypes.add(unitType);
            }
        });
        const playerSlotToShipHexes = new Map();
        unit_plastic_1.UnitPlastic.getAll().forEach((plastic) => {
            const unitType = plastic.getUnit();
            if (shipTypes.has(unitType)) {
                const playerSlot = plastic.getOwningPlayerSlot();
                const hex = plastic.getHex();
                let hexes = playerSlotToShipHexes.get(playerSlot);
                if (!hexes) {
                    hexes = new Set();
                    playerSlotToShipHexes.set(playerSlot, hexes);
                }
                hexes.add(hex);
            }
        });
        // Different factions may have different adjacency rules.
        const systemAdjacency = new system_adjacency_1.SystemAdjacency();
        TI4.playerSeats.getAllSeats().forEach((seat) => {
            const playerSlot = seat.playerSlot;
            const faction = TI4.factionRegistry.getByPlayerSlot(playerSlot);
            const adjHexes = systemAdjacency.getAdjHexes(mecatolHex, faction);
            const shipHexes = playerSlotToShipHexes.get(playerSlot);
            if (shipHexes) {
                let count = 0;
                for (const hex of shipHexes) {
                    if (adjHexes.has(hex)) {
                        count += 1;
                    }
                }
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countSystemsWithUnitsInLegendaryMecatolOrAnomaly() {
        const result = new Map();
        const targetHexes = new Set();
        TI4.systemRegistry
            .getAllSystemsWithObjs()
            .forEach((system) => {
            if (system.getSystemTileNumber() === 18 ||
                system.isLegendary() ||
                system.getAnomalies().length > 0) {
                const pos = system.getObj().getPosition();
                const hex = TI4.hex.fromPosition(pos);
                targetHexes.add(hex);
            }
        });
        const playerSlotToUnitHexes = new Map();
        unit_plastic_1.UnitPlastic.getAll().forEach((plastic) => {
            const playerSlot = plastic.getOwningPlayerSlot();
            const hex = plastic.getHex();
            let hexes = playerSlotToUnitHexes.get(playerSlot);
            if (!hexes) {
                hexes = new Set();
                playerSlotToUnitHexes.set(playerSlot, hexes);
            }
            hexes.add(hex);
        });
        TI4.playerSeats.getAllSeats().forEach((seat) => {
            const playerSlot = seat.playerSlot;
            const unitHexes = playerSlotToUnitHexes.get(playerSlot);
            if (unitHexes) {
                let count = 0;
                for (const hex of unitHexes) {
                    if (targetHexes.has(hex)) {
                        count += 1;
                    }
                }
                result.set(playerSlot, count);
            }
        });
        return result;
    }
    countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome() {
        const result = new Map();
        const edgeHexes = new Set();
        const edgeSystemClasses = new Set(["edge", "off-map"]);
        const mapHexes = new Set();
        TI4.systemRegistry
            .getAllSystemsWithObjs()
            .forEach((system) => {
            const pos = system.getObj().getPosition();
            const hex = TI4.hex.fromPosition(pos);
            const systemClass = system.getClass();
            if (systemClass === "map") {
                mapHexes.add(hex);
            }
            else if (edgeSystemClasses.has(systemClass)) {
                edgeHexes.add(hex);
            }
        });
        // Look for edge systems just looking at the map hexes.
        mapHexes.forEach((hex) => {
            const offMapNeighbors = ttpg_darrell_1.Hex.neighbors(hex).filter((neighbor) => {
                return !mapHexes.has(neighbor);
            });
            if (offMapNeighbors.length > 0) {
                edgeHexes.add(hex);
            }
        });
        const playerSlotToUnitHexes = new Map();
        unit_plastic_1.UnitPlastic.getAll().forEach((plastic) => {
            const playerSlot = plastic.getOwningPlayerSlot();
            const hex = plastic.getHex();
            let hexes = playerSlotToUnitHexes.get(playerSlot);
            if (!hexes) {
                hexes = new Set();
                playerSlotToUnitHexes.set(playerSlot, hexes);
            }
            hexes.add(hex);
        });
        const playerSlotToHomeSystemHex = this._getPlayerSlotToHomeSystemHex();
        playerSlotToUnitHexes.forEach((unitHexes, playerSlot) => {
            const homeHex = playerSlotToHomeSystemHex.get(playerSlot);
            let count = 0;
            for (const hex of unitHexes) {
                if (edgeHexes.has(hex) && hex !== homeHex) {
                    count += 1;
                }
            }
            result.set(playerSlot, count);
        });
        return result;
    }
    countTechnologyColors() {
        const result = new Map();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const tech = TI4.techRegistry.getByNsid(nsid);
            if (tech) {
                const pos = obj.getPosition();
                const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                let entry = result.get(playerSlot);
                if (!entry) {
                    entry = {
                        blue: 0,
                        green: 0,
                        red: 0,
                        yellow: 0,
                        unitUpgrade: 0,
                    };
                    result.set(playerSlot, entry);
                }
                const color = tech.getColor();
                if (color === "blue") {
                    entry.blue += 1;
                }
                else if (color === "green") {
                    entry.green += 1;
                }
                else if (color === "red") {
                    entry.red += 1;
                }
                else if (color === "yellow") {
                    entry.yellow += 1;
                }
                else if (color === "unit-upgrade") {
                    entry.unitUpgrade += 1;
                }
            }
        }
        return result;
    }
    countTokensInTacticAndStrategy() {
        const result = new Map();
        const gameData = TI4.lastGameData.getLastGameData();
        if (gameData) {
            gameData.players.forEach((player, index) => {
                const playerSlot = TI4.playerSeats.getPlayerSlotBySeatIndex(index);
                const commandTokensType = player.commandTokens;
                if (commandTokensType) {
                    const value = commandTokensType.tactics + commandTokensType.strategy;
                    result.set(playerSlot, value);
                }
            });
        }
        return result;
    }
}
exports.GoalCounter = GoalCounter;
//# sourceMappingURL=goal-counter.js.map