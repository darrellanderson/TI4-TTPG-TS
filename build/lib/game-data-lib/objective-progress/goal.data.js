"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOAL_DATA_ENTRIES = void 0;
const goal_progress_1 = require("./goal-progress");
const goalProgress = new goal_progress_1.GoalProgress();
exports.GOAL_DATA_ENTRIES = [
    {
        abbr: "3 INF 3 RES 3 TG",
        name: "Amass Wealth",
        nsid: "card.objective.public-1:pok/amass-wealth",
        get: () => {
            return goalProgress.infResTgs(3);
        },
    },
    {
        abbr: "4 STRUCTURES",
        name: "Build Defenses",
        nsid: "card.objective.public-1:pok/build-defenses",
        get: () => {
            // 4 structures
            return goalProgress.structures(4);
        },
    },
    {
        abbr: "4 PLANET SAME TRAIT",
        name: "Corner the Market",
        nsid: "card.objective.public-1:base/corner-the-market",
        get: () => {
            // 4 planets same trait
            return goalProgress.planetsSameTrait(4);
        },
    },
    {
        abbr: "2 UNIT UPGRADES",
        name: "Develop Weaponry",
        nsid: "card.objective.public-1:base/develop-weaponry",
        get: () => {
            // 2 unit upgrades
            return goalProgress.techUnitUpgrades(2);
        },
    },
    {
        abbr: "2 ATTACHMENTS",
        name: "Discover Lost Outposts",
        nsid: "card.objective.public-1:pok/discover-lost-outposts",
        get: () => {
            // 2 planets with attachments
            return goalProgress.planetsWithAttachments(2);
        },
    },
    {
        abbr: "2 TECH 2 COLORS",
        name: "Diversify Research",
        nsid: "card.objective.public-1:base/diversify-research",
        get: () => {
            // 2 tech in 2 colors
            return goalProgress.twoTechInColors(2);
        },
    },
    {
        abbr: "FLAG/WAR SUN",
        name: "Engineer a Marvel",
        nsid: "card.objective.public-1:pok/engineer-a-marvel",
        get: () => {
            // Flagship or war sun
            return goalProgress.flagshipOrWarSun(1);
        },
    },
    {
        abbr: "8 RESOURCES",
        name: "Erect a Monument",
        nsid: "card.objective.public-1:base/erect-a-monument",
        get: () => {
            // 8 resources
            return goalProgress.resources(8);
        },
    },
    {
        abbr: "6 NON-HOME PLANET",
        name: "Expand Borders",
        nsid: "card.objective.public-1:base/expand-borders",
        get: () => {
            // 6 planets non-home
            // IN A SYSTEM, therefore not including custodia vigilia
            const excludeCustodiaVigilia = true;
            return goalProgress.planetsNonHome(6, excludeCustodiaVigilia);
        },
    },
    {
        abbr: "3 EMPTY SYS",
        name: "Explore Deep Space",
        nsid: "card.objective.public-1:pok/explore-deep-space",
        get: () => {
            // 3 empty systems
            return goalProgress.systemsWithoutPlanetsWithUnits(3);
        },
    },
    {
        abbr: "3 TECH SPECIALTY",
        name: "Found Research Outposts",
        nsid: "card.objective.public-1:base/found-research-outposts",
        get: () => {
            // 3 planets with tech
            return goalProgress.planetsWithTechSpecialties(3);
        },
    },
    {
        abbr: "3 STRUCT NOT HOME",
        name: "Improve Infrastructure",
        nsid: "card.objective.public-1:pok/improve-infrastructure",
        get: () => {
            // 3 planets with structures outside own home
            return goalProgress.planetsWithStructuresOutsidePlayersHome(3);
        },
    },
    {
        abbr: "2 SYS ADJ TO MR",
        name: "Intimidate the Council",
        nsid: "card.objective.public-1:base/intimidate-council",
        get: () => {
            // 2 systems with ships adj to mecatol
            return goalProgress.systemsWithShipsAdjToMecatol(2);
        },
    },
    {
        abbr: "3 COMMAND TOKENS",
        name: "Lead from the Front",
        nsid: "card.objective.public-1:base/lead-from-the-front",
        get: () => {
            // 3 tokens from tactics/strategy
            return goalProgress.tokensInTacticAndStrategy(3);
        },
    },
    {
        abbr: "2 LGND/MR/ANOM",
        name: "Make History",
        nsid: "card.objective.public-1:pok/make-history",
        get: () => {
            // 2 systems with legendary, mecatol, or anomaly
            return goalProgress.systemsWithUnitsInLegendaryMecatolOrAnomaly(2);
        },
    },
    {
        abbr: "5 TRADE GOODS",
        name: "Negotiate Trade Routes",
        nsid: "card.objective.public-1:base/negotiate-trade-routes",
        get: () => {
            // 5 tradegoods
            return goalProgress.tradegoods(5);
        },
    },
    {
        abbr: "3 EDGE SYS",
        name: "Populate the Outer Rim",
        nsid: "card.objective.public-1:pok/populate-the-outer-rim",
        get: () => {
            // 3 systems with units on edge
            return goalProgress.systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(3);
        },
    },
    {
        abbr: "> 2 NGHBRS",
        name: "Push Boundaries",
        nsid: "card.objective.public-1:pok/push-boundaries",
        get: () => {
            // More planets than 2 neighbors
            return goalProgress.morePlanetsThan2Neighbors();
        },
    },
    {
        abbr: "5 NON-FGTR SHIPS",
        name: "Raise a Fleet",
        nsid: "card.objective.public-1:pok/raise-a-fleet",
        get: () => {
            // 1 system with 5 non-fighter ships
            return goalProgress.maxNonFighterShipsInSingleSystem(5);
        },
    },
    {
        abbr: "8 INFLUENCE",
        name: "Sway the Council",
        nsid: "card.objective.public-1:base/sway-the-council",
        get: () => {
            // 8 influence
            return goalProgress.influence(8);
        },
    },
    {
        abbr: "FLAG/WS ON MR/HS",
        name: "Achieve Supremacy",
        nsid: "card.objective.public-2:pok/achieve-supremacy",
        get: () => {
            // Flagship or war sun in other player's home or mecatol
            return goalProgress.systemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(1);
        },
    },
    {
        abbr: "4 LGND/MR/ANOM",
        name: "Become a Legend",
        nsid: "card.objective.public-2:pok/become-a-legend",
        get: () => {
            // 4 systems with units where legendary, mecatol, or anomaly
            return goalProgress.systemsWithUnitsInLegendaryMecatolOrAnomaly(4);
        },
    },
    {
        abbr: "10 TRADE GOODS",
        name: "Centralize Galactic Trade",
        nsid: "card.objective.public-2:base/centralize-galactic-trade",
        get: () => {
            // 10 tradegoods
            return goalProgress.tradegoods(10);
        },
    },
    {
        abbr: "8 NON-FGTR SHIPS",
        name: "Command an Armada",
        nsid: "card.objective.public-2:pok/command-an-armada",
        get: () => {
            // 1 system with 8 non-fighter ships
            return goalProgress.maxNonFighterShipsInSingleSystem(8);
        },
    },
    {
        abbr: "1 OPPONENT HOME",
        name: "Conquer the Weak",
        nsid: "card.objective.public-2:base/conquer-the-weak",
        get: () => {
            // 1 planet in another's home system
            return goalProgress.planetsInOthersHome(1);
        },
    },
    {
        abbr: "7 STRUCTURES",
        name: "Construct Massive Cities",
        nsid: "card.objective.public-2:pok/construct-massive-cities",
        get: () => {
            // 7 structures
            return goalProgress.structures(7);
        },
    },
    {
        abbr: "5 EDGE SYS",
        name: "Control the Borderlands",
        nsid: "card.objective.public-2:pok/control-the-borderlands",
        get: () => {
            // 5 systems with units on edge
            return goalProgress.systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(5);
        },
    },
    {
        abbr: "5 TECH SPECIALTY",
        name: "Form Galactic Brain Trust",
        nsid: "card.objective.public-2:base/form-galactic-brain-trust",
        get: () => {
            // 5 planets with tech
            return goalProgress.planetsWithTechSpecialties(5);
        },
    },
    {
        abbr: "16 RESOURCES",
        name: "Found a Golden Age",
        nsid: "card.objective.public-2:base/found-a-golden-age",
        get: () => {
            // 16 resources
            return goalProgress.resources(16);
        },
    },
    {
        abbr: "6 COMMAND TOKENS",
        name: "Galvanize the People",
        nsid: "card.objective.public-2:base/galvanize-the-people",
        get: () => {
            // 6 tokens from tactics/strategy
            return goalProgress.tokensInTacticAndStrategy(6);
        },
    },
    {
        abbr: "6 INF 6 RES 6 TG",
        name: "Hold Vast Reserves",
        nsid: "card.objective.public-2:pok/hold-vast-reserves",
        get: () => {
            // Spend 6 inf, 6 res, 6 tgs
            return goalProgress.infResTgs(6);
        },
    },
    {
        abbr: "16 INFLUENCE",
        name: "Manipulate Galactic Law",
        nsid: "card.objective.public-2:base/manipulate-galactic-law",
        get: () => {
            // 16 influence
            return goalProgress.influence(16);
        },
    },
    {
        abbr: "2 TECH 4 COLORS",
        name: "Master the Sciences",
        nsid: "card.objective.public-2:base/master-the-sciences",
        get: () => {
            // 2 tech in 4 colors
            return goalProgress.twoTechInColors(4);
        },
    },
    {
        abbr: "5 EMPTY SYS",
        name: "Patrol Vast Territories",
        nsid: "card.objective.public-2:pok/patrol-vast-territories",
        get: () => {
            // 5 empty systems
            return goalProgress.systemsWithoutPlanetsWithUnits(5);
        },
    },
    {
        abbr: "5 STRUCT NOT HOME",
        name: "Protect the Border",
        nsid: "card.objective.public-2:pok/protect-the-border",
        get: () => {
            // 5 planets with structures outside own home
            return goalProgress.planetsWithStructuresOutsidePlayersHome(5);
        },
    },
    {
        abbr: "3 ATTACHMENTS",
        name: "Reclaim Ancient Monuments",
        nsid: "card.objective.public-2:pok/reclaim-ancient-monuments",
        get: () => {
            // 3 planets with attachments
            return goalProgress.planetsWithAttachments(3);
        },
    },
    {
        abbr: "3 UNIT UPGRADES",
        name: "Revolutionize Warfare",
        nsid: "card.objective.public-2:base/revolutionize-warfare",
        get: () => {
            // 3 unit upgrades
            return goalProgress.techUnitUpgrades(3);
        },
    },
    {
        abbr: "2 IN/ADJ OTHER HS",
        name: "Rule Distant Lands",
        nsid: "card.objective.public-2:pok/rule-distant-lands",
        get: () => {
            // 2 planets in or adjacent to different other homes
            return goalProgress.systemsWithControlledPlanetsInOrAdjToOthersHome(2);
        },
    },
    {
        abbr: "11 NON-HOME PLANET",
        name: "Subdue the Galaxy",
        nsid: "card.objective.public-2:base/subdue-the-galaxy",
        get: () => {
            // 11 planets non-home
            const excludeCustodiaVigilia = true;
            return goalProgress.planetsNonHome(11, excludeCustodiaVigilia);
        },
    },
    {
        abbr: "6 PLANET SAME TRAIT",
        name: "Unify the Colonies",
        nsid: "card.objective.public-2:base/unify-the-colonies",
        get: () => {
            // 6 planets same trait
            return goalProgress.planetsSameTrait(6);
        },
    },
].map((x) => Object.freeze(x));
//# sourceMappingURL=goal.data.js.map