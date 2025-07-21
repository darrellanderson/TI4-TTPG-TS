"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatRoll = exports.CombatRollPerPlayerData = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const system_adjacency_1 = require("../../system-lib/system-adjacency/system-adjacency");
const unit_attrs_1 = require("../../unit-lib/unit-attrs/unit-attrs");
const unit_modifier_1 = require("../../unit-lib/unit-modifier/unit-modifier");
const unit_modifier_active_idle_1 = require("../../unit-lib/unit-modifier/unit-modifier-active-idle");
const unit_plastic_1 = require("../../unit-lib/unit-plastic/unit-plastic");
class CombatRollPerPlayerData {
    constructor() {
        this.playerSlot = -1;
        this.unitAttrsSet = TI4.unitAttrsRegistry.defaultUnitAttrsSet();
        this.unitPlasticHex = [];
        this.unitPlasticAdj = [];
        this.overrideUnitCountHex = new Map();
        this.overrideUnitCountAdj = new Map();
    }
    /**
     * Try to add a synthetic unit to the player's unit set.
     * Only works if unit type does not already exist.
     *
     * The schema.unit "UnitType" restriction may need to be
     * violated with a "string as UnitType" cast.
     *
     * @param schema
     * @param count
     * @returns
     */
    addSyntheticUnit(schema, count) {
        if (!this.unitAttrsSet.addSyntheticUnit(schema)) {
            return false;
        }
        this.overrideUnitCountHex.set(schema.unit, count);
        return true;
    }
    getCount(unit) {
        let count = this.overrideUnitCountHex.get(unit);
        if (count !== undefined) {
            return count;
        }
        count = 0;
        for (const unitPlastic of this.unitPlasticHex) {
            if (unitPlastic.getUnit() === unit) {
                count += unitPlastic.getCount();
            }
        }
        return count;
    }
    getCountAdj(unit) {
        let count = 0;
        for (const unitPlastic of this.unitPlasticAdj) {
            if (unitPlastic.getUnit() === unit) {
                count += unitPlastic.getCount();
            }
        }
        return count;
    }
    hasUnit(unit) {
        return this.getCount(unit) > 0;
    }
    hasUnitAdj(unit) {
        return this.getCountAdj(unit) > 0;
    }
}
exports.CombatRollPerPlayerData = CombatRollPerPlayerData;
class CombatRoll {
    static createCooked(params) {
        return new CombatRoll(params)
            .applyUnitPlasticAndSetOpponentPlayerSlot() // assign opponent player slot early!
            .applyFactions() // assign before overrides, to allow for faction units
            .applyUnitOverries()
            .applyUnitModifiersOrThrow(); // always do this last, reads state others set
    }
    constructor(params) {
        this._cardUtil = new ttpg_darrell_1.CardUtil();
        this._modifiers = [];
        // Share for unit modifiers.
        this.find = new ttpg_darrell_1.Find();
        this._params = params;
        this.self = new CombatRollPerPlayerData();
        this.self.playerSlot = params.rollingPlayerSlot;
        this.opponent = new CombatRollPerPlayerData();
        this.opponent.playerSlot = -1;
        if (params.rollingPlayerSlot !== params.activatingPlayerSlot) {
            this.opponent.playerSlot = params.activatingPlayerSlot;
        }
        this._adjHexes = new system_adjacency_1.SystemAdjacency().getAdjHexes(params.hex, this.self.faction);
        const pos = TI4.hex.toPosition(params.hex);
        this.system = TI4.systemRegistry.getByPosition(pos);
        if (this.system) {
            for (const planet of this.system.getPlanets()) {
                if (planet.getName() === params.planetName) {
                    this.planet = planet;
                    break;
                }
            }
        }
    }
    _findUnitPlastics() {
        const unitPlastics = unit_plastic_1.UnitPlastic.getAll().filter((unitPlastic) => {
            return (unitPlastic.getHex() === this._params.hex ||
                this._adjHexes.has(unitPlastic.getHex()));
        });
        unit_plastic_1.UnitPlastic.assignOwners(unitPlastics);
        unit_plastic_1.UnitPlastic.assignPlanets(unitPlastics);
        return unitPlastics;
    }
    _findUnitAttrOverrides(playerSlot) {
        // Find unit upgrade cards owned by the player.
        const overrideAttrsArray = [];
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            const attrs = TI4.unitAttrsRegistry.rawByNsid(nsid);
            if (attrs) {
                let useAttrs = true;
                if (obj instanceof api_1.Card) {
                    const allowFaceDown = false;
                    const rejectSnapPointTags = ["discard"];
                    useAttrs = this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags);
                }
                if (useAttrs) {
                    const pos = obj.getPosition();
                    const closest = this.find.closestOwnedCardHolderOwner(pos);
                    if (closest === playerSlot) {
                        overrideAttrsArray.push(attrs);
                    }
                }
            }
        }
        // Faction flagship, other base unit overrides.
        let faction = undefined;
        if (playerSlot === this.self.playerSlot) {
            faction = this.self.faction;
        }
        else if (playerSlot === this.opponent.playerSlot) {
            faction = this.opponent.faction;
        }
        if (faction) {
            const unitNsids = [...faction.getUnitOverrideNsids()];
            for (const unitNsid of unitNsids) {
                const attrs = TI4.unitAttrsRegistry.rawByNsid(unitNsid);
                if (attrs) {
                    overrideAttrsArray.push(attrs);
                }
            }
        }
        unit_attrs_1.UnitAttrs.sortByOverrideOrder(overrideAttrsArray);
        return overrideAttrsArray;
    }
    _findUnitModifiers(selfSlot, opponentSlot) {
        const unitModifiers = [];
        const skipContained = true;
        // Control tokens on cards take precedence over cards being near players.
        // Find all control tokens early, reuse when asked.
        const controlTokens = [];
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("token.control:")) {
                controlTokens.push(obj);
            }
        }
        const getControlTokenOwner = (card) => {
            const atop = new ttpg_darrell_1.Atop(card);
            for (const controlToken of controlTokens) {
                if (atop.isAtop(controlToken.getPosition())) {
                    return controlToken.getOwningPlayerSlot();
                }
            }
            return -1;
        };
        // Set owningPlayerSlot = -1 to look for control token or closest player.
        // Requires an object be given!
        const maybeAddModifier = (nsid, obj, owningPlayerSlot) => {
            const modifier = TI4.unitModifierRegistry.getByNsid(nsid);
            if (modifier) {
                // Only use cards when face-up.
                let useModifier = true;
                if (obj instanceof api_1.Card) {
                    const allowFaceDown = false;
                    const rejectSnapPointTags = ["discard"];
                    useModifier = this._cardUtil.isLooseCard(obj, allowFaceDown, rejectSnapPointTags);
                }
                if (modifier.isActiveIdle() &&
                    obj &&
                    !unit_modifier_active_idle_1.UnitModifierActiveIdle.isActive(obj)) {
                    useModifier = false;
                }
                // Self-promissory notes are "for sale" and not active.
                if (nsid.startsWith("card.promissory:") && obj && this.self.faction) {
                    const pos = obj.getPosition();
                    const closest = this.find.closestOwnedCardHolderOwner(pos);
                    if (closest === selfSlot &&
                        this.self.faction.getPromissoryNsids().includes(nsid)) {
                        useModifier = false;
                    }
                }
                if (useModifier) {
                    // Control token takes precedence for ownership, otherwise closest player.
                    if (obj) {
                        owningPlayerSlot = getControlTokenOwner(obj);
                        if (owningPlayerSlot < 0) {
                            const pos = obj.getPosition();
                            owningPlayerSlot = this.find.closestOwnedCardHolderOwner(pos);
                        }
                    }
                    const isSelf = owningPlayerSlot === selfSlot;
                    const isOpponent = owningPlayerSlot === opponentSlot;
                    const requireAny = modifier.getOwner() === "any";
                    const requireSelf = modifier.getOwner() === "self";
                    const requireOpponent = modifier.getOwner() === "opponent";
                    if (requireAny ||
                        (isSelf && requireSelf) ||
                        (isOpponent && requireOpponent)) {
                        unitModifiers.push(modifier);
                    }
                }
            }
        };
        // Modifiers on table.
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            const nsid = ttpg_darrell_1.NSID.get(obj);
            maybeAddModifier(nsid, obj, -1);
        }
        // Faction flagship, abilities.
        const dataArray = [
            this.self,
            this.opponent,
        ];
        for (const data of dataArray) {
            if (data.faction) {
                for (const abilityNsid of data.faction.getAbilityNsids()) {
                    maybeAddModifier(abilityNsid, undefined, data.playerSlot);
                }
                // Add flagship (other unit-based modifiers are on cards).
                for (const nsid of data.faction.getUnitOverrideNsids()) {
                    const unitAttrsSchema = TI4.unitAttrsRegistry.rawByNsid(nsid);
                    if (unitAttrsSchema !== undefined &&
                        unitAttrsSchema.unit === "flagship" &&
                        data.hasUnit("flagship")) {
                        maybeAddModifier(nsid, undefined, data.playerSlot);
                    }
                }
            }
        }
        // "Always" modifiers.
        for (const modifier of TI4.unitModifierRegistry.getAlways()) {
            if (modifier.applies(this)) {
                unitModifiers.push(modifier);
            }
        }
        unit_modifier_1.UnitModifier.sortByApplyOrder(unitModifiers);
        return unitModifiers;
    }
    _getUnitToCombatAttrs() {
        const result = new Map();
        const rollType = this._params.rollType;
        for (const unitAttrs of this.self.unitAttrsSet.getAll()) {
            let combatAttrs = undefined;
            switch (rollType) {
                case "antiFighterBarrage":
                    if (!unitAttrs.getDisableAntiFighterBarrage()) {
                        combatAttrs = unitAttrs.getAntiFighterBarrage();
                    }
                    break;
                case "bombardment":
                    if (!unitAttrs.getDisableBombardment()) {
                        combatAttrs = unitAttrs.getBombardment();
                    }
                    break;
                case "groundCombat":
                    combatAttrs = unitAttrs.getGroundCombat();
                    break;
                case "spaceCannonDefense":
                    if (!unitAttrs.getDisableSpaceCannonDefense()) {
                        combatAttrs = unitAttrs.getSpaceCannon();
                    }
                    break;
                case "spaceCannonOffense":
                    if (!unitAttrs.getDisableSpaceCannonOffense()) {
                        combatAttrs = unitAttrs.getSpaceCannon();
                    }
                    break;
                case "spaceCombat":
                    combatAttrs = unitAttrs.getSpaceCombat();
                    break;
            }
            if (combatAttrs) {
                result.set(unitAttrs.getUnit(), combatAttrs);
            }
        }
        return result;
    }
    applyUnitPlasticAndSetOpponentPlayerSlot() {
        const unitPlastics = this._findUnitPlastics();
        const isGroundSet = new Set();
        const isShipSet = new Set();
        for (const unitAttrs of this.opponent.unitAttrsSet.getAll()) {
            if (unitAttrs.isGround()) {
                isGroundSet.add(unitAttrs.getUnit());
            }
            if (unitAttrs.isShip()) {
                isShipSet.add(unitAttrs.getUnit());
            }
        }
        // If opponent is not assigned, look for units belonging to another player.
        // (Look only at units in some "area", space or ground.)
        if (this.opponent.playerSlot === -1) {
            let relevant = [];
            if (this._params.planetName) {
                relevant = unitPlastics.filter((unitPlastic) => {
                    const planet = unitPlastic.getPlanetClosest();
                    return (isGroundSet.has(unitPlastic.getUnit()) &&
                        planet &&
                        planet.getName() === this._params.planetName);
                });
            }
            else {
                relevant = unitPlastics.filter((unitPlastic) => {
                    return isShipSet.has(unitPlastic.getUnit());
                });
            }
            const candidates = new Set();
            for (const unitPlastic of relevant) {
                const playerSlot = unitPlastic.getOwningPlayerSlot();
                if (playerSlot !== -1 && playerSlot !== this.self.playerSlot) {
                    candidates.add(playerSlot);
                }
            }
            // If only one other player has relevant units, assign them as opponent.
            // Otherwise either player error with other units there, or some rule
            // allowing for multiple players to have units in the same area.
            // Unclear how to resolve that until rules are known.
            if (candidates.size === 1) {
                const value = candidates.values().next().value;
                if (value !== undefined) {
                    this.opponent.playerSlot = value;
                }
            }
        }
        // Fill in all units for each player.
        // Do not prune here, unit modifiers may add attributes.
        for (const unitPlastic of unitPlastics) {
            // Self or opponent?
            const playerSlot = unitPlastic.getOwningPlayerSlot();
            let playerData = undefined;
            let plasticArray = undefined;
            if (playerSlot === this.self.playerSlot) {
                playerData = this.self;
            }
            else if (playerSlot === this.opponent.playerSlot) {
                playerData = this.opponent;
            }
            if (playerData) {
                if (unitPlastic.getHex() === this._params.hex) {
                    plasticArray = playerData.unitPlasticHex;
                }
                else {
                    plasticArray = playerData.unitPlasticAdj;
                }
            }
            if (plasticArray) {
                plasticArray.push(unitPlastic);
            }
        }
        return this;
    }
    applyFactions() {
        // Get actual factions.
        const playerSlotToFaction = TI4.factionRegistry.getPlayerSlotToFaction();
        this.self.faction = playerSlotToFaction.get(this.self.playerSlot);
        this.opponent.faction = playerSlotToFaction.get(this.opponent.playerSlot);
        // Let params override (for testing).
        if (this._params.overrideSelfFaction) {
            this.self.faction = this._params.overrideSelfFaction;
        }
        if (this._params.overrideOpponentFaction) {
            this.opponent.faction = this._params.overrideOpponentFaction;
        }
        return this;
    }
    applyUnitOverries() {
        for (const data of [this.self, this.opponent]) {
            const unitOverrides = this._findUnitAttrOverrides(data.playerSlot);
            for (const unitOverride of unitOverrides) {
                const unit = unitOverride.unit;
                const unitAttrs = data.unitAttrsSet.get(unit);
                if (unitAttrs) {
                    unitAttrs.applyOverride(unitOverride);
                }
            }
        }
        return this;
    }
    applyUnitModifiers(errors) {
        const unitModifiers = this._findUnitModifiers(this.self.playerSlot, this.opponent.playerSlot);
        for (const modifier of unitModifiers) {
            // Run each modifier in a try/catch block, an error will only suppress
            // one modifier, not the whole set (or the call stack!).
            try {
                if (modifier.applies(this)) {
                    this._modifiers.push(modifier);
                    modifier.apply(this);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                errors.push(e);
            }
        }
        return this;
    }
    applyUnitModifiersOrThrow() {
        const errors = [];
        this.applyUnitModifiers(errors);
        if (errors.length > 0) {
            const joined = errors.map((e) => e.stack).join("\n");
            throw new Error(joined);
        }
        return this;
    }
    bestHitUnitWithCombatAttrs() {
        const unitToCombatAttrs = this._getUnitToCombatAttrs(); // the current roll type
        let bestUnit = undefined;
        let bestCombatAttrs = undefined;
        let bestHit = Number.MAX_SAFE_INTEGER;
        for (const [unit, combatAttrs] of unitToCombatAttrs.entries()) {
            const has = this.self.hasUnit(unit);
            const hit = combatAttrs.getHit();
            if (has && hit < bestHit) {
                bestHit = hit;
                bestUnit = unit;
                bestCombatAttrs = combatAttrs;
            }
        }
        if (bestUnit && bestCombatAttrs) {
            return { unit: bestUnit, combatAttrs: bestCombatAttrs };
        }
        return undefined;
    }
    _pruneToUnitsClosestToPlanet() {
        for (let i = this.self.unitPlasticHex.length - 1; i >= 0; i--) {
            const unitPlastic = this.self.unitPlasticHex[i];
            if (unitPlastic) {
                const planet = unitPlastic.getPlanetClosest();
                if (planet && planet.getName() !== this._params.planetName) {
                    this.self.unitPlasticHex.splice(i, 1);
                }
            }
        }
        for (let i = this.opponent.unitPlasticHex.length - 1; i >= 0; i--) {
            const unitPlastic = this.opponent.unitPlasticHex[i];
            if (unitPlastic) {
                const planet = unitPlastic.getPlanetClosest();
                if (planet && planet.getName() !== this._params.planetName) {
                    this.opponent.unitPlasticHex.splice(i, 1);
                }
            }
        }
        return this;
    }
    _checkCancelBombardment() {
        // Check if active planetary shield in opponent and no
        // disable planetary shield in self.
        let hasPlanetaryShield = false;
        for (const unitAttrs of this.opponent.unitAttrsSet.getAll()) {
            const unit = unitAttrs.getUnit();
            const hasUnit = this.opponent.hasUnit(unit);
            if (unitAttrs.hasPlanetaryShild() && hasUnit) {
                hasPlanetaryShield = true;
                break;
            }
        }
        let hasDisablePlanetaryShield = false;
        for (const unitAttrs of this.self.unitAttrsSet.getAll()) {
            const unit = unitAttrs.getUnit();
            const hasUnit = this.self.hasUnit(unit);
            if (unitAttrs.getDisablePlanetaryShield() && hasUnit) {
                hasDisablePlanetaryShield = true;
                break;
            }
        }
        return hasPlanetaryShield && !hasDisablePlanetaryShield;
    }
    createDiceParamsArray() {
        const result = [];
        const unitToCombatAttrs = this._getUnitToCombatAttrs();
        // If appropriate, prune to units on planet.
        const requirePlanet = this._params.rollType === "bombardment" ||
            this._params.rollType === "spaceCannonDefense" ||
            this._params.rollType === "groundCombat";
        if (requirePlanet) {
            this._pruneToUnitsClosestToPlanet();
        }
        if (this._params.rollType === "bombardment" &&
            this._checkCancelBombardment()) {
            return [];
        }
        for (const unitAttrs of this.self.unitAttrsSet.getAll()) {
            const unit = unitAttrs.getUnit();
            const combatAttrs = unitToCombatAttrs.get(unit);
            if (combatAttrs) {
                const hexCount = this.self.getCount(unit);
                const adjCount = this.self.getCountAdj(unit);
                let count = hexCount;
                if (combatAttrs.getRange() > 0) {
                    count += adjCount;
                }
                // Account for multi-dice units.
                count *= combatAttrs.getDice();
                // Account for bonus dice (e.g. plasma scoring).
                count += combatAttrs.getExtraDice();
                for (let i = 0; i < count; i++) {
                    const params = {
                        sides: 10,
                        id: unit,
                        name: unitAttrs.getName(),
                        hit: combatAttrs.getHit(),
                        reroll: combatAttrs.getRerollMisses(),
                        primaryColor: unitAttrs.getDiceColor(),
                        secondaryColor: new api_1.Color(1, 1, 1),
                    };
                    const crit = combatAttrs.getCrit();
                    if (crit !== undefined) {
                        params.crit = crit;
                        params.critCount = combatAttrs.getCritCount();
                    }
                    result.push(params);
                }
            }
        }
        return result;
    }
    getActivatingPlayerSlot() {
        return this._params.activatingPlayerSlot;
    }
    getUnitModifierNames() {
        return this._modifiers.map((modifier) => modifier.getName());
    }
    getUnitModifierNamesWithDescriptions() {
        return this._modifiers.map((modifier) => `${modifier.getName()} (${modifier.getDescription()})`);
    }
    getRollType() {
        return this._params.rollType;
    }
    getPlanetName() {
        return this._params.planetName;
    }
    roll(player, position) {
        const doFakeRoll = this._params.rollingPlayerSlot === 19 ||
            api_1.GameWorld.getExecutionReason() === "unittest";
        const callback = (diceResults, _player) => {
            TI4.events.onCombatResult.trigger(this, diceResults);
            if (this.opponent.playerSlot === 19) {
                // Opponent is anonymous units, roll for them.
                const anonRoll = CombatRoll.createCooked({
                    rollType: this._params.rollType,
                    hex: this._params.hex,
                    activatingPlayerSlot: this._params.activatingPlayerSlot,
                    rollingPlayerSlot: 19,
                });
                anonRoll.roll(player, position);
            }
        };
        const diceParams = this.createDiceParamsArray();
        const diceGroupParams = {
            diceParams,
            player,
            position,
            callback,
            doFakeRoll,
        };
        ttpg_darrell_1.DiceGroup.roll(diceGroupParams);
    }
}
exports.CombatRoll = CombatRoll;
//# sourceMappingURL=combat-roll.js.map