declare module "context-menu/cards/iihq-modernization/right-click-iihq-modernization" {
    import { Card } from "@tabletop-playground/api";
    import { AbstractRightClickCard } from "ttpg-darrell";
    export const ACTION_NAME_IIHQ_MODERNIZATION: string;
    export const IIHQ_MODERNIZATION_NSID: string;
    export const LEGENDARY_NSID: string;
    export const PLANET_NSID: string;
    export class RightClickIihqModernization extends AbstractRightClickCard {
        private readonly _cardUtil;
        private readonly _find;
        constructor();
        getPlanetCard(): Card | undefined;
        getLegendaryCard(): Card | undefined;
        dealCardToPlayer(card: Card, playerSlot: number): void;
    }
}
declare module "context-menu/cards/infantry-2/abstract-infantry-2" {
    import { GameObject, Player, Vector } from "@tabletop-playground/api";
    import { AbstractRightClickCard, DiceGroupParams, DiceResult } from "ttpg-darrell";
    export const ACTION_NAME: string;
    export class AbstractInfantry2 extends AbstractRightClickCard {
        private readonly _rollValue;
        readonly _onRollFinished: (diceResults: Array<DiceResult>, player: Player) => void;
        constructor(cardNsid: string, rollValue: number);
        countInfantryOnCard(card: GameObject): number;
        createDiceGroupParams(rollPos: Vector, player: Player, infantryCount: number): DiceGroupParams;
        getMessage(diceResults: Array<DiceResult>, player: Player): string;
    }
}
declare module "context-menu/cards/infantry-2/right-click-infantry-2" {
    import { AbstractInfantry2 } from "context-menu/cards/infantry-2/abstract-infantry-2";
    export class RightClickInfantry2 extends AbstractInfantry2 {
        constructor();
    }
}
declare module "context-menu/cards/infantry-2/right-click-letani-warrior-2" {
    import { AbstractInfantry2 } from "context-menu/cards/infantry-2/abstract-infantry-2";
    export class RightClickLetaniWarrior2 extends AbstractInfantry2 {
        constructor();
    }
}
declare module "context-menu/cards/infantry-2/right-click-spec-ops-2" {
    import { AbstractInfantry2 } from "context-menu/cards/infantry-2/abstract-infantry-2";
    export class RightClickSpecOps2 extends AbstractInfantry2 {
        constructor();
    }
}
declare module "context-menu/cards/maban-omega/abstract-maban-omega" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { AbstractRightClickCard, PlayerSlot } from "ttpg-darrell";
    export const MABAN_OMEGA_ACTION_NAME: string;
    /**
     * Naalu commander omega "card.leader.commander:codex.vigil/maban.omega"
     * (and "card.alliance:codex.vigil/naalu.omega"):
     * "At any time: You may look at your neighbors' hands of promissory notes
     * and the top and bottom card of the agenda deck"
     */
    export abstract class AbstractMabanOmega extends AbstractRightClickCard {
        private readonly _find;
        constructor(cardNsid: string);
        isCommanderActive(): boolean;
        isOwningPlayer(object: GameObject, player: Player): boolean;
        getNeighboringPlayerSlots(player: Player): Array<PlayerSlot>;
        getPromissoryNotes(playerSlot: PlayerSlot): Array<string>;
        getAgendaDeckTopBottom(): {
            top: string;
            bottom: string;
        } | undefined;
        doMabanOmegaAction(object: GameObject, player: Player): void;
    }
}
declare module "context-menu/cards/maban-omega/right-click-maban-omega-alliance" {
    import { AbstractMabanOmega } from "context-menu/cards/maban-omega/abstract-maban-omega";
    export class RightClickMabanOmegaAlliance extends AbstractMabanOmega {
        constructor();
    }
}
declare module "context-menu/cards/maban-omega/right-click-maban-omega" {
    import { AbstractMabanOmega } from "context-menu/cards/maban-omega/abstract-maban-omega";
    export class RightClickMabanOmega extends AbstractMabanOmega {
        constructor();
    }
}
declare module "context-menu/cards/mageon-implants/right-click-mageon-implants" {
    import { AbstractRightClickCard, PlayerSlot } from "ttpg-darrell";
    export const MAGEON_IMPLANTS_NSID: string;
    export const MAGEON_IMPLANTS_ACTION: string;
    /**
     * Mageon Implants "card.technology.green:base/mageon-implants":
     * "ACTION: Exhaust this card to look at another player's hand of action cards.
     * Choose 1 of those cards and add it to your hand."
     */
    export class RightClickMageonImplants extends AbstractRightClickCard {
        private readonly _find;
        constructor();
        getActionCardNames(playerSlot: PlayerSlot): string[];
        reportActionCardNames(clickingPlayerSlot: PlayerSlot, reportToPlayerSlot: PlayerSlot, actionCardNames: string[]): void;
    }
}
declare module "context-menu/cards/nano-forge/right-click-nano-forge" {
    import { Vector } from "@tabletop-playground/api";
    import { AbstractRightClickCard } from "ttpg-darrell";
    export const ACTION_FETCH_NANO_FORGE: string;
    export const NANO_FORGE_NSID: string;
    export const NANO_FORGE_TOKEN_NSID: string;
    export class RightClickNanoForge extends AbstractRightClickCard {
        constructor();
        fetchNanoForgeToken(pos: Vector): void;
    }
}
declare module "context-menu/cards/so-ata/abstract-so-ata" {
    import { IGlobal, PlayerSlot } from "ttpg-darrell";
    export const ACTION_REPORT_ACTION_CARDS: string;
    export const ACTION_REPORT_PROMISSORY_NOTES: string;
    export const ACTION_REPORT_SECRET_OBJECTIVES: string;
    export type ReportCardType = "action" | "promissory" | "secret";
    /**
     * Yssaril commander "card.leader.commander:pok/so-ata"
     * or alliance: "card.alliance:pok/yssaril"
     * "After another player activates a system that contains your units: You may
     * look at that player's action cards, promissory notes, or secret objectives."
     */
    export abstract class AbstractSoAta implements IGlobal {
        private readonly _find;
        private readonly _cardNsid;
        private readonly _onCustomAction;
        constructor(cardNsid: string);
        init(): void;
        _getReportCardType(customActionName: string): ReportCardType | undefined;
        _getCards(reportCardType: ReportCardType, playerSlot: PlayerSlot): Array<string>;
        _doReport(reportCardType: ReportCardType, clickingPlayerSlot: PlayerSlot, reportToPlayerSlot: PlayerSlot, cardNames: Array<string>): void;
    }
}
declare module "context-menu/cards/stellar-converter/right-click-stellar-converter" {
    import { Vector } from "@tabletop-playground/api";
    import { AbstractRightClickCard } from "ttpg-darrell";
    export const ACTION_FETCH_STELLAR_CONVERTER: string;
    export const STELLAR_CONVERTER_NSID: string;
    export const STELLAR_CONVERTER_TOKEN_NSID: string;
    export class RightClickStellarConverter extends AbstractRightClickCard {
        constructor();
        fetchNanoForgeToken(pos: Vector): void;
    }
}
declare module "lib/system-lib/schema/basic-types-schema" {
    import { z } from "zod";
    export const AnomalySchema: z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "supernova"]>>;
    export type AnomalySchemaType = z.infer<typeof AnomalySchema>;
    /**
     * Connect edge to set of edges.
     */
    export const HyperlaneSchema: z.ZodReadonly<z.ZodObject<{
        n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
        ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
        se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
        s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
        sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
    }, "strict", z.ZodTypeAny, {
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }, {
        ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
        se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
        s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
        sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
        n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
    }>>;
    export type HyperlaneSchemaType = z.infer<typeof HyperlaneSchema>;
    export const LocalPositionSchema: z.ZodReadonly<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
    export type LocalPositionSchemaType = z.infer<typeof LocalPositionSchema>;
    export const NsidNameSchema: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
    export type NsidNameSchemaType = z.infer<typeof NsidNameSchema>;
    export const SourceAndPackageIdSchema: z.ZodReadonly<z.ZodObject<{
        source: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        packageId: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        source: string;
        packageId: string;
    }, {
        source: string;
        packageId: string;
    }>>;
    export type SourceAndPackageIdSchemaType = z.infer<typeof SourceAndPackageIdSchema>;
    export const SystemClassSchema: z.ZodReadonly<z.ZodEnum<["map", "off-map", "alt"]>>;
    export type SystemClassSchemaType = z.infer<typeof SystemClassSchema>;
    export const PlanetTechSchema: z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>;
    export type PlanetTechSchemaType = z.infer<typeof PlanetTechSchema>;
    export const TraitSchema: z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>;
    export type TraitSchemaType = z.infer<typeof TraitSchema>;
    export const WormholeSchema: z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>;
    export type WormholeSchemaType = z.infer<typeof WormholeSchema>;
    export const WormholeWithPositionSchema: z.ZodReadonly<z.ZodObject<{
        wormhole: z.ZodString;
        localPosition: z.ZodReadonly<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
    }, "strict", z.ZodTypeAny, {
        wormhole: string;
        localPosition: Readonly<{
            x: number;
            y: number;
        }>;
    }, {
        wormhole: string;
        localPosition: Readonly<{
            x: number;
            y: number;
        }>;
    }>>;
    export type WormholeWithPositionSchemaType = z.infer<typeof WormholeWithPositionSchema>;
}
declare module "lib/system-lib/schema/planet-schema" {
    import { z } from "zod";
    export const PlanetSchema: z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>>;
        localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>>;
        radius: z.ZodOptional<z.ZodNumber>;
        influence: z.ZodOptional<z.ZodNumber>;
        resources: z.ZodOptional<z.ZodNumber>;
        techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
        traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
        isLegendary: z.ZodOptional<z.ZodBoolean>;
        legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        localPosition?: Readonly<{
            x: number;
            y: number;
        }> | undefined;
        localPositionFaceDown?: Readonly<{
            x: number;
            y: number;
        }> | undefined;
        radius?: number | undefined;
        influence?: number | undefined;
        resources?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
    }, {
        name: string;
        nsidName: string;
        localPosition?: Readonly<{
            x: number;
            y: number;
        }> | undefined;
        localPositionFaceDown?: Readonly<{
            x: number;
            y: number;
        }> | undefined;
        radius?: number | undefined;
        influence?: number | undefined;
        resources?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
    }>>;
    export type PlanetSchemaType = z.infer<typeof PlanetSchema>;
}
declare module "lib/system-lib/schema/system-schema" {
    import { z } from "zod";
    export const SystemSchema: z.ZodReadonly<z.ZodObject<{
        tile: z.ZodNumber;
        class: z.ZodOptional<z.ZodReadonly<z.ZodEnum<["map", "off-map", "alt"]>>>;
        isExcludeFromDraft: z.ZodOptional<z.ZodBoolean>;
        isHome: z.ZodOptional<z.ZodBoolean>;
        isHyperlane: z.ZodOptional<z.ZodBoolean>;
        anomalies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "supernova"]>>, "many">>;
        wormholes: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        wormholesFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        wormholesWithPositions: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            wormhole: z.ZodString;
            localPosition: z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strict", z.ZodTypeAny, {
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }, {
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>>, "many">>;
        wormholesWithPositionsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            wormhole: z.ZodString;
            localPosition: z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
        }, "strict", z.ZodTypeAny, {
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }, {
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>>, "many">>;
        hyperlanes: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
            ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
            se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
            s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
            sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
            nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        }, "strict", z.ZodTypeAny, {
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }, {
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }>>>;
        hyperlanesFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            n: z.ZodOptional<z.ZodArray<z.ZodEnum<["ne", "se", "s", "sw", "nw"]>, "many">>;
            ne: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "se", "s", "sw", "nw"]>, "many">>;
            se: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "s", "sw", "nw"]>, "many">>;
            s: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "sw", "nw"]>, "many">>;
            sw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
            nw: z.ZodOptional<z.ZodArray<z.ZodEnum<["n", "ne", "se", "s", "nw"]>, "many">>;
        }, "strict", z.ZodTypeAny, {
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }, {
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }>>>;
        planets: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            name: z.ZodString;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            radius: z.ZodOptional<z.ZodNumber>;
            influence: z.ZodOptional<z.ZodNumber>;
            resources: z.ZodOptional<z.ZodNumber>;
            techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
            traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
            isLegendary: z.ZodOptional<z.ZodBoolean>;
            legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>>, "many">>;
        imgFaceDown: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        tile: number;
        class?: "map" | "off-map" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        wormholesWithPositionsFaceDown?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        hyperlanes?: Readonly<{
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }> | undefined;
        hyperlanesFaceDown?: Readonly<{
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }> | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
    }, {
        tile: number;
        class?: "map" | "off-map" | "alt" | undefined;
        isExcludeFromDraft?: boolean | undefined;
        isHome?: boolean | undefined;
        isHyperlane?: boolean | undefined;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesWithPositions?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        wormholesWithPositionsFaceDown?: Readonly<{
            wormhole: string;
            localPosition: Readonly<{
                x: number;
                y: number;
            }>;
        }>[] | undefined;
        hyperlanes?: Readonly<{
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }> | undefined;
        hyperlanesFaceDown?: Readonly<{
            ne?: ("se" | "s" | "sw" | "nw" | "n")[] | undefined;
            se?: ("ne" | "s" | "sw" | "nw" | "n")[] | undefined;
            s?: ("ne" | "se" | "sw" | "nw" | "n")[] | undefined;
            sw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            nw?: ("ne" | "se" | "s" | "nw" | "n")[] | undefined;
            n?: ("ne" | "se" | "s" | "sw" | "nw")[] | undefined;
        }> | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
    }>>;
    export type SystemSchemaType = z.infer<typeof SystemSchema>;
}
declare module "lib/system-lib/schema/planet-attachment-schema" {
    import { z } from "zod";
    export const PlanetAttachmentSchema: z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        imgFaceDown: z.ZodOptional<z.ZodBoolean>;
        doNotAttach: z.ZodOptional<z.ZodBoolean>;
        influence: z.ZodOptional<z.ZodNumber>;
        influenceFaceDown: z.ZodOptional<z.ZodNumber>;
        resources: z.ZodOptional<z.ZodNumber>;
        resourcesFaceDown: z.ZodOptional<z.ZodNumber>;
        techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
        techsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
        traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
        traitsFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
        isLegendary: z.ZodOptional<z.ZodBoolean>;
        legendaryNsidName: z.ZodOptional<z.ZodString>;
        isDestroyPlanet: z.ZodOptional<z.ZodBoolean>;
        flipIfNoPlanetTech: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        influence?: number | undefined;
        resources?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influenceFaceDown?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }, {
        name: string;
        nsidName: string;
        influence?: number | undefined;
        resources?: number | undefined;
        techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isLegendary?: boolean | undefined;
        legendaryNsidName?: string | undefined;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        influenceFaceDown?: number | undefined;
        resourcesFaceDown?: number | undefined;
        techsFaceDown?: ("blue" | "green" | "red" | "yellow")[] | undefined;
        traitsFaceDown?: ("cultural" | "hazardous" | "industrial")[] | undefined;
        isDestroyPlanet?: boolean | undefined;
        flipIfNoPlanetTech?: boolean | undefined;
    }>>;
    export type PlanetAttachmentSchemaType = z.infer<typeof PlanetAttachmentSchema>;
}
declare module "lib/system-lib/system/system-reserve-space" {
    import { GameObject } from "@tabletop-playground/api";
    /**
     * Lift and drop objects over a system tile.
     * Used to reserve space for system/planet attachments.
     */
    export class SystemReserveSpace {
        private readonly _systemTileObj;
        private _liftedObjs;
        constructor(systemTileObj: GameObject);
        lift(): this;
        drop(): this;
    }
}
declare module "lib/system-lib/planet-attachment/planet-attachment-layout" {
    import { Vector } from "@tabletop-playground/api";
    import { Planet } from "lib/system-lib/planet/planet";
    export class PlanetAttachmentLayout {
        static _getOffset(index: number): Vector;
        layout(planet: Planet): void;
    }
}
declare module "lib/system-lib/planet-attachment/planet-card-layout" {
    import { Card } from "@tabletop-playground/api";
    import { Planet } from "lib/system-lib/planet/planet";
    import { PlanetAttachment } from "lib/system-lib/planet-attachment/planet-attachment";
    /**
     * Add attachment icons to planet cards.
     */
    export class PlanetCardLayout {
        layout(planet: Planet): void;
        _getCard(planet: Planet): Card | undefined;
        _removeUIs(card: Card): void;
        _addImageCardFace(card: Card, attachment: PlanetAttachment, index: number): void;
        _addImageCardBack(card: Card, attachment: PlanetAttachment, index: number): void;
    }
}
declare module "lib/system-lib/planet-attachment/planet-attachment" {
    import { GameObject } from "@tabletop-playground/api";
    import { PlanetAttachmentSchemaType } from "lib/system-lib/schema/planet-attachment-schema";
    import { Planet } from "lib/system-lib/planet/planet";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    /**
     * A planet attachment is a token game object placed on a planet to add
     * attributes such as resources, techs, etc.  Removing the token removes the
     * attachment.
     *
     * In some rare cases a game effect rather than a token game object may want to
     * create an attachment.  It is possible to create a `new GameObject()` which
     * does not exist in the world (not world methods will find it).
     */
    export class PlanetAttachment {
        private readonly _obj;
        private readonly _sourceAndPackageId;
        private readonly _params;
        private _planet;
        /**
         * Get the planet attachment token NSID.
         *
         * @param source
         * @param schema
         * @returns
         */
        static schemaToNsid(source: string, schema: PlanetAttachmentSchemaType): string;
        static schemaToImg(sourceAndPackageId: SourceAndPackageIdSchemaType, schema: PlanetAttachmentSchemaType, useBack: boolean): string;
        /**
         * Create a planet attachment.
         *
         * @param {PlanetAttachmentSchemaType} params - The planet attachment parameters.
         */
        constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: PlanetAttachmentSchemaType);
        /**
         * Attach the planet attachment to a planet.
         * May fail if no planet, already attached, etc.
         *
         * @returns {boolean} True if the attachment was added to a planet.
         */
        attach(): boolean;
        /**
         * Detach the planet attachment from a planet.
         * May fail if no planet, not attached, etc.
         *
         * @returns {boolean} True if the attachment was removed from a system.
         */
        detach(): boolean;
        doLayout(): void;
        doLayoutCard(planet: Planet): void;
        /**
         * Get the token image file.
         *
         * @returns {string | undefined} The image of the planet attachment.
         */
        getImg(forceBack?: boolean): string;
        /**
         * Get the package id.
         *
         * @returns
         */
        getImgPackageId(): string;
        /**
         * Get the influence of the planet attachment.
         * Supports face up/down influence.
         *
         * @returns
         */
        getInfluence(): number;
        /**
         * Get the legendary card NSID of the planet attachment.
         *
         * @returns
         */
        getLegendaryCardNsid(): string | undefined;
        /**
         * Get the name of the planet attachment.
         *
         * @returns
         */
        getName(): string;
        /**
         * Get NSID name.
         *
         * @returns
         */
        getNsidName(): string;
        /**
         * Get the planet attachment token game object.
         *
         * @returns
         */
        getObj(): GameObject;
        /**
         * Get the resources of the planet attachment.
         *
         * @returns
         */
        getResources(): number;
        /**
         * Get the techs of the planet attachment.
         *
         * @returns
         */
        getTechs(): Array<string>;
        /**
         * Get the traits of the planet attachment.
         *
         * @returns
         */
        getTraits(): Array<string>;
        /**
         * Is the planet attachment a destroyer of planets?
         *
         * @returns
         */
        isDestroyPlanet(): boolean;
        /**
         * Is the planet attachment legendary?
         *
         * @returns
         */
        isLegendary(): boolean;
    }
}
declare module "lib/system-lib/data/system-defaults" {
    import { Vector } from "@tabletop-playground/api";
    export class SystemDefaults {
        static readonly PLANET_RADIUS = 3;
        static readonly HOME_PLANET_POS: {
            [key: string]: Vector;
        };
        static readonly PLANET_POS: {
            [key: string]: Vector;
        };
    }
}
declare module "lib/system-lib/planet/planet" {
    import { GameObject, Vector } from "@tabletop-playground/api";
    import { PlanetSchemaType } from "lib/system-lib/schema/planet-schema";
    import { PlanetAttachment } from "lib/system-lib/planet-attachment/planet-attachment";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    /**
     * Represent a single planet.
     *
     * Planets can have multiple attachments, add by placing the planet attachment
     * token on the planet and delete by removing the token.
     *
     * A token-less planet attachment is possible, see it for details.
     */
    export class Planet {
        private readonly _obj;
        private readonly _sourceAndPackageId;
        private readonly _params;
        private readonly _attachments;
        private _localPosition;
        private _localPositionFaceDown;
        constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: PlanetSchemaType);
        /**
         * Add an attachment to the planet.
         * Allow multiple attachments with the same NSID.
         *
         * @param planetAttachment
         * @returns
         */
        addAttachment(attachment: PlanetAttachment): boolean;
        /**
         * Remove an attachment from the planet.
         *
         * @param nsid
         * @returns
         */
        delAttachment(attachment: PlanetAttachment): boolean;
        /**
         * Does the planet have an attachment with the given NSID?
         *
         * @param nsid
         * @returns
         */
        hasAttachment(attachment: PlanetAttachment): boolean;
        getAttachments(): Array<PlanetAttachment>;
        /**
         * Get influence of the planet and all attachments.
         *
         * @returns
         */
        getInfluence(): number;
        /**
         * Get legendary card NSID of the planet and all attachments.
         *
         * @returns
         */
        getLegendaryCardNsids(): Array<string>;
        /**
         * Get the name of the planet.
         *
         * @returns
         */
        getName(): string;
        /**
         * Get the system tile or system attachment token game object.
         *
         * @returns
         */
        getObj(): GameObject;
        /**
         * Get planet card NSID.
         *
         * @returns {string} The NSID of the planet card.
         */
        getPlanetCardNsid(): string;
        /**
         * Get the global position of the planet.
         *
         * @returns
         */
        getPosition(): Vector;
        getPositionAsCircle(): Array<Vector>;
        /**
         * Get the radius of the planet, in world units.
         *
         * @returns
         */
        getRadius(): number;
        /**
         * Get resources of the planet and all attachments.
         *
         * @returns
         */
        getResources(): number;
        /**
         * Get techs of the planet and all attachments.
         *
         * @returns
         */
        getTechs(): Array<string>;
        /**
         * Get traits of the planet and all attachments.
         *
         * @returns
         */
        getTraits(): Array<string>;
        /**
         * Is the planet destroyed?  An attachment can destroy a planet.
         *
         * @returns
         */
        isDestroyedPlanet(): boolean;
        /**
         * Is the planet legendary?  An attachment can make a planet legendary.
         *
         * @returns
         */
        isLegendary(): boolean;
        /**
         * Set planet local position.
         *
         * @param pos
         * @returns
         */
        setLocalPosition(pos: Vector): this;
    }
}
declare module "lib/system-lib/schema/system-attachment-schema" {
    import { z } from "zod";
    export const SystemAttachmentSchema: z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        imgFaceDown: z.ZodOptional<z.ZodBoolean>;
        doNotAttach: z.ZodOptional<z.ZodBoolean>;
        anomalies: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["asteroid-field", "gravity-rift", "nebula", "supernova"]>>, "many">>;
        wormholes: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        wormholesFaceDown: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["alpha", "beta", "gamma", "delta", "epsilon"]>>, "many">>;
        isDestroyWormhole: z.ZodOptional<z.ZodBoolean>;
        planets: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            name: z.ZodString;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            localPosition: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            localPositionFaceDown: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>>;
            radius: z.ZodOptional<z.ZodNumber>;
            influence: z.ZodOptional<z.ZodNumber>;
            resources: z.ZodOptional<z.ZodNumber>;
            techs: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["blue", "green", "red", "yellow"]>>, "many">>;
            traits: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodEnum<["cultural", "hazardous", "industrial"]>>, "many">>;
            isLegendary: z.ZodOptional<z.ZodBoolean>;
            legendaryNsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }, {
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>>, "many">>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        isDestroyWormhole?: boolean | undefined;
    }, {
        name: string;
        nsidName: string;
        anomalies?: ("asteroid-field" | "gravity-rift" | "nebula" | "supernova")[] | undefined;
        wormholes?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        wormholesFaceDown?: ("alpha" | "beta" | "gamma" | "delta" | "epsilon")[] | undefined;
        planets?: Readonly<{
            name: string;
            nsidName: string;
            localPosition?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            localPositionFaceDown?: Readonly<{
                x: number;
                y: number;
            }> | undefined;
            radius?: number | undefined;
            influence?: number | undefined;
            resources?: number | undefined;
            techs?: ("blue" | "green" | "red" | "yellow")[] | undefined;
            traits?: ("cultural" | "hazardous" | "industrial")[] | undefined;
            isLegendary?: boolean | undefined;
            legendaryNsidName?: string | undefined;
        }>[] | undefined;
        imgFaceDown?: boolean | undefined;
        doNotAttach?: boolean | undefined;
        isDestroyWormhole?: boolean | undefined;
    }>>;
    export type SystemAttachmentSchemaType = z.infer<typeof SystemAttachmentSchema>;
}
declare module "lib/system-lib/system-attachment/system-attachment" {
    import { GameObject } from "@tabletop-playground/api";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    import { Planet } from "lib/system-lib/planet/planet";
    import { WormholeWithPosition } from "lib/system-lib/system/system";
    import { SystemAttachmentSchemaType } from "lib/system-lib/schema/system-attachment-schema";
    /**
     * A system attachment is a token game object placed in a system to add
     * attributes such as planets or wormholes.  Removing the token removes the
     * attachment.
     *
     * In some rare cases a game effect rather than a token game object may want to
     * create an attachment.  It is possible to create a `new GameObject()` which
     * does not exist in the world (not world methods will find it).
     */
    export class SystemAttachment {
        private readonly _obj;
        private readonly _sourceAndPackageId;
        private readonly _params;
        private readonly _planets;
        private _system;
        /**
         * Get the system attachment token NSID.
         *
         * @param source
         * @param schema
         * @returns
         */
        static schemaToNsid(source: string, schema: SystemAttachmentSchemaType): string;
        static schemaToImg(sourceAndPackageId: SourceAndPackageIdSchemaType, schema: SystemAttachmentSchemaType, useBack: boolean): string;
        /**
         * Create a system attachment.
         *
         * @param {SystemAttachmentSchemaType} params - The system attachment parameters.
         */
        constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: SystemAttachmentSchemaType);
        /**
         * Attach the system attachment to a system.
         * May fail if no system, already attached, etc.
         *
         * @returns {boolean} True if the attachment was added to a system.
         */
        attach(): boolean;
        /**
         * Detach the system attachment from a system.
         * May fail if no system, not attached, etc.
         *
         * @returns {boolean} True if the attachment was removed from a system.
         */
        detach(): boolean;
        doLayout(): void;
        /**
         * Get any anomalies added by the system attachment.
         *
         * @return {Array<string>} The anomalies of the system attachment.
         */
        getAnomalies(): Array<string>;
        /**
         * Get the token image file.
         *
         * @returns {string}
         */
        getImg(forceBack?: boolean): string;
        /**
         * Get the package id.
         *
         * @returns
         */
        getImgPackageId(): string;
        /**
         * Human-readable name of the system attachment.
         *
         * @returns {string} The name of the system attachment.
         */
        getName(): string;
        getNsidName(): string;
        /**
         * Get the system attachment token game object.
         *
         * @returns
         */
        getObj(): GameObject;
        /**
         * Get any planets added by the system attachment.
         *
         * @returns {Array<Planet>} The planets of the system attachment.
         */
        getPlanets(): Array<Planet>;
        /**
         * Get any wormholes added by the system attachment.
         * System attachment may generate different results if face up/down.
         *
         * @returns {Array<string>} The wormholes of the system attachment.
         */
        getWormholes(): Array<string>;
        /**
         * Get the wormholes with world positions.
         * System attachment may generate different results if face up/down.
         *
         * @returns {Array<WormholeWithPosition>} The wormholes with global positions.
         */
        getWormholesWithPositions(): Array<WormholeWithPosition>;
        /**
         * Check if the system attachment destroys wormholes.
         *
         * @returns {boolean} True if the system attachment destroys wormholes.
         */
        isDestroyWormhole(): boolean;
    }
}
declare module "lib/system-lib/system/system" {
    import { GameObject, Vector } from "@tabletop-playground/api";
    import { SystemSchemaType } from "lib/system-lib/schema/system-schema";
    import { Planet } from "lib/system-lib/planet/planet";
    import { SystemAttachment } from "lib/system-lib/system-attachment/system-attachment";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    export type WormholeWithPosition = {
        wormhole: string;
        position: Vector;
    };
    export type WormholeWithLocalPosition = {
        wormhole: string;
        localPosition: Vector;
    };
    /**
     * Represent a single system with a corresponding system tile game object.
     *
     * Systems can have multiple attachments, add by placing a system attachment
     * token game object (e.g. "alpha wormhole") and delete by removing the token.
     */
    export class System {
        private readonly _obj;
        private readonly _sourceAndPackageId;
        private readonly _params;
        private readonly _planets;
        private readonly _wormholes;
        private readonly _wormholesFaceDown;
        private readonly _attachments;
        /**
         * Parse the system tile number from an NSID.
         *
         * @param nsid
         * @returns
         */
        static nsidToSystemTileNumber(nsid: string): number | undefined;
        static schemaToImg(sourceAndPackageId: SourceAndPackageIdSchemaType, schema: SystemSchemaType, useBack: boolean): string;
        /**
         * Generate the NSID for a system tile from its source and schema.
         *
         * @param source
         * @param schema
         * @returns
         */
        static schemaToNsid(source: string, schema: SystemSchemaType): string;
        /**
         * Get the local position of the planet from a standard position.
         * The standard position is based on the entity index and count, entities
         * can include wormholes as well.
         *
         * @param entityIndex
         * @param entityCount
         * @param isHome
         * @returns
         */
        static standardLocalPosition(entityIndex: number, entityCount: number, isHome: boolean): Vector;
        constructor(obj: GameObject, sourceAndPackageId: SourceAndPackageIdSchemaType, params: SystemSchemaType);
        /**
         * Add an attachment to the system.  Allow multiple copies.
         *
         * @param attachment
         * @returns
         */
        addAttachment(attachment: SystemAttachment): boolean;
        /**
         * Remove an attachment from the system.
         *
         * @param attachment
         * @returns
         */
        delAttachment(attachment: SystemAttachment): boolean;
        /**
         * Does the system have an attachment with the given NSID?
         *
         * @param attachment
         * @returns
         */
        hasAttachment(attachment: SystemAttachment): boolean;
        /**
         * Get anomalies of the system and all attachments.
         *
         * @returns {Array<string>} The anomalies of the system attachment.
         */
        getAnomalies(): Array<string>;
        /**
         * Get the system attachments (not planet attachments).
         *
         * @returns
         */
        getAttachments(): Array<SystemAttachment>;
        /**
         * Get the class of the system attachment.
         *
         * Systems are neighbor-adjacent to other systems of the same class, with
         * the exception of "off-map" which are never adjacent to any other system.
         *
         * @returns {string} The class of the system attachment.
         */
        getClass(): string;
        /**
         * Get hyperlanes, may differ based on face up or face down.
         *
         * @returns
         */
        getHyperlanes(): Record<string, Array<string>>;
        /**
         * Get the system tile image file.  This is the "UI" version, a square PNG
         * with the system image centered vertically and fully filling horizontally.
         *
         * @returns {string} The image of the system attachment.
         */
        getImg(): string;
        /**
         * Get the package id.
         *
         * @returns
         */
        getImgPackageId(): string;
        getName(): string;
        /**
         * Get the system tile game object.
         *
         * @returns
         */
        getObj(): GameObject;
        /**
         * Get planet closest to a position.
         *
         * @param position
         * @returns
         */
        getPlanetClosest(position: Vector): Planet | undefined;
        /**
         * Get planet containing a position (not just closest).
         *
         * @param position
         * @returns
         */
        getPlanetExact(position: Vector): Planet | undefined;
        /**
         * Get planets of the system and all attachments.
         * Excludes destroyed planets.
         *
         * @returns {Array<Planet>}
         */
        getPlanets(): Array<Planet>;
        getSource(): string;
        /**
         * Get system tile number.
         *
         * @returns {number}
         */
        getSystemTileNumber(): number;
        /**
         * Get the wormholes of the system and all attachments.
         *
         * @returns {Array<string>}
         */
        getWormholes(): Array<string>;
        /**
         * Get the wormholes with global positions of the system and all attachments.
         * If missing system tile object positions are origin.
         *
         * @returns {Array<WormholeWithGlobalPosition>}
         */
        getWormholesWithPositions(): Array<WormholeWithPosition>;
        /**
         * exlude from draft?
         *
         * @returns {boolean}
         */
        isExcludeFromDraft(): boolean;
        /**
         * Is this a home system?
         *
         * @returns {boolean}
         */
        isHome(): boolean;
        /**
         * Is this a hyperlane system?
         *
         * @returns {boolean}
         */
        isHyperlane(): boolean;
        isLegendary(): boolean;
    }
}
declare module "lib/system-lib/system-adjacency/system-adjacency-hyperlane" {
    import { Adjacency, HexType } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    export type Direction = "n" | "nw" | "sw" | "s" | "se" | "ne";
    export type DirectionToNeighborHexType = Record<Direction, HexType>;
    export class SystemAdjacencyHyperlane {
        constructor();
        /**
         * Translate system tile rotation into neighbor index shift.
         * Expose for map string save.
         *
         * @param yaw
         * @returns
         */
        static yawToShift(yaw: number): number;
        static _getDirectionToNeighbor(neighbors: Array<HexType>): DirectionToNeighborHexType;
        /**
         * Compute system tile local direction to world edge.
         *
         * That is, "n" is north from the tile's rotated/flipped local perspective,
         * but may be any of the 6 directions in world space.
         *
         * @param system
         * @returns
         */
        static _localNeighborsWithRotAndFlip(system: System): DirectionToNeighborHexType;
        addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency): void;
    }
}
declare module "lib/system-lib/system-adjacency/system-adjacency-neighbor" {
    import { Adjacency, HexType } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    export class SystemAdjacencyNeighbor {
        private readonly _find;
        constructor();
        addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency): void;
        /**
         * Some effects may block neighbor adjacency.  Bake those into a separate
         * "removeTags" method to apply after other tags have been added.
         *
         * @param hexToSystem
         * @param adjacency
         */
        removeTags(adjacency: Adjacency): void;
    }
}
declare module "lib/unit-lib/schema/unit-attrs-schema" {
    import { z } from "zod";
    export const UnitSchema: z.ZodReadonly<z.ZodEnum<["carrier", "control-token", "cruiser", "destroyer", "dreadnought", "fighter", "flagship", "infantry", "mech", "pds", "space-dock", "war-sun"]>>;
    export type UnitType = z.infer<typeof UnitSchema>;
    export const CombatAttrsSchema: z.ZodReadonly<z.ZodObject<{
        dice: z.ZodOptional<z.ZodNumber>;
        hit: z.ZodNumber;
        extraDice: z.ZodOptional<z.ZodNumber>;
        rerollMisses: z.ZodOptional<z.ZodBoolean>;
        crit: z.ZodOptional<z.ZodNumber>;
        critCount: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }, {
        hit: number;
        dice?: number | undefined;
        extraDice?: number | undefined;
        rerollMisses?: boolean | undefined;
        crit?: number | undefined;
        critCount?: number | undefined;
        range?: number | undefined;
    }>>;
    export type CombatAttrsSchemaType = z.infer<typeof CombatAttrsSchema>;
    export const UnitAttrsSchema: z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        unit: z.ZodReadonly<z.ZodEnum<["carrier", "control-token", "cruiser", "destroyer", "dreadnought", "fighter", "flagship", "infantry", "mech", "pds", "space-dock", "war-sun"]>>;
        componentCount: z.ZodOptional<z.ZodNumber>;
        diceColor: z.ZodOptional<z.ZodString>;
        nsidName: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        cost: z.ZodOptional<z.ZodNumber>;
        producePerCost: z.ZodOptional<z.ZodNumber>;
        isShip: z.ZodOptional<z.ZodBoolean>;
        isGround: z.ZodOptional<z.ZodBoolean>;
        hasSustainDamage: z.ZodOptional<z.ZodBoolean>;
        hasPlanetaryShield: z.ZodOptional<z.ZodBoolean>;
        disablePlanetaryShield: z.ZodOptional<z.ZodBoolean>;
        antiFighterBarrage: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        bombardment: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        spaceCannon: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        spaceCombat: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        groundCombat: z.ZodOptional<z.ZodReadonly<z.ZodObject<{
            dice: z.ZodOptional<z.ZodNumber>;
            hit: z.ZodNumber;
            extraDice: z.ZodOptional<z.ZodNumber>;
            rerollMisses: z.ZodOptional<z.ZodBoolean>;
            crit: z.ZodOptional<z.ZodNumber>;
            critCount: z.ZodOptional<z.ZodNumber>;
            range: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }, {
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }>>>;
        afbDestroyInfantryInSpace: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        nsidName?: string | undefined;
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        bombardment?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCannon?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        groundCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
    }, {
        name: string;
        unit: "carrier" | "control-token" | "cruiser" | "destroyer" | "dreadnought" | "fighter" | "flagship" | "infantry" | "mech" | "pds" | "space-dock" | "war-sun";
        nsidName?: string | undefined;
        componentCount?: number | undefined;
        diceColor?: string | undefined;
        cost?: number | undefined;
        producePerCost?: number | undefined;
        isShip?: boolean | undefined;
        isGround?: boolean | undefined;
        hasSustainDamage?: boolean | undefined;
        hasPlanetaryShield?: boolean | undefined;
        disablePlanetaryShield?: boolean | undefined;
        antiFighterBarrage?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        bombardment?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCannon?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        spaceCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        groundCombat?: Readonly<{
            hit: number;
            dice?: number | undefined;
            extraDice?: number | undefined;
            rerollMisses?: boolean | undefined;
            crit?: number | undefined;
            critCount?: number | undefined;
            range?: number | undefined;
        }> | undefined;
        afbDestroyInfantryInSpace?: number | undefined;
    }>>;
    export type UnitAttrsSchemaType = z.infer<typeof UnitAttrsSchema>;
}
declare module "lib/unit-lib/unit-attrs/combat-attrs" {
    import { CombatAttrsSchemaType } from "lib/unit-lib/schema/unit-attrs-schema";
    export class CombatAttrs {
        private _crit?;
        private _critCount;
        private _dice;
        private _extraDice;
        private _hit;
        private _rerollMisses;
        private _range;
        constructor(params: CombatAttrsSchemaType);
        /**
         * Apply overrides to the given attributes.
         * If an attribute is missing, do not change it.
         *
         * @param override
         * @returns
         */
        applyOverride(override: CombatAttrsSchemaType): this;
        addHit(delta: number): this;
        addDice(delta: number): this;
        addExtraDice(delta: number): this;
        getCrit(): number | undefined;
        getCritCount(): number;
        getDice(): number;
        getExtraDice(): number;
        getHit(): number;
        getRange(): number;
        getRerollMisses(): boolean;
        setCrit(value: number | undefined): this;
        setCritCount(value: number): this;
        setDice(value: number): this;
        setExtraDice(value: number): this;
        setHit(value: number): this;
        setRange(value: number): this;
        setRerollMisses(value: boolean): this;
    }
}
declare module "lib/faction-lib/schema/faction-schema" {
    import { z } from "zod";
    export const FactionSchema: z.ZodReadonly<z.ZodObject<{
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        name: z.ZodString;
        abbr: z.ZodString;
        abilities: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        commodities: z.ZodNumber;
        factionTechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        home: z.ZodNumber;
        homeSurrogate: z.ZodOptional<z.ZodNumber>;
        leaders: z.ZodReadonly<z.ZodObject<{
            agents: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
            commanders: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
            heroes: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
            mechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        }, "strict", z.ZodTypeAny, {
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }, {
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>>;
        promissories: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        startingTechs: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        startingUnits: z.ZodReadonly<z.ZodObject<{
            carrier: z.ZodOptional<z.ZodNumber>;
            cruiser: z.ZodOptional<z.ZodNumber>;
            destroyer: z.ZodOptional<z.ZodNumber>;
            dreadnought: z.ZodOptional<z.ZodNumber>;
            fighter: z.ZodOptional<z.ZodNumber>;
            flagship: z.ZodOptional<z.ZodNumber>;
            infantry: z.ZodOptional<z.ZodNumber>;
            mech: z.ZodOptional<z.ZodNumber>;
            pds: z.ZodOptional<z.ZodNumber>;
            spaceDock: z.ZodOptional<z.ZodNumber>;
            warSun: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }, {
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>>;
        unitOverrides: z.ZodArray<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>, "many">;
        extras: z.ZodOptional<z.ZodArray<z.ZodReadonly<z.ZodObject<{
            nsid: z.ZodString;
            count: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            nsid: string;
            count?: number | undefined;
        }, {
            nsid: string;
            count?: number | undefined;
        }>>, "many">>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: Readonly<{
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>;
        promissories: string[];
        startingTechs: string[];
        startingUnits: Readonly<{
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>;
        unitOverrides: string[];
        homeSurrogate?: number | undefined;
        extras?: Readonly<{
            nsid: string;
            count?: number | undefined;
        }>[] | undefined;
    }, {
        name: string;
        nsidName: string;
        abbr: string;
        abilities: string[];
        commodities: number;
        factionTechs: string[];
        home: number;
        leaders: Readonly<{
            agents: string[];
            commanders: string[];
            heroes: string[];
            mechs: string[];
        }>;
        promissories: string[];
        startingTechs: string[];
        startingUnits: Readonly<{
            carrier?: number | undefined;
            cruiser?: number | undefined;
            destroyer?: number | undefined;
            dreadnought?: number | undefined;
            fighter?: number | undefined;
            flagship?: number | undefined;
            infantry?: number | undefined;
            mech?: number | undefined;
            pds?: number | undefined;
            spaceDock?: number | undefined;
            warSun?: number | undefined;
        }>;
        unitOverrides: string[];
        homeSurrogate?: number | undefined;
        extras?: Readonly<{
            nsid: string;
            count?: number | undefined;
        }>[] | undefined;
    }>>;
    export type FactionSchemaType = z.infer<typeof FactionSchema>;
}
declare module "lib/tech-lib/schema/tech-schema" {
    import { z } from "zod";
    export const TechColorSchema: z.ZodEnum<["blue", "green", "red", "yellow", "unit-upgrade", "none"]>;
    export type TechColorType = z.infer<typeof TechColorSchema>;
    export const TechSchema: z.ZodReadonly<z.ZodObject<{
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        name: z.ZodString;
        abbr: z.ZodOptional<z.ZodString>;
        color: z.ZodEnum<["blue", "green", "red", "yellow", "unit-upgrade", "none"]>;
        prerequisites: z.ZodObject<{
            blue: z.ZodOptional<z.ZodNumber>;
            green: z.ZodOptional<z.ZodNumber>;
            red: z.ZodOptional<z.ZodNumber>;
            yellow: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        }, {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        }>;
        isFactionTech: z.ZodOptional<z.ZodBoolean>;
        replacesNsidName: z.ZodOptional<z.ZodString>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }, {
        name: string;
        nsidName: string;
        color: "blue" | "green" | "red" | "yellow" | "unit-upgrade" | "none";
        prerequisites: {
            blue?: number | undefined;
            green?: number | undefined;
            red?: number | undefined;
            yellow?: number | undefined;
        };
        abbr?: string | undefined;
        isFactionTech?: boolean | undefined;
        replacesNsidName?: string | undefined;
    }>>;
    export type TechSchemaType = z.infer<typeof TechSchema>;
}
declare module "lib/tech-lib/tech/tech" {
    import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
    import { TechColorType, TechSchemaType } from "lib/tech-lib/schema/tech-schema";
    export class Tech {
        private readonly _source;
        private readonly _params;
        static sortByLevel(techs: Array<Tech>): Array<Tech>;
        constructor(source: NsidNameSchemaType, params: TechSchemaType);
        getColor(): TechColorType;
        getLevel(): number;
        getName(): string;
        getNsid(): string;
        getNsidName(): string;
        getPrerequisites(color: TechColorType): number;
        isFactionTech(): boolean;
        replacesNsidName(): string | undefined;
    }
}
declare module "lib/faction-lib/faction/faction" {
    import { GameObject } from "@tabletop-playground/api";
    import { FactionSchemaType } from "lib/faction-lib/schema/faction-schema";
    import { NsidNameSchemaType, SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    export class Faction {
        private readonly _sourceAndPackageId;
        private readonly _params;
        private readonly _find;
        private readonly _injectedExtras;
        constructor(sourceAndPackageId: SourceAndPackageIdSchemaType, params: FactionSchemaType);
        getAbbr(): string;
        getAbilityNsids(): Array<string>;
        getAgentNsids(): Array<string>;
        /**
         * Caution, there may be '.omega' version!
         * @returns
         */
        getAllianceNsids(): Array<string>;
        getCommanderNsids(): Array<string>;
        getCommandTokenNsid(): string;
        getCommodities(): number;
        getControlTokenNsid(): string;
        getExtraCount(nsid: string): number;
        getExtras(): Array<string>;
        getFactionSheetNsid(): string;
        getFactionTechNsids(): Array<string>;
        getHeroNsids(): Array<string>;
        getHomeSurrogateTileNumber(): number;
        getHomeImg(): string;
        getHomeImgPackageId(): string;
        getHomeSystemTileNumber(): number;
        getHomeSystemTileObj(playerSlot: number): GameObject | undefined;
        getIcon(): string;
        getIconPackageId(): string;
        getMechNsids(): Array<string>;
        getName(): string;
        getNsid(): NsidNameSchemaType;
        getPromissoryNsids(): Array<string>;
        getSource(): NsidNameSchemaType;
        getStartingTechNsids(): Array<string>;
        getStartingUnits(): Record<string, number>;
        getUnitOverrideNsids(): Array<string>;
        injectExtras(extras: {
            [nsid: string]: number;
        }): this;
    }
}
declare module "lib/unit-lib/unit-attrs/unit-attrs" {
    import { Color } from "@tabletop-playground/api";
    import { UnitAttrsSchemaType, UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { CombatAttrs } from "lib/unit-lib/unit-attrs/combat-attrs";
    /**
     * Unit attributes, e.g. cost, combat stats.
     *
     * Unlike systems, make unit attributes mutable because unit modifiers
     * can get very compliated; provide them simpler access to attributes.
     * This does mean need to regenerate unit attributes for each instance.
     */
    export class UnitAttrs {
        private readonly _unit;
        private readonly _componentCount;
        private _name;
        private _cost;
        private _producePerCost;
        private _produceQuantityDoesNotCountAgainstProductionLimits;
        private _sharedProduceQuantityDoesNotCountAgainstProductionLimits;
        private _diceColor;
        private _isShip;
        private _isGround;
        private _hasSustainDamage;
        private _hasPlanetaryShield;
        private _disablePlanetaryShield;
        private _disableAntiFighterBarrage;
        private _disableBombardment;
        private _disableSpaceCannonDefense;
        private _disableSpaceCannonOffsense;
        private _disableSustainDamage;
        private _antiFighterBarrage;
        private _bombardment;
        private _spaceCannon;
        private _spaceCombat;
        private _groundCombat;
        static schemaToNsid(source: string, schema: UnitAttrsSchemaType): string;
        static sortByOverrideOrder(attrs: Array<UnitAttrsSchemaType>): Array<UnitAttrsSchemaType>;
        constructor(params: UnitAttrsSchemaType);
        /**
         * Apply overrides to the given attributes.
         * If an attribute is missing, do not change it.
         *
         * @param override
         * @returns
         */
        applyOverride(override: UnitAttrsSchemaType): this;
        getAntiFighterBarrage(): CombatAttrs | undefined;
        getAntiFighterBarrageOrThrow(): CombatAttrs;
        getBombardment(): CombatAttrs | undefined;
        getBombardmentOrThrow(): CombatAttrs;
        getComponentCount(): number;
        getCost(): number | undefined;
        getDiceColor(): Color;
        getDisableAntiFighterBarrage(): boolean;
        getDisableBombardment(): boolean;
        getDisablePlanetaryShield(): boolean;
        getDisableSpaceCannonDefense(): boolean;
        getDisableSpaceCannonOffense(): boolean;
        getDisableSustainDamage(): boolean;
        getGroundCombat(): CombatAttrs | undefined;
        getGroundCombatOrThrow(): CombatAttrs;
        getImg(): string;
        getImgPackageId(): string;
        getName(): string;
        getProducePerCost(): number;
        getProduceQuantityDoesNotCountAgainstProductionLimits(): number;
        getSharedProduceQuantityDoesNotCountAgainstProductionLimits(): number;
        getSpaceCannon(): CombatAttrs | undefined;
        getSpaceCannonOrThrow(): CombatAttrs;
        getSpaceCombat(): CombatAttrs | undefined;
        getSpaceCombatOrThrow(): CombatAttrs;
        getUnit(): UnitType;
        hasPlanetaryShild(): boolean;
        hasSustainDamage(): boolean;
        isGround(): boolean;
        isShip(): boolean;
        setAntiFighterBarrage(value: CombatAttrs | undefined): this;
        setBombardment(value: CombatAttrs | undefined): this;
        setCost(value: number): this;
        setDisableAntiFighterBarrage(value: boolean): this;
        setDisableBombardment(value: boolean): this;
        setDisablePlanetaryShield(value: boolean): this;
        setDisableSpaceCannonDefense(value: boolean): this;
        setDisableSpaceCannonOffense(value: boolean): this;
        setDisableSustainDamage(value: boolean): this;
        setGroundCombat(value: CombatAttrs | undefined): this;
        setHasPlanetaryShield(value: boolean): this;
        setHasSustainDamage(value: boolean): this;
        setIsGround(value: boolean): this;
        setIsShip(value: boolean): this;
        setProducePerCost(value: number): this;
        setProduceQuantityDoesNotCountAgainstProductionLimits(value: number): this;
        setSharedProduceQuantityDoesNotCountAgainstProductionLimits(value: number): this;
        setSpaceCannon(value: CombatAttrs | undefined): this;
        setSpaceCombat(value: CombatAttrs | undefined): this;
    }
}
declare module "lib/unit-lib/unit-attrs-set/unit-attrs-set" {
    import { UnitAttrsSchemaType, UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { UnitAttrs } from "lib/unit-lib/unit-attrs/unit-attrs";
    export class UnitAttrsSet {
        private readonly _unitToAttrs;
        constructor(baseSchemaTypes: Array<UnitAttrsSchemaType>);
        /**
         * Unit modifiers can add a new unit type.
         * The "unit" parameter is a "UnitType" so caller probably needs
         * to violate it via "<string> as UnitType".
         *
         * @param unit
         * @param schema
         */
        addSyntheticUnit(schema: UnitAttrsSchemaType): boolean;
        applyOverride(override: UnitAttrsSchemaType): boolean;
        get(unit: UnitType): UnitAttrs | undefined;
        getOrThrow(unit: UnitType): UnitAttrs;
        getAll(): Array<UnitAttrs>;
    }
}
declare module "event/on-system-activated/on-system-activated" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    export class OnSystemActivated implements IGlobal {
        private static __lastActivatedSystem;
        private static __lastActivatingPlayerSlot;
        private _lastActivatedTimestamp;
        private _image;
        private _ui;
        static getLastActivatedSystem(): System | undefined;
        static getLastActivatingPlayerSlot(): number | undefined;
        /**
         * Dropping a command token is ONE way to activate a system, not the only way.
         *
         * @param object
         * @param player
         * @param _thrown
         * @param _grabPosition
         * @param _grabRotation
         */
        private readonly _onReleasedHandler;
        readonly _onTickHandler: () => void;
        init(): void;
        _maybeLinkCommandToken(obj: GameObject): void;
        _rememberLastActivatedSystem(system: System, player: Player): void;
        _reportSystemActivation(system: System, player: Player): void;
        _displayActiveSystem(system: System, player: Player): void;
        _cancelAnimation(): void;
    }
}
declare module "lib/unit-lib/unit-plastic/unit-plastic" {
    import { GameObject, Vector } from "@tabletop-playground/api";
    import { HexType } from "ttpg-darrell";
    import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { Planet } from "lib/system-lib/planet/planet";
    import { System } from "lib/system-lib/system/system";
    /**
     * Represents a single game object corresponding to a unit plastic.
     * It might be an anonymous (no owning player slot) cardboard token,
     * optionally assign those to the closest same-hex owned unit plastic.
     */
    export class UnitPlastic {
        private static readonly __find;
        private readonly _unit;
        private readonly _count;
        private readonly _obj;
        private readonly _pos;
        private readonly _hex;
        private _owningPlayerSlot;
        private _system;
        private _planetClosest;
        private _planetExact;
        /**
         * Convert a game object to a unit plastic entry (is it applies).
         *
         * @param obj
         * @returns
         */
        static getOne(obj: GameObject): UnitPlastic | undefined;
        /**
         * Find all unit plastics on the table (not in containers).
         * Does not assign token owners or planets, expecting the
         * caller to prune down to relevant entries and assign those.
         *
         * @returns
         */
        static getAll(): Array<UnitPlastic>;
        /**
         * Assign ownership of anonymous cardboard tokens to the closest
         * same-hex owned unit plastic.
         *
         * @param entries
         */
        static assignOwners(entries: Array<UnitPlastic>): void;
        /**
         * Assign planets to unit plastics, both closest and exact.
         *
         * @param entries
         */
        static assignPlanets(entries: Array<UnitPlastic>): void;
        constructor(unit: UnitType, count: number, obj: GameObject, pos: Vector);
        getCount(): number;
        getHex(): HexType;
        getPos(): Vector;
        getObj(): GameObject;
        getOwningPlayerSlot(): number;
        getPlanetClosest(): Planet | undefined;
        getPlanetExact(): Planet | undefined;
        getSystem(): System | undefined;
        getUnit(): UnitType;
    }
}
declare module "lib/combat-lib/combat-roll/combat-roll" {
    import { Player, Vector } from "@tabletop-playground/api";
    import { DiceParams, Find, HexType } from "ttpg-darrell";
    import { CombatAttrs } from "lib/unit-lib/unit-attrs/combat-attrs";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { Planet } from "lib/system-lib/planet/planet";
    import { System } from "lib/system-lib/system/system";
    import { UnitAttrsSchemaType, UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { UnitAttrsSet } from "lib/unit-lib/unit-attrs-set/unit-attrs-set";
    import { UnitModifier } from "lib/unit-lib/unit-modifier/unit-modifier";
    import { UnitPlastic } from "lib/unit-lib/unit-plastic/unit-plastic";
    export type CombatRollType = "ambush" | "antiFighterBarrage" | "bombardment" | "spaceCannonOffense" | "spaceCannonDefense" | "spaceCombat" | "groundCombat" | "production";
    export type CombatRollParams = {
        rollType: CombatRollType;
        hex: HexType;
        planetName?: string;
        activatingPlayerSlot: number;
        rollingPlayerSlot: number;
        overrideSelfFaction?: Faction;
        overrideOpponentFaction?: Faction;
    };
    export type BestUnitWithCombatAttrs = {
        unit: UnitType;
        combatAttrs: CombatAttrs;
    };
    export class CombatRollPerPlayerData {
        faction: Faction | undefined;
        playerSlot: number;
        readonly unitAttrsSet: UnitAttrsSet;
        readonly unitPlasticHex: Array<UnitPlastic>;
        readonly unitPlasticAdj: Array<UnitPlastic>;
        readonly overrideUnitCountHex: Map<UnitType, number>;
        readonly overrideUnitCountAdj: Map<UnitType, number>;
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
        addSyntheticUnit(schema: UnitAttrsSchemaType, count: number): boolean;
        getCount(unit: UnitType): number;
        getCountAdj(unit: UnitType): number;
        hasUnit(unit: UnitType): boolean;
        hasUnitAdj(unit: UnitType): boolean;
    }
    export class CombatRoll {
        private readonly _cardUtil;
        private readonly _params;
        private readonly _adjHexes;
        private readonly _modifiers;
        readonly system: System | undefined;
        readonly planet: Planet | undefined;
        readonly self: CombatRollPerPlayerData;
        readonly opponent: CombatRollPerPlayerData;
        readonly find: Find;
        static createCooked(params: CombatRollParams): CombatRoll;
        constructor(params: CombatRollParams);
        _findUnitPlastics(): Array<UnitPlastic>;
        _findUnitAttrOverrides(playerSlot: number): Array<UnitAttrsSchemaType>;
        _findUnitModifiers(selfSlot: number, opponentSlot: number): Array<UnitModifier>;
        _getUnitToCombatAttrs(): Map<UnitType, CombatAttrs>;
        applyUnitPlasticAndSetOpponentPlayerSlot(): this;
        applyFactions(): this;
        applyUnitOverries(): this;
        applyUnitModifiers(errors: Array<Error>): this;
        applyUnitModifiersOrThrow(): this;
        bestHitUnitWithCombatAttrs(): BestUnitWithCombatAttrs | undefined;
        _pruneToUnitsClosestToPlanet(): this;
        _checkCancelBombardment(): boolean;
        createDiceParamsArray(): Array<DiceParams>;
        getActivatingPlayerSlot(): number;
        getUnitModifierNames(): Array<string>;
        getUnitModifierNamesWithDescriptions(): Array<string>;
        getRollType(): CombatRollType;
        getPlanetName(): string | undefined;
        roll(player: Player, position: Vector): void;
    }
}
declare module "lib/unit-lib/schema/unit-modifier-schema" {
    import { CombatRoll } from "lib/combat-lib/combat-roll/combat-roll";
    import { z } from "zod";
    export const UnitModifierCardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "commander", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
    export type UnitModifierCardClassType = z.infer<typeof UnitModifierCardClass>;
    export const UnitModifierTrigger: z.ZodReadonly<z.ZodObject<{
        cardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "commander", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
        nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
        overrideSource: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
    }, "strict", z.ZodTypeAny, {
        nsidName: string;
        cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
        overrideSource?: string | undefined;
    }, {
        nsidName: string;
        cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
        overrideSource?: string | undefined;
    }>>;
    export type UnitModifierTriggerType = z.infer<typeof UnitModifierTrigger>;
    export const UnitModifierOwner: z.ZodReadonly<z.ZodEnum<["self", "opponent", "any"]>>;
    export type UnitModifierOwnerType = z.infer<typeof UnitModifierOwner>;
    export const UnitModifierPriority: z.ZodReadonly<z.ZodEnum<["mutate", "mutate-late", "adjust", "choose"]>>;
    export type UnitModifierPriorityType = z.infer<typeof UnitModifierPriority>;
    export const UnitModifierSchema: z.ZodReadonly<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        triggerAlways: z.ZodOptional<z.ZodBoolean>;
        triggers: z.ZodArray<z.ZodReadonly<z.ZodObject<{
            cardClass: z.ZodReadonly<z.ZodEnum<["action", "agenda", "agent", "alliance", "commander", "faction-ability", "hero", "legendary", "mech", "promissory", "relic", "technology.blue", "technology.green", "technology.red", "technology.yellow", "technology.unit-upgrade", "unit"]>>;
            nsidName: z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>;
            overrideSource: z.ZodOptional<z.ZodReadonly<z.ZodEffects<z.ZodString, string, string>>>;
        }, "strict", z.ZodTypeAny, {
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }, {
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>>, "many">;
        isActiveIdle: z.ZodOptional<z.ZodBoolean>;
        owner: z.ZodReadonly<z.ZodEnum<["self", "opponent", "any"]>>;
        priority: z.ZodReadonly<z.ZodEnum<["mutate", "mutate-late", "adjust", "choose"]>>;
        applies: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodBoolean>;
        apply: z.ZodFunction<z.ZodTuple<[z.ZodAny], z.ZodUnknown>, z.ZodVoid>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        description: string;
        triggers: Readonly<{
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "choose";
        applies: (args_0: any, ...args_1: unknown[]) => boolean;
        apply: (args_0: any, ...args_1: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }, {
        name: string;
        description: string;
        triggers: Readonly<{
            nsidName: string;
            cardClass: "action" | "promissory" | "mech" | "unit" | "agenda" | "agent" | "alliance" | "commander" | "faction-ability" | "hero" | "legendary" | "relic" | "technology.blue" | "technology.green" | "technology.red" | "technology.yellow" | "technology.unit-upgrade";
            overrideSource?: string | undefined;
        }>[];
        owner: "self" | "opponent" | "any";
        priority: "mutate" | "mutate-late" | "adjust" | "choose";
        applies: (args_0: any, ...args_1: unknown[]) => boolean;
        apply: (args_0: any, ...args_1: unknown[]) => void;
        triggerAlways?: boolean | undefined;
        isActiveIdle?: boolean | undefined;
    }>>;
    export type UnitModifierSchemaType = Omit<z.infer<typeof UnitModifierSchema>, "apply" | "applies"> & {
        applies: (combatRoll: CombatRoll) => boolean;
        apply: (combatRoll: CombatRoll) => void;
    };
}
declare module "lib/unit-lib/unit-modifier/unit-modifier" {
    import { CombatRoll } from "lib/combat-lib/combat-roll/combat-roll";
    import { UnitModifierOwnerType, UnitModifierPriorityType, UnitModifierSchemaType, UnitModifierTriggerType } from "lib/unit-lib/schema/unit-modifier-schema";
    import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
    export class UnitModifier {
        private readonly _params;
        static schemaTriggerToNsid(source: NsidNameSchemaType, trigger: UnitModifierTriggerType): string;
        static sortByApplyOrder(modifiers: Array<UnitModifier>): Array<UnitModifier>;
        constructor(params: UnitModifierSchemaType);
        applies(combatRoll: CombatRoll): boolean;
        apply(combatRoll: CombatRoll): void;
        getDescription(): string | undefined;
        getName(): string;
        getOwner(): UnitModifierOwnerType;
        getPriority(): UnitModifierPriorityType;
        isActiveIdle(): boolean;
    }
}
declare module "lib/unit-lib/unit-modifier/unit-modifier-active-idle" {
    import { Card, GameObject } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class UnitModifierActiveIdle implements IGlobal {
        private static readonly ACTIVE_KEY;
        static isActive(obj: GameObject): boolean;
        static setActive(obj: GameObject, active: boolean): void;
        init(): void;
        _maybeAddActiveIdleButton(card: Card): void;
        _maybeRemoveActiveIdleButton(deck: Card, oldNsid: string): void;
    }
}
declare module "lib/system-lib/system-adjacency/system-adjacency-wormhole" {
    import { Adjacency, HexType } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class SystemAdjacencyWormhole {
        static WORMHOMES: Array<string>;
        private readonly _cardUtil;
        private readonly _find;
        addTags(hexToSystem: Map<HexType, System>, adjacency: Adjacency, faction: Faction | undefined): void;
        _applyFaction(faction: Faction, adjacency: Adjacency): void;
        _applyCreussFlagship(adjacency: Adjacency): void;
        _applyCards(adjacency: Adjacency): void;
    }
}
declare module "lib/system-lib/system-adjacency/system-adjacency" {
    import { Vector } from "@tabletop-playground/api";
    import { AdjacencyNodeType, AdjacencyPathType, HexType } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class SystemAdjacency {
        private readonly _hyperlane;
        private readonly _neighbor;
        private readonly _wormhole;
        static getHexToSystem(): Map<HexType, System>;
        /**
         * Convert path to simplified list of nodes.
         * Intended for debugging and display.
         *
         * @param adjacencyNodePath
         * @returns
         */
        static simplifyPath(adjacencyNodePath: AdjacencyPathType): Array<AdjacencyNodeType>;
        /**
         * Node is either a HexType or a with-direction hex edge encoded as
         * "srcHex|dstHex".
         *
         * @param node
         * @returns
         */
        static adjNodeToPositionOrThrow(node: AdjacencyNodeType): Vector;
        /**
         * Get cooked adjacency results, just the adjacent hexes.
         * @param hex
         * @returns
         */
        getAdjHexes(hex: HexType, faction: Faction | undefined): Set<HexType>;
        /**
         * Get the raw adjancency results, including path taken.
         * @param hex
         * @returns
         */
        getAdjacencyPaths(hex: HexType, faction: Faction | undefined): ReadonlyArray<AdjacencyPathType>;
    }
}
declare module "context-menu/display-pds-adjacency/display-pds-adjacency" {
    import { DrawingLine, GameObject, Vector } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export const ADJACENCY_LINE_TAG: string;
    export const ADJACENCY_ACTION_NAME: string;
    /**
     * Display which systems are adjacent to the given PDS, assuming range 1.
     * This is mostly for debugging and verifying hyperlanes.
     */
    export class DisplayPDSAdjacency implements IGlobal {
        private readonly _onObjectCreatedHandler;
        private readonly _onCustomActionHandler;
        static _getLinePoints(adjacencyNodePath: Array<string>): Array<Vector>;
        static _getLine(adjacencyNodePath: Array<string>): DrawingLine;
        init(): void;
        destroy(): void;
        /**
         * Add context menu to the correct objects.
         *
         * @param obj
         */
        _maybeAddContextMenu(obj: GameObject): void;
        _hasAdjacencyLines(obj: GameObject): boolean;
        _toggleAdjacencyLines(obj: GameObject): void;
        _addAdjacencyLines(obj: GameObject): void;
        _removeAdajecncyLines(obj: GameObject): void;
    }
}
declare module "lib/system-lib/system/system-tier" {
    import { System } from "lib/system-lib/system/system";
    export type SystemTierType = "red" | "high" | "med" | "low" | "other";
    export class SystemTier {
        getTier(system: System): SystemTierType;
    }
}
declare module "context-menu/events/age-of-exploration/right-click-age-of-exploration" {
    import { AbstractRightClickCard, PlayerSlot } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    export const AGE_OF_EXPLORATION_ACTION_NAME: string;
    /**
     * ACTION: ... roll 1 die, on a result of 1-4 draw a random unused red tile,
     * on a result of 5-10 draw a random unused blue tile; place that tile
     * adjacent to any border system that contains your ships.  Place a frontier
     * token in the newly placed system if it does not contain any planets.
     */
    export class RightClickAgeOfExploration extends AbstractRightClickCard {
        constructor();
        _getAvailableLegalSystems(): Array<System>;
        _getAvailableRedSystems(): Array<System>;
        _getAvailableBlueSystems(): Array<System>;
        _getAvailableSystem(tileColor: "red" | "blue"): System | undefined;
        _dealSystemTile(playerSlot: PlayerSlot, tileColor: "red" | "blue"): void;
        _chooseTileColor(): "red" | "blue";
        _colorFromRoll(roll: number): "red" | "blue";
    }
}
declare module "lib/player-lib/player-seats/player-seats" {
    import { CardHolder, Vector } from "@tabletop-playground/api";
    import { IGlobal, PlayerSlot } from "ttpg-darrell";
    export type PlayerSeatType = {
        cardHolder: CardHolder;
        playerSlot: number;
    };
    export class PlayerSeats implements IGlobal {
        private _find;
        private readonly _onStartGameComplete;
        init(): void;
        /**
         * A readonable place to drop something in a player area.
         *
         * @param seatIndex
         * @returns
         */
        getDealPosition(playerSlot: PlayerSlot): Vector;
        getAllSeats(): Array<PlayerSeatType>;
        getPlayerSlotBySeatIndex(seatIndex: number): number;
        getPlayerSlotBySeatIndexOrThrow(seatIndex: number): number;
        getSeatIndexByPlayerSlot(playerSlot: number): number;
        getSeatIndexByPlayerSlotOrThrow(playerSlot: number): number;
        getCardHolderByPlayerSlot(playerSlot: number): CardHolder | undefined;
        getCardHolderByPlayerSlotOrThrow(playerSlot: number): CardHolder;
    }
}
declare module "context-menu/events/minor-factions/right-click-minor-factions" {
    import { GameObject } from "@tabletop-playground/api";
    import { AbstractRightClickCard } from "ttpg-darrell";
    export const MINOR_FACTIONS_ACTION_NAME: string;
    /**
     * Give each player:
     * - one unused home system,
     * - linked alliance card,
     * - 3 neutral infantry
     *
     * Minor faction planets have all traits.
     */
    export class RightClickMinorFactions extends AbstractRightClickCard {
        constructor();
        _getInPlayFactionHomeSystemNsids(): Set<string>;
        _getAllHomeSystemTileNsids(): Set<string>;
        _getAvailableHomeSystemNsids(): Array<string>;
        _getHomeSystemTiles(count: number): Array<GameObject>;
        _dealHomeSystemTiles(): void;
    }
}
declare module "context-menu/right-click-purge/right-click-purge" {
    import { GameObject } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export const PURGE_ACTION_NAME: string;
    export class RightClickPurge implements IGlobal {
        private readonly _find;
        private readonly _onObjectCreatedHandler;
        private readonly _onCardMadeSingletonHandler;
        private readonly _onCardMakeDeckHandler;
        private readonly _onCustomActionHandler;
        static _isPurgeable(obj: GameObject): boolean;
        init(): void;
        _maybeAddPurge(obj: GameObject): void;
        _purge(obj: GameObject, playerSlot: number): void;
    }
}
declare module "context-menu/right-click-rift/right-click-rift" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export const RIFT_ACTION_NAME: string;
    export const RIFT_ACTION_TOOLTIP: string;
    export class RightClickRift implements IGlobal {
        /**
         * Display the rift result as UI, goes away on object drop.
         *
         * @param unitObj
         * @param rollValue
         * @param surviveOn
         */
        static applyRiftResult(unitObj: GameObject, rollValue: number, surviveOn?: number): void;
        static getShipsInRift(riftObj: GameObject): Array<GameObject>;
        static isRiftSystemTile(obj: GameObject): boolean;
        static rollRift(riftObj: GameObject): void;
        init(): void;
        _onObjectCreatedHandler: (obj: GameObject) => void;
        _onCustomActionHandler: (obj: GameObject, _player: Player, identifier: string) => void;
    }
}
declare module "context-menu/heroes/hero-dimensional-anchor/hero-dimensional-anchor" {
    import { GameObject } from "@tabletop-playground/api";
    import { AbstractRightClickCard, HexType, PlayerSlot } from "ttpg-darrell";
    import { UnitPlastic } from "lib/unit-lib/unit-plastic/unit-plastic";
    /**
     * Vuil'Raith hero It Feeds on Carrion
     *
     * ACTION: Each other player rolls a die for each of their non-fighter ships
     * that are in or adjacent to a system that contains a dimensional tear; on a
     * 1-3, capture that unit.
     *
     * If this causes a player's ground forces or fighters to be removed, also
     * capture those units.
     *
     * Then, purge this card.
     *
     * NOTES:
     *
     * If a player is blockading a vuil'raith system, they are immune.
     * Ugh, except if Nekro copies, the nekro versions do not count as blockade.
     */
    export class HeroDimensionalAnchor extends AbstractRightClickCard {
        constructor();
        _dimensionalAnchor(object: GameObject, playerSlot: number): void;
        /**
         * Get hexes with dimensional tears.
         *
         * @param includeNekro
         * @returns
         */
        _getDimensionalTearHexes(includeNekro: boolean): Set<HexType>;
        /**
         * Get hexes adjacent to the given hexes (including the source hexes).
         *
         * @param hexes
         * @param playerSlot
         * @returns
         */
        _getInAndAdjacentHexes(hexes: Set<HexType>, playerSlot: PlayerSlot): Set<HexType>;
        /**
         * Get hexes and ships (get plastics).
         * Include fighters here to detect blockages, remove them for the final list.
         *
         * @returns
         */
        _getHexToShipsIncludingFighters(): Map<HexType, Array<UnitPlastic>>;
        _getShipOwners(ships: Array<UnitPlastic>): Set<PlayerSlot>;
        _getNonFighterShips(ships: Array<UnitPlastic>): Array<UnitPlastic>;
        _getNonBlockadedShips(ships: Array<UnitPlastic>, blockadingPlayerSlots: Set<PlayerSlot>): Array<UnitPlastic>;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-command/recycle-token-command" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenCommand extends GarbageHandler {
        private readonly _find;
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/command-token-lib/return-command-tokens/return-command-tokens" {
    import { GameObject } from "@tabletop-playground/api";
    /**
     * Return command tokens on system tiles to players' supplies.
     */
    export class ReturnCommandTokens {
        private readonly _recycleCommandToken;
        getAllCommandTokensOnMap(): Array<GameObject>;
        /**
         * Return command tokens for only one player (for Sol's hero).
         *
         * @param playerSlot
         */
        returnOnePlayersCommandTokens(playerSlot: number): void;
        returnAllCommandTokens(): void;
    }
}
declare module "context-menu/heroes/hero-helio-command-array/hero-helio-command-array" {
    import { GameObject } from "@tabletop-playground/api";
    import { AbstractRightClickCard } from "ttpg-darrell";
    /**
     * Sol hero Jace X. 4th Air Legion
     *
     * ACTION: Remove each of your command tokens from the game board and return
     * them to your reinforcements.
     *
     * Then, purge this card.
     */
    export class HeroHelioCommandArray extends AbstractRightClickCard {
        constructor();
        _helioCommandArray(object: GameObject, playerSlot: number): void;
    }
}
declare module "ui/glowing-token/glowing-token" {
    import { DrawingLine, GameObject, Vector } from "@tabletop-playground/api";
    /**
     * Add a glowing effect to a token.
     * Emission mask is fixed in the template, but we can add glowing lines.
     */
    export class GlowingToken {
        private readonly _obj;
        private readonly _lineWidth;
        private readonly _color;
        constructor(token: GameObject);
        _getPoints(): Array<Vector>;
        /**
         * Get a DrawingLine with points in local object space.
         *
         * @returns
         */
        _getDrawingLine(): DrawingLine;
    }
}
declare module "context-menu/heroes/hero-multiverse-shift/hero-multiverse-shift" {
    import { GameObject } from "@tabletop-playground/api";
    import { AbstractRightClickCard, HexType } from "ttpg-darrell";
    /**
     * Empyrean hero Conservator Procyon
     *
     * ACTION: Place 1 frontier token in each system that does not contain any
     * planets and does not already have a frontier token.
     *
     * Then, explore each frontier token that is in a system that contains 1
     * or more of your ships.
     *
     * Then, purge this card.
     */
    export class HeroMultiverseShift extends AbstractRightClickCard {
        constructor();
        _multiverseShift(object: GameObject, playerSlot: number): void;
        /**
         * Get all system hexes that do not contain any planets.
         */
        _getZeroPlanetHexes(): Set<HexType>;
        /**
         * Get hexes that already contain frontier tokens.
         */
        _getAlreadyHaveFrontierTokenHexes(): Set<HexType>;
        /**
         * Get all system hexes that contain 1 or more of the player's ships.
         *
         * @param playerSlot
         */
        _getShipHexes(playerSlot: number): Set<HexType>;
    }
}
declare module "context-menu/report-remaining/report-remaining" {
    import { Card, GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class ReportRemaining implements IGlobal {
        private readonly _actionName;
        private readonly _customActionHandler;
        private readonly _prefixes;
        init(): void;
        _maybeAddContextMenuItem(obj: GameObject): void;
        getCardNamesWithCountsMessage(deck: Card): string;
        reportRemaining(deck: Card, player: Player): void;
    }
}
declare module "context-menu/right-click-agenda/right-click-agenda" {
    import { Card } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export const ACTION_PLACE_TOP: string;
    export const ACTION_PLACE_BOTTOM: string;
    export class RightClickAgenda implements IGlobal {
        private readonly _find;
        private readonly _onSingletonCardCreated;
        private readonly _onSingletonCardMadeDeck;
        private readonly _onCustomAction;
        private readonly _onStrategyCardPlayed;
        _getAgendaDeck(): Card | undefined;
        _clearAgendaDeckDescription(): void;
        _addAgendaDeckDescription(value: string): void;
        init(): void;
        _place(isTop: boolean, card: Card): void;
    }
}
declare module "context-menu/right-click-delete/right-click-delete" {
    import { GameObject } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export const ACTION_DELETE: string;
    /**
     * Disable the default delete (delete key), replace with a context menu item.
     */
    export class RightClickDelete implements IGlobal {
        private readonly _onCustomAction;
        init(): void;
        _addRightClickDelete(obj: GameObject): void;
    }
}
declare module "lib/agenda-lib/agenda-state/agenda-state" {
    import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
    import { z } from "zod";
    export const MAX_OUTCOME_NAME_LENGTH = 20;
    const AgendaPhase: z.ZodEnum<["whens", "afters", "voting"]>;
    export type AgendaPhaseType = z.infer<typeof AgendaPhase>;
    const AgendaRiderSchema: z.ZodObject<{
        seat: z.ZodNumber;
        objId: z.ZodString;
        outcome: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        seat: number;
        objId: string;
        outcome: number;
    }, {
        seat: number;
        objId: string;
        outcome: number;
    }>;
    export type AgendaRiderSchemaType = z.infer<typeof AgendaRiderSchema>;
    const AgendaSeatStateSchema: z.ZodObject<{
        avail: z.ZodDefault<z.ZodNumber>;
        outcome: z.ZodDefault<z.ZodNumber>;
        votes: z.ZodDefault<z.ZodNumber>;
        lockVotes: z.ZodDefault<z.ZodBoolean>;
        noWhens: z.ZodDefault<z.ZodNumber>;
        noAfters: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        outcome: number;
        avail: number;
        votes: number;
        lockVotes: boolean;
        noWhens: number;
        noAfters: number;
    }, {
        outcome?: number | undefined;
        avail?: number | undefined;
        votes?: number | undefined;
        lockVotes?: boolean | undefined;
        noWhens?: number | undefined;
        noAfters?: number | undefined;
    }>;
    type AgendaSeatStateSchemaType = z.infer<typeof AgendaSeatStateSchema>;
    export class AgendaState {
        readonly onAgendaStateChanged: TriggerableMulticastDelegate<(agendaState: AgendaState) => void>;
        private _suppressStateChangeEvents;
        private readonly _namespaceId;
        private readonly _data;
        private readonly _onTurnStateChangedHandler;
        private readonly _onAgendaCardRemovedHandler;
        static isAgendaInProgress(namespaceId: NamespaceId): boolean;
        constructor(namespaceId: NamespaceId);
        destroy(): void;
        transactThenTriggerDelayedStateChangedEvent(f: () => void): void;
        _save(): void;
        isActive(): boolean;
        getAgendaObjId(): string;
        setAgendaObjId(agendaObjId: string): this;
        getNumOutcomes(): number;
        getOutcomeName(index: number): string | undefined;
        setOutcomeName(index: number, name: string): this;
        getPhase(): AgendaPhaseType;
        setPhase(phase: AgendaPhaseType): this;
        _getSeatState(seatIndex: number): AgendaSeatStateSchemaType;
        getSeatAvailableVotes(seatIndex: number): number;
        setSeatAvailableVotes(seatIndex: number, votes: number): this;
        getSeatNoAfters(seatIndex: number): "unknown" | "no" | "never" | "play";
        setSeatNoAfters(seatIndex: number, noWhens: "unknown" | "no" | "never" | "play"): this;
        getSeatNoWhens(seatIndex: number): "unknown" | "no" | "never" | "play";
        setSeatNoWhens(seatIndex: number, noWhens: "unknown" | "no" | "never" | "play"): this;
        getSeatOutcomeChoice(seatIndex: number): number;
        setSeatOutcomeChoice(seatIndex: number, outcome: number): this;
        getSeatVotesForOutcome(seatIndex: number): number;
        setSeatVotesForOutcome(seatIndex: number, votes: number): this;
        getSeatVotesLocked(seatIndex: number): boolean;
        setSeatVotesLocked(seatIndex: number, locked: boolean): this;
        getRiders(): AgendaRiderSchemaType[];
        addRider(seatIndex: number, objId: string, outcome: number): this;
        removeRider(objId: string): this;
        getWaitingForMessage(): string;
    }
}
declare module "lib/agenda-lib/agenda-state/report-final-agenda-state" {
    import { PlayerSlot } from "ttpg-darrell";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    export type AgendaOutcomeSummary = {
        outcomeIndex: number;
        outcomeName: string;
        totalVotes: number;
        votingPlayerSlots: Array<PlayerSlot>;
    };
    export class ReportFinalAgendaState {
        private readonly _agendaState;
        static isComplete(agendaState: AgendaState): boolean;
        static getOutcomeIndexToTotalVotes(agendaState: AgendaState): Map<number, number>;
        static getOutcomeSummaries(agendaState: AgendaState): Array<AgendaOutcomeSummary>;
        static sortOutcomeIndicesByDecreasingVoteCount(agendaState: AgendaState): Array<number>;
        static summary(agendaState: AgendaState): string;
        constructor(agendaState: AgendaState);
    }
}
declare module "context-menu/right-click-rider/right-click-rider" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    export const ACTION_CLEAR_PREDICT: string;
    /**
     * Add "predict {agenda outcome}", "clear agenda outcome" options to riders.
     * Updates when agenda state changes.
     */
    export class RightClickRider implements IGlobal {
        private readonly _riderObjIds;
        private _agendaState;
        private _outcomeNames;
        private _outcomeNamesJoined;
        static isRider(obj: GameObject): boolean;
        static _getOutcomeNames(agendaState: AgendaState): Array<string>;
        init(): void;
        _maybeAddGameObject(obj: GameObject): void;
        _maybeRemoveGameObject(obj: GameObject): void;
        _onAgendaStateChange(agendaState: AgendaState): void;
        _removeActions(): void;
        _addActions(): void;
        /**
         * Attached to riders, update agenda state with rider->outcome link.
         *
         * @param obj
         * @param player
         * @param identifier
         * @returns
         */
        _onCustomActionHanlder: (obj: GameObject, player: Player, identifier: string) => void;
    }
}
declare module "lib/score-lib/scoreboard/scoreboard" {
    import { GameObject, Rotator, Vector } from "@tabletop-playground/api";
    export class Scoreboard {
        private readonly _find;
        _getLocalCenter(score: number): Vector | undefined;
        /**
         * Get all control tokens on the scoreboard (normally just one).
         *
         * @returns
         */
        _getPlayerSlotToAtopControlTokens(): Map<number, Array<GameObject>>;
        /**
         * Get player slot to leading control token on the scoreboard (highest score).
         *
         * @returns
         */
        getPlayerSlotToLeadControlToken(): Map<number, GameObject>;
        getLeadControlToken(playerSlot: number): GameObject | undefined;
        getPlayerSlotToScore(): Map<number, number>;
        getControlTokenRotation(): Rotator | undefined;
        getScoreboard(): GameObject | undefined;
        posToScore(pos: Vector): number | undefined;
        scoreToPos(score: number, playerSlot: number): Vector | undefined;
    }
}
declare module "lib/score-lib/advance-score/advance-score" {
    export class AdvanceScore {
        private readonly _scoreboard;
        addToScore(playerSlot: number, delta: number): boolean;
    }
}
declare module "lib/score-lib/move-card-to-player-scored/move-card-to-player-scored" {
    import { Card, CardHolder } from "@tabletop-playground/api";
    export class MoveCardToPlayerScored {
        _getPlayerScoringCardHolder(playerSlot: number): CardHolder | undefined;
        moveCard(card: Card, playerSlot: number): boolean;
    }
}
declare module "lib/control-token-lib/spawn-control-token" {
    import { GameObject } from "@tabletop-playground/api";
    export class SpawnControlToken {
        spawnControlToken(playerSlot: number): GameObject | undefined;
        spawnControlTokenOrThrow(playerSlot: number): GameObject;
    }
}
declare module "lib/control-token-lib/place-control-token-on-card" {
    import { Card, Vector } from "@tabletop-playground/api";
    import { SpawnControlToken } from "lib/control-token-lib/spawn-control-token";
    /**
     * Use a deterministic layout following player seating.
     */
    export class PlaceControlTokenOnCard {
        _spawnControlToken: SpawnControlToken;
        _computePos(center: Vector, playerSlot: number): Vector;
        place(card: Card, playerSlot: number): boolean;
    }
}
declare module "context-menu/right-click-score/right-click-score-private" {
    import { Card, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    /**
     * Score context menu item for cards that should move to
     * the player's scored area card-holer.
     */
    export class RightClickScorePrivate implements IGlobal {
        private readonly _actionName;
        static isScorablePrivate(card: Card): boolean;
        private readonly _customActionHandler;
        init(): void;
        _maybeAddContextMenuItem(card: Card): void;
        score(card: Card, player: Player): void;
    }
}
declare module "context-menu/right-click-score/right-click-score-public" {
    import { Card, Player } from "@tabletop-playground/api";
    /**
     * Score context menu for cards that receive control tokens;
     * they do NOT move the player's scored area card-holder.
     */
    export class RightClickScorePublic {
        private readonly _actionName;
        static isScorablePublic(card: Card): boolean;
        private readonly _customActionHandler;
        init(): void;
        _maybeAddContextMenuItem(card: Card): void;
        score(card: Card, player: Player): void;
    }
}
declare module "lib/command-token-lib/command-token-counter/command-token-counter" {
    import { GameObject } from "@tabletop-playground/api";
    export type CommandTokenCounts = {
        tactic: Array<GameObject>;
        fleet: Array<GameObject>;
        strategy: Array<GameObject>;
    };
    export class CommandTokenCounter {
        private static readonly ON_SHEET_DISTANCE_SQ;
        private _find;
        getPlayerSlotToCommandTokenCounts(): Map<number, CommandTokenCounts>;
    }
}
declare module "context-menu/system/activate-system/activate-system" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class ActivateSystem implements IGlobal {
        private readonly _actionName;
        private readonly _customActionHandler;
        init(): void;
        _maybeAddContextMenuItem(obj: GameObject): void;
        moveCommandTokenToSystem(systemTileObj: GameObject, player: Player): boolean;
    }
}
declare module "context-menu/system/control-token-system/control-token-system" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class ControlTokenSystem implements IGlobal {
        private readonly _find;
        private readonly _actionName;
        private readonly _customActionHandler;
        init(): void;
        _maybeAddContextMenuItem(obj: GameObject): void;
        addControlToken(systemTileObj: GameObject, player: Player): boolean;
    }
}
declare module "context-menu/system/diplomacy-system/diplomacy-system" {
    import { GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class DiplomacySystem implements IGlobal {
        private readonly _actionName;
        private readonly _customActionHandler;
        init(): void;
        _maybeAddContextMenuItem(obj: GameObject): void;
        diplomacySystem(systemTileObj: GameObject, player: Player): boolean;
        _getExistingCommandTokenOwners(systemTileObj: GameObject): Set<number>;
    }
}
declare module "context-menu/system/explore-system/right-click-explore" {
    import { Card, GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    import { Planet } from "lib/system-lib/planet/planet";
    import { System } from "lib/system-lib/system/system";
    import { TraitSchemaType } from "lib/system-lib/schema/basic-types-schema";
    export class RightClickExplore implements IGlobal {
        private readonly _find;
        private _isDistantSuns;
        static _checkIsDistantSuns(): boolean;
        private readonly _onFactionsChanged;
        private readonly _customActionHandler;
        init(): void;
        _maybeSetCustomActions(obj: GameObject): void;
        _setSystemCustomActions(systemTileObj: GameObject): void;
        _getExploreDeck(trait: TraitSchemaType | "frontier"): Card | undefined;
        _getFrontierToken(systemTileObj: GameObject): GameObject | undefined;
        _explorePlanet(system: System, planet: Planet, trait: TraitSchemaType, player: Player): void;
        _applyExploreCardToPlanet(card: Card, trait: TraitSchemaType, system: System, planet: Planet, player: Player): void;
        _exploreFrontierToken(frontierTokenObj: GameObject, player: Player): void;
        _maybeAddPlanetAttachment(planet: Planet, exploreCardNsid: string): void;
        _maybeAddSystemAttachment(system: System, exploreCardNsid: string): void;
        _exploreDistantSuns(system: System, planet: Planet, trait: TraitSchemaType, player: Player): void;
        _addChoice(card: Card, callback: () => void): void;
        _removeUIs(card: Card): void;
    }
}
declare module "ui/abstract-ui/abtract-ui" {
    import { Widget } from "@tabletop-playground/api";
    export type UI_SIZE = {
        w: number;
        h: number;
    };
    /**
     * Represent a single UI widget.
     *
     * Needing everything at constructor time is a bit of a pain, but it's the best
     * way to ensure that the UI is immutable.
     */
    export class AbstractUI {
        private readonly _widget;
        private readonly _width;
        private readonly _height;
        constructor(widget: Widget, size: UI_SIZE);
        /**
         * Remove any event handlers, etc.
         */
        destroy(): void;
        getSize(): UI_SIZE;
        getWidget(): Widget;
    }
}
declare module "ui/abstract-window/abstract-window" {
    import { Rotator, Vector } from "@tabletop-playground/api";
    import { NamespaceId, Window, WindowParams } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export type CreateAbstractUIParams = {
        playerSlot: number;
        scale: number;
    };
    export type CreateAbstractUIType = (params: CreateAbstractUIParams) => AbstractUI;
    /**
     * AbstractUI and Window have similar, but not identical APIs.
     * This class is a bridge from AbstractUI to Window.
     *
     * Not actually an "abstract" class, but deals in AbstractUIs.
     */
    export class AbstractWindow {
        private readonly _createAbstractUI;
        private readonly _namespaceId;
        private readonly _windowParams;
        private _addHost;
        static getPlayerSlotToTransform(): {
            [key: number]: {
                pos: [x: number, y: number, z: number] | Vector;
                rot: [pitch: number, yaw: number, roll: number] | Rotator;
            };
        };
        constructor(createAbstractUI: CreateAbstractUIType, namespaceId: NamespaceId | undefined, windowTitle: string);
        invalidateSize(): void;
        addHost(): this;
        getMutableWindowParams(): WindowParams;
        moveWindowLeftOfTurnOrder(): this;
        createWindow(playerSlots?: Array<number>): Window;
    }
}
declare module "lib/game-data-lib/updators/updator-active-system/updator-active-system-type" {
    export type UpdatorActiveSystemType = {
        tile: number;
        planets: Array<string>;
    };
}
declare module "lib/game-data-lib/updators/updator-config/updator-config-type" {
    export type UpdatorConfigType = {
        pok?: boolean;
        codex1?: boolean;
        codex2?: boolean;
        codex3?: boolean;
        codex4?: boolean;
    };
}
declare module "lib/game-data-lib/updators/updator-objectives-progress/updator-objectives-progress-type" {
    export type UpdatorObjectiveProgressType = {
        name: string;
        abbr: string;
        stage: number;
        progress: {
            header: string;
            values: Array<{
                value: string | number | boolean;
                success: boolean;
            }>;
        };
        scoredBy: Array<number>;
    };
}
declare module "lib/game-data-lib/updators/updator-objectives/updator-objectives-type" {
    export type UpdatorObjectivesType = {
        "Public Objectives I"?: Array<string>;
        "Public Objectives II"?: Array<string>;
        "Secret Objectives"?: Array<string>;
        Agenda?: Array<string>;
        Relics?: Array<string>;
        Other?: Array<string>;
    };
}
declare module "lib/game-data-lib/updators/updator-player-command-tokens/updator-player-command-tokens-type" {
    export type UpdatorPlayerCommandTokensType = {
        tactics: number;
        fleet: number;
        strategy: number;
    };
}
declare module "lib/game-data-lib/updators/updator-player-leaders/updator-player-leaders-type" {
    export type UpdatorPlayerLeadersType = {
        agent?: "locked" | "unlocked";
        commander?: "locked" | "unlocked";
        hero?: "locked" | "unlocked";
    };
}
declare module "lib/game-data-lib/updators/updator-player-hand-summary/updator-player-hand-summary-type" {
    export type UpdatorPlayerHandSummaryType = {
        "Secret Objectives"?: number;
        Actions?: number;
        Promissory?: number;
    };
}
declare module "lib/game-data-lib/updators/updator-player-planet-totals/updator-player-planet-totals-type" {
    export type UpdatorPlayerPlanetTotalsType = {
        influence: {
            avail: number;
            total: number;
        };
        resources: {
            avail: number;
            total: number;
        };
        techs: {
            blue: number;
            red: number;
            green: number;
            yellow: number;
        };
        traits: {
            cultural: number;
            hazardous: number;
            industrial: number;
        };
        legendary: number;
    };
}
declare module "lib/game-data-lib/updators/updator-timer/updator-timer-type" {
    export type UpdatorTimerType = {
        seconds: number;
        anchorTimestamp: number;
        anchorSeconds: number;
        direction: -1 | 0 | 1;
        countDown: number;
    };
}
declare module "lib/game-data-lib/game-data/game-data" {
    import { UpdatorActiveSystemType } from "lib/game-data-lib/updators/updator-active-system/updator-active-system-type";
    import { UpdatorConfigType } from "lib/game-data-lib/updators/updator-config/updator-config-type";
    import { UpdatorObjectiveProgressType } from "lib/game-data-lib/updators/updator-objectives-progress/updator-objectives-progress-type";
    import { UpdatorObjectivesType } from "lib/game-data-lib/updators/updator-objectives/updator-objectives-type";
    import { UpdatorPlayerCommandTokensType } from "lib/game-data-lib/updators/updator-player-command-tokens/updator-player-command-tokens-type";
    import { UpdatorPlayerLeadersType } from "lib/game-data-lib/updators/updator-player-leaders/updator-player-leaders-type";
    import { UpdatorPlayerHandSummaryType } from "lib/game-data-lib/updators/updator-player-hand-summary/updator-player-hand-summary-type";
    import { UpdatorPlayerPlanetTotalsType } from "lib/game-data-lib/updators/updator-player-planet-totals/updator-player-planet-totals-type";
    import { UpdatorTimerType } from "lib/game-data-lib/updators/updator-timer/updator-timer-type";
    export type PerPlayerGameData = {
        active?: boolean;
        color?: string;
        commandTokens?: UpdatorPlayerCommandTokensType;
        custodiansPoints?: number;
        factionFull?: string;
        factionShort?: string;
        handSummary?: UpdatorPlayerHandSummaryType;
        laws?: Array<string>;
        leaders?: UpdatorPlayerLeadersType;
        objectives?: Array<string>;
        planetTotals?: UpdatorPlayerPlanetTotalsType;
        score?: number;
        steamName?: string;
        strategyCards?: Array<string>;
        strategyCardsFaceDown?: Array<string>;
        technologies?: Array<string>;
        turnOrder?: number;
        commodities?: number;
        tradeGoods?: number;
        maxCommodities?: number;
    };
    /**
     * JSON-serializable game data (NOT a class).
     */
    export type GameData = {
        players: Array<PerPlayerGameData>;
        activeSystem?: UpdatorActiveSystemType;
        config?: UpdatorConfigType;
        hexSummary?: string;
        history?: Array<GameData>;
        laws?: Array<string>;
        mapString?: string;
        objectivesProgress?: Array<UpdatorObjectiveProgressType>;
        objectives?: UpdatorObjectivesType;
        platform?: string;
        round?: number;
        scoreboard?: number;
        setupTimestamp?: number;
        speaker?: string;
        timer?: UpdatorTimerType;
        timestamp?: number;
        turn?: string;
    };
}
declare module "ui/config/config" {
    import { Color } from "@tabletop-playground/api";
    export const CONFIG: Readonly<{
        FONT_SIZE: 12;
        SPACING: 4;
        BUTTON_WIDTH: 180;
        BUTTON_HEIGHT: 36;
        DARKER: Color;
    }>;
}
declare module "ui/player-action-phase-time-ui/player-action-phase-time-ui" {
    import { Widget } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class PlayerActionPhaseTimeUI extends AbstractUI {
        private readonly _roundToSeatIndexToTimeText;
        private intervalHandle;
        readonly _onInterval: () => void;
        static _formatTime(secondsTotal: number): string;
        constructor(scale: number);
        destroy(): void;
        _createInnerWidget(scale: number): Widget;
        update(): void;
        _updateRoundAndSeatIndex(round: number, seatIndex: number): void;
    }
}
declare module "context-menu/toggle-action-phase-times/toggle-action-phase-times" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleActionPhaseTimes implements IGlobal {
        private _gameData;
        private readonly _onGameData;
        init(): void;
    }
}
declare module "ui/button-ui/label-ui" {
    import { Text } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class LabelUI extends AbstractUI {
        private readonly _text;
        constructor(scale: number);
        getText(): Text;
    }
}
declare module "ui/panel/horizontal-ui-builder" {
    import { VerticalAlignment } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    /**
     * Entries can be of varying sizes, aligned to top.
     */
    export class HorizontalUIBuilder {
        private readonly _uis;
        private _padding;
        private _spacing;
        private _verticalAlignment;
        addUIs(uis: Array<AbstractUI>): HorizontalUIBuilder;
        setPadding(padding: number): HorizontalUIBuilder;
        setSpacing(spacing: number): HorizontalUIBuilder;
        setVerticalAlignment(verticalAlignment: VerticalAlignment): HorizontalUIBuilder;
        build(): AbstractUI;
    }
}
declare module "ui/panel/vertical-ui-builder" {
    import { HorizontalAlignment } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    /**
     * Entries can be of varying sizes, aligned to left.
     */
    export class VerticalUIBuilder {
        private readonly _uis;
        private _horizontalAligntment;
        private _padding;
        private _spacing;
        private _overrideHeight;
        addUIs(uis: Array<AbstractUI>): VerticalUIBuilder;
        setHorizontalAlignment(horizontalAlignment: HorizontalAlignment): VerticalUIBuilder;
        setOverrideHeight(overrideHeight: number): VerticalUIBuilder;
        setPadding(padding: number): VerticalUIBuilder;
        setSpacing(spacing: number): VerticalUIBuilder;
        build(): AbstractUI;
    }
}
declare module "ui/all-players-techs.ui/all-players-techs-ui" {
    import { Color } from "@tabletop-playground/api";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class AllPlayersTechsUI extends AbstractUI {
        static getTechNameToColor(): Map<string, Color>;
        constructor(scale: number, gameData: GameData);
    }
}
declare module "context-menu/toggle-all-players-tech/toggle-all-players-tech" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleAllPlayersTech implements IGlobal {
        private _gameData;
        private _abstractWindow;
        private _windowMaxTech;
        private readonly _onGameData;
        init(): void;
    }
}
declare module "context-menu/toggle-borders/toggle-borders" {
    import { IGlobal } from "ttpg-darrell";
    export const TOGGLE_BORDERS_ACTION: string;
    export class ToggleBorders implements IGlobal {
        private readonly _onCustomActionHandler;
        init(): void;
    }
}
declare module "ui/button-ui/button-ui" {
    import { Button } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class ButtonUI extends AbstractUI {
        private readonly _button;
        constructor(scale: number);
        destroy(): void;
        getButton(): Button;
    }
}
declare module "ui/combat-ui/combat-ui-space/combat-ui-space" {
    import { Button } from "@tabletop-playground/api";
    import { PlayerSlot } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class CombatUISpace extends AbstractUI {
        private readonly _spaceCannonOffense;
        private readonly _ambush;
        private readonly _antifighterBarrage;
        private readonly _spaceCombat;
        constructor(scale: number, playerSlot: PlayerSlot);
        destroy(): void;
        getSpaceCannonOffense(): Button;
        getAmbush(): Button;
        getAntifighterBarrage(): Button;
        getSpaceCombat(): Button;
    }
}
declare module "ui/combat-ui/combat-ui-planet/combat-ui-planet" {
    import { Button } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class CombatUIPlanet extends AbstractUI {
        private readonly _planetIndex;
        private _planetNameValue;
        private readonly _planetName;
        private readonly _bombardment;
        private readonly _spaceCannonDefense;
        private readonly _groundCombat;
        private readonly _onSystemActivatedHandler;
        constructor(scale: number, planetIndex: number);
        destroy(): void;
        update(): void;
        getBombardment(): Button;
        getSpaceCannonDefense(): Button;
        getGroundCombat(): Button;
    }
}
declare module "ui/combat-ui/combat-ui-all-simple/combat-ui-all-simple" {
    import { PlayerSlot } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    /**
     * Clean combat UI, minimal.
     */
    export class CombatUIAllSimple extends AbstractUI {
        private readonly _combatUiSpace;
        private readonly _combatUiPlanets;
        constructor(scale: number, playerSlot: PlayerSlot);
        destroy(): void;
    }
}
declare module "context-menu/toggle-combat-window/toggle-combat-window" {
    import { Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    export const ACTION_TOGGLE_COMBAT: string;
    export class ToggleCombatWindow implements IGlobal {
        private _window;
        readonly _onSystemActivatedHandler: (system: System, player: Player) => void;
        _createWindow(): void;
        /**
         * This window gets recreated whenever a system is activated.
         * Do not use the default toggle action, because it will move
         * to the end of the list on recreate.
         *
         * @param player
         * @param action
         */
        private readonly onCustomAction;
        init(): void;
        /**
         * Activating player, players with units in the system, and players
         * with PDS2 adjacent.
         *
         * @returns
         */
        _getRelevantPlayerSlots(system: System, player: Player): Array<number>;
    }
}
declare module "ui/suggested-settings-ui/suggested-settings-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class SuggestedSettingsUI extends AbstractUI {
        private readonly _ui;
        constructor(scale: number);
        destroy(): void;
    }
}
declare module "ui/button-ui/long-richtext-ui" {
    import { RichText } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class LongRichTextUI extends AbstractUI {
        private readonly _richText;
        constructor(scaledWidth: number, scale: number);
        getRichText(): RichText;
    }
}
declare module "ui/button-ui/two-icon-label-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class TwoIconLabel extends AbstractUI {
        private readonly _icon1;
        private readonly _icon2;
        private readonly _label;
        constructor(scale: number);
        setIcon1(image: string, packageId: string): this;
        setIcon2(image: string, packageId: string): this;
        setLabel(text: string): this;
    }
}
declare module "ui/help-ui/help-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class HelpUI extends AbstractUI {
        constructor(scale: number);
    }
}
declare module "ui/div-ui/div-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class DivUI extends AbstractUI {
        constructor(scale: number, scaledLength: number, orientation: "horizontal" | "vertical");
    }
}
declare module "ui/suggested-key-unbinds-ui/suggested-key-unbinds-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class SuggestedKeyUnbindsUI extends AbstractUI {
        private readonly _ui;
        constructor(scale: number);
        destroy(): void;
    }
}
declare module "ui/help-ui/help-with-extras-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class HelpWithExtrasUI extends AbstractUI {
        private readonly _ui;
        constructor(scale: number);
        destroy(): void;
    }
}
declare module "context-menu/toggle-help/toggle-help" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleHelp implements IGlobal {
        init(): void;
    }
}
declare module "lib/map-string-lib/map-place/map-place-frontier-tokens" {
    import { System } from "lib/system-lib/system/system";
    export class MapPlaceFrontierTokens {
        static _getZeroPlanetSystems(): Array<System>;
        static _placeFrontierToken(system: System): void;
        placeFrontierTokens(): void;
    }
}
declare module "lib/map-string-lib/map-place/map-place-planet-cards" {
    import { Card } from "@tabletop-playground/api";
    import { Planet } from "lib/system-lib/planet/planet";
    export class MapPlacePlanetCards {
        private readonly _cardUtil;
        private readonly _find;
        /**
         * Get all non-home planets in the game.
         *
         * @returns
         */
        _getAllPlanets(): Array<Planet>;
        /**
         * Get map from card nsid to planet.  Legendary planets have multiple cards.
         *
         * @returns
         */
        _getCardNsidToPlanet(): Map<string, Planet>;
        /**
         * Get subset decks of planet/legedary decks for the given card nsids.
         * Other (inactive) planet cards stay in their original decks.
         *
         * @param nsids
         * @returns
         */
        _getActivePlanetsDecks(nsids: Set<string>): Array<Card>;
        /**
         * Place planet cards above their respective planets.
         */
        placePlanetCards(): void;
        _placePlanetCard(planet: Planet, card: Card): void;
    }
}
declare module "lib/map-string-lib/map-remove/map-remove-all-non-home-systems" {
    export class MapRemoveAllNonHomeSystems {
        removeAllNonHomeSystems(): void;
    }
}
declare module "lib/map-string-lib/map-remove/map-remove-frontier-tokens" {
    import { GameObject } from "@tabletop-playground/api";
    export class MapRemoveFrontierTokens {
        removeFrontierTokens(): void;
        _removeFrontierToken(obj: GameObject): void;
    }
}
declare module "lib/map-string-lib/map-remove/map-remove-planet-cards" {
    import { Card } from "@tabletop-playground/api";
    export class MapRemovePlanetCards {
        removePlanetCards(): void;
        _removePlanetCard(card: Card): void;
    }
}
declare module "lib/map-string-lib/map-string/map-string-parser" {
    export type MapStringEntry = {
        tile: number;
        side?: "a" | "b";
        rot?: 0 | 1 | 2 | 3 | 4 | 5;
    };
    /**
     * A map string is a text representation of system tile layout.
     * Normally "18" is assumed to be the center, then the first
     * map string entry is above it and winding clockwise.  Once back
     * to the "north" line bump out to the next ring and continue.
     *
     * A map string may have a first entry in curly braces {} to
     * override 18 as the center tile.
     *
     * Adapted from Dotlogix's JavaScript.
     */
    export class MapStringParser {
        private readonly _entryRegExp;
        private readonly _overrideFirstRegExp;
        /**
         * Parse a single map string entry, "<number><side><rotation>".
         * Number is required, side and rotation are optional.
         *
         * @param raw
         * @returns
         */
        parseEntry(raw: string): MapStringEntry | undefined;
        /**
         * Parse a map string, a space or comma separated list of entries.
         * Add any invalid entries to the invalidEntries array.
         *
         * @param mapString
         * @param invalidEntries
         * @returns
         */
        parse(mapString: string, invalidEntries: Array<string>): Array<MapStringEntry>;
        /**
         * Parse a map string, throw an error if any entries are invalid.
         *
         * @param mapString
         * @returns
         */
        parseOrThrow(mapString: string): Array<MapStringEntry>;
    }
}
declare module "lib/map-string-lib/map-string/map-string-hex" {
    import { HexType } from "ttpg-darrell";
    /**
     * Translate between map string index and hex position.
     *
     * Adapted from Somberlord's JavaScript code.
     */
    export class MapStringHex {
        static _firstIndexInRing(radius: number): number;
        static _indexToRing(index: number): number;
        /**
         * Translate a hex position to a map string index.
         *
         * @param hex
         * @returns
         */
        hexToIndex(hex: HexType): number;
        /**
         * Translate a map string index to a hex position.
         *
         * @param index
         * @returns
         */
        indexToHex(index: number): HexType;
    }
}
declare module "lib/map-string-lib/map-string/map-string-load" {
    import { Rotator, Vector } from "@tabletop-playground/api";
    import { MapStringEntry } from "lib/map-string-lib/map-string/map-string-parser";
    import { System } from "lib/system-lib/system/system";
    export class MapStringLoad {
        private readonly _find;
        _parseAndValidateMapString(mapString: string): Array<MapStringEntry> | undefined;
        _validateSystems(entries: Array<MapStringEntry>): boolean;
        /**
         * Get a snapshot of systems in game (on the table AND in containers).
         * Used to place systems with duplicates support.
         */
        _getTileNumberToSystemsSnapshot(): Map<number, Array<System>>;
        _tryMoveExistingSystemTileObj(systemTileNumber: number, pos: Vector, rot: Rotator, systemsSnapshot: Map<number, Array<System>>): boolean;
        _trySpawnNewSystemTileObj(systemTileNumber: number, pos: Vector, rot: Rotator): boolean;
        load(mapString: string): boolean;
        private _load;
    }
}
declare module "lib/map-string-lib/map-string/map-string-save" {
    export class MapStringSave {
        save(): string;
    }
}
declare module "lib/map-string-lib/map-string/map-string-format" {
    import { MapStringEntry } from "lib/map-string-lib/map-string/map-string-parser";
    export class MapStringFormat {
        _formatEntry(entry: MapStringEntry, index: number): string;
        format(entries: Array<MapStringEntry>): string;
    }
}
declare module "lib/map-string-lib/map-string/map-string-hyperlanes" {
    export class MapStringHyperlanes {
        static get(playerCount: number): string;
        /**
         * Shift systems with an overlaying hyperlane to the closest open slot
         * (could be in another ring!), then apply the hyperlanes to the map string.
         *
         * @param mapString
         * @param playerCount
         * @returns
         */
        addHyperlanes(mapString: string, hyperlanesMapString: string): string;
    }
}
declare module "lib/system-lib/system/system-summary" {
    import { System } from "lib/system-lib/system/system";
    export type SystemSummaryType = {
        influence: number;
        optInfluence: number;
        resources: number;
        optResources: number;
        legendary: string;
        techs: string;
        traits: string;
        wormholes: string;
    };
    export class SystemSummary {
        private readonly _systems;
        static getFromSystemTileNumbers(systemTileNumbers: ReadonlyArray<number>): SystemSummary;
        constructor(systems: Array<System>);
        getSummaryRaw(): SystemSummaryType;
        getSummary(): string;
    }
}
declare module "lib/draft-lib/generate-slices/generate-slices" {
    import { HexType } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    import { SystemTierType } from "lib/system-lib/system/system-tier";
    export type SliceTiles = ReadonlyArray<number>;
    export type SliceShape = ReadonlyArray<HexType>;
    export type SliceMakeup = ReadonlyArray<SystemTierType>;
    export type GenerateSlicesParams = {
        sliceMakeups: ReadonlyArray<SliceMakeup>;
        sliceShape: SliceShape;
        minAlphaWormholes?: number;
        minBetaWormholes?: number;
        minLegendary?: number;
    };
    export class SliceInProgress {
        private readonly _size;
        private readonly _remainingMakeup;
        private readonly _systems;
        constructor(makeup: ReadonlyArray<SystemTierType>);
        addSystem(system: System): void;
        getNextRemainingTier(): SystemTierType | undefined;
        getSystems(): Array<System>;
        hasRemainingTier(tier: SystemTierType): boolean;
        removeRemainingTier(tier: SystemTierType): void;
    }
    export class GenerateSlices {
        private readonly _params;
        private readonly _slicesInProgress;
        private readonly _blacklistSystemTileNumbers;
        constructor(params: GenerateSlicesParams);
        setBlacklistSystemTileNumbers(systemTileNumbers: Array<number>): this;
        generateSlices(sliceCount: number): Array<SliceTiles>;
        _getShuffledSystems(): Array<System>;
        _getSystemsForTier(systems: Array<System>, tier: SystemTierType): Array<System>;
        _getShortestSliceWithTier(tier: SystemTierType): SliceInProgress | undefined;
        _chooseAndAddNextSystem(sliceInProgress: SliceInProgress, systems: Array<System>): System;
        _score(sliceInProgress: SliceInProgress, system: System): number;
        /**
         * Promote wormholes and legendaries according to params.  Return them in a
         * new array, removing them from the input systems array.
         *
         * @param systems
         */
        _promoteWormholesAndLegendaries(systems: Array<System>): Array<System>;
        _hasAdjacentAnomalies(slice: SliceTiles): boolean;
        _separateAnomalies(slice: SliceTiles, tryShuffleFirst?: boolean): SliceTiles;
        _permutator(array: Array<number>, inspector: (candidate: Array<number>) => boolean): Array<number> | undefined;
    }
}
declare module "lib/draft-lib/draft-state/draft-state" {
    import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
    import { z } from "zod";
    import { SliceShape, SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    import { Faction } from "lib/faction-lib/faction/faction";
    export const DraftStateSchema: z.ZodObject<{
        baseMap: z.ZodDefault<z.ZodString>;
        sliceShape: z.ZodDefault<z.ZodReadonly<z.ZodArray<z.ZodString, "many">>>;
        sliceShapeOverrides: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodDefault<z.ZodReadonly<z.ZodArray<z.ZodString, "many">>>>, "many">>;
        slices: z.ZodDefault<z.ZodReadonly<z.ZodArray<z.ZodReadonly<z.ZodArray<z.ZodNumber, "many">>, "many">>>;
        sliceLabels: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        factions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        speakerIndex: z.ZodDefault<z.ZodNumber>;
        sliceIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
        factionIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
        seatIndexToPlayerSlot: z.ZodDefault<z.ZodArray<z.ZodNullable<z.ZodNumber>, "many">>;
    }, "strip", z.ZodTypeAny, {
        sliceShape: readonly string[];
        baseMap: string;
        sliceShapeOverrides: (readonly string[] | null)[];
        slices: readonly (readonly number[])[];
        sliceLabels: string[];
        factions: string[];
        speakerIndex: number;
        sliceIndexToPlayerSlot: (number | null)[];
        factionIndexToPlayerSlot: (number | null)[];
        seatIndexToPlayerSlot: (number | null)[];
    }, {
        sliceShape?: readonly string[] | undefined;
        baseMap?: string | undefined;
        sliceShapeOverrides?: (readonly string[] | null | undefined)[] | undefined;
        slices?: readonly (readonly number[])[] | undefined;
        sliceLabels?: string[] | undefined;
        factions?: string[] | undefined;
        speakerIndex?: number | undefined;
        sliceIndexToPlayerSlot?: (number | null)[] | undefined;
        factionIndexToPlayerSlot?: (number | null)[] | undefined;
        seatIndexToPlayerSlot?: (number | null)[] | undefined;
    }>;
    export type DraftStateSchemaType = z.infer<typeof DraftStateSchema>;
    /**
     * Persistent draft state: player choices.
     */
    export class DraftState {
        readonly onDraftStateChanged: TriggerableMulticastDelegate<(draftState: DraftState) => void>;
        private readonly _namespaceId;
        private readonly _data;
        static isDraftInProgress(namespaceId: NamespaceId): boolean;
        constructor(namespaceId: NamespaceId);
        destroy(): void;
        _save(): void;
        isActive(): boolean;
        isComplete(): boolean;
        setBaseMap(baseMap: string): this;
        getBaseMap(): string;
        setSliceShape(sliceShape: SliceShape): this;
        overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this;
        getSliceShape(seatIndex: number): SliceShape;
        setSlices(slices: Array<SliceTiles>): this;
        getSlices(): Array<SliceTiles>;
        setSliceLabels(sliceLabels: Array<string>): this;
        getSliceLabels(): Array<string>;
        setFactions(factions: Array<Faction>): this;
        getFactions(): Array<Faction>;
        setSpeakerIndex(speakerIndex: number): this;
        getSpeakerIndex(): number;
        setSliceIndexToPlayerSlot(sliceIndex: number, playerSlot: number): this;
        getSliceIndexToPlayerSlot(sliceIndex: number): number;
        setFactionIndexToPlayerSlot(factionIndex: number, playerSlot: number): this;
        getFactionIndexToPlayerSlot(factionIndex: number): number;
        /**
         * What faction is assigned to the result seat index?
         *
         * @param seatIndex
         * @returns
         */
        getSeatIndexToFaction(seatIndex: number): Faction | undefined;
        setSeatIndexToPlayerSlot(seatIndex: number, playerSlot: number): this;
        getSeatIndexToPlayerSlot(seatIndex: number): number;
    }
}
declare module "lib/map-string-lib/map-home-system-locations/map-home-system-locations" {
    import { GameObject, Vector } from "@tabletop-playground/api";
    export class MapHomeSystemLocations {
        constructor();
        get(playerSlot: number): Vector | undefined;
        findExistingGenericHomeSystem(playerSlot: number): GameObject | undefined;
        spawnGenericHomeSystem(playerSlot: number): GameObject | undefined;
        findOrSpawnGenericHomeSystemOrThrow(playerSlot: number): GameObject;
    }
}
declare module "ui/map-ui/map-ui" {
    import { Color } from "@tabletop-playground/api";
    import { HexType } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class MapUI extends AbstractUI {
        private readonly _mapStringIndexToImageWidget;
        private readonly _hexToTextWidget;
        /**
         * Get a negative tile number that will render as this player slot's color.
         *
         * @param playerSlot
         * @returns
         */
        static playerSlotToColorTileNumber(playerSlot: number): number;
        /**
         * Translate a color tile number to the linked player slot color.
         *
         * @param tileNumber
         * @returns
         */
        static colorTileNumberToColor(tileNumber: number): Color | undefined;
        constructor(mapString: string, hexToLabel: Map<HexType, string>, scale: number);
        update(mapString: string, hexToLabel: Map<HexType, string>): void;
    }
}
declare module "ui/draft/faction-ui/faction-ui" {
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export const BOX_W: number;
    export const BOX_H: number;
    export const FONT_SIZE: number;
    export const SPACING: number;
    export class FactionUI extends AbstractUI {
        constructor(faction: Faction, scale: number);
    }
}
declare module "ui/draft/seat-ui/seat-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class SeatUI extends AbstractUI {
        static _getPlayerSlotOrThrow(seatIndex: number): number;
        static _getLabelOrThrow(seatIndex: number, speakerSeatIndex: number): string;
        constructor(seatIndex: number, speakerSeatIndex: number, scale: number);
    }
}
declare module "lib/draft-lib/draft-to-map-string/draft-to-map-string" {
    import { HexType } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { SliceShape, SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    export type MapStringAndHexToPlayerName = {
        mapString: string;
        hexToPlayerName: Map<HexType, string>;
    };
    export class DraftToMapString {
        private readonly _defaultSliceShape;
        private readonly _seatIndexToSliceShape;
        private readonly _seatIndexToAnchorHex;
        static fromDraftState(draftState: DraftState): MapStringAndHexToPlayerName;
        constructor(sliceShape: SliceShape);
        overrideSliceShape(seatIndex: number, sliceShape: SliceShape): this;
        _getSliceShape(seatIndex: number): SliceShape;
        buildMapString(seatIndexToSliceTiles: Map<number, SliceTiles>, seatIndexToFaction: Map<number, Faction>, seatIndexToPlayerName: Map<number, string>): MapStringAndHexToPlayerName;
        _fillMissingMapStringEntries(mapStringEntries: Array<string>): void;
        _addBaseMap(oldMap: string, baseMap: string): string;
    }
}
declare module "lib/faction-lib/unpack/abstract-unpack/abstract-unpack" {
    import { Card, CardHolder } from "@tabletop-playground/api";
    import { Faction } from "lib/faction-lib/faction/faction";
    export abstract class AbstractUnpack {
        private readonly _faction;
        private readonly _playerSlot;
        constructor(faction: Faction, playerSlot: number);
        getFaction(): Faction;
        getPlayerSlot(): number;
        abstract unpack(): void;
        abstract remove(): void;
        spawnDeckAndFilterSourcesOrThrow(cardNsidPrefix: string): Card;
        getPlayerHandHolderOrThrow(): CardHolder;
        dealToPlayerOrThrow(card: Card): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-control-tokens/unpack-control-tokens" {
    import { Container } from "@tabletop-playground/api";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackControlTokens extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
        _getControlTokenContainerOrThrow(): Container;
    }
}
declare module "lib/faction-lib/unpack/unpack-command-tokens/unpack-command-tokens" {
    import { Container } from "@tabletop-playground/api";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackCommandTokens extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
        _getCommandTokenContainerOrThrow(): Container;
    }
}
declare module "lib/faction-lib/unpack/unpack-faction-alliance/unpack-faction-alliance" {
    import { Card } from "@tabletop-playground/api";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    export class UnpackFactionAlliance extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        _dealAllianceCardsAndDeleteDeck(unfilteredAlliancesDeck: Card): void;
        remove(): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-faction-extras/unpack-faction-extras" {
    import { Container } from "@tabletop-playground/api";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackFactionExtras extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
        _getFactionExtrasContainerOrThrow(): Container;
    }
}
declare module "lib/faction-lib/unpack/unpack-faction-promissory/unpack-faction-promissory" {
    import { Card } from "@tabletop-playground/api";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    export class UnpackFactionPromissory extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        _dealPromissoryCardsAndDeleteDeck(unfilteredPromissoryDeck: Card): void;
        remove(): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-faction-sheet/unpack-faction-sheet" {
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    export class UnpackFactionSheet extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-faction-tech/unpack-faction-tech" {
    import { Card } from "@tabletop-playground/api";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    export class UnpackFactionTech extends AbstractUnpack {
        private readonly _cardUtil;
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
        _getExistingTechDeckOrThrow(): Card;
        _filterFactionTech(deck: Card): Card | undefined;
        _addFilteredToExistingTechDeck(filtered: Card | undefined): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-home-system/unpack-home-system" {
    import { GameObject } from "@tabletop-playground/api";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackHomeSystem extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        _findGenericHomeSystemTileOrThrow(): GameObject;
        _findFactionSheetOrThrow(): GameObject;
        _spawnGenericHomeSystemTileOrThrow(): GameObject;
        _getHomeSystemTileNsid(): string;
        _spawnHomeSystemTile(): GameObject;
        _findHomeSystemTileOrThrow(): GameObject;
        _getSurrogateSystemTileNsid(): string | undefined;
        _spawnSurrogateSystemTile(): GameObject | undefined;
        _findSurrogateSystemTile(): GameObject | undefined;
        unpack(): void;
        remove(): void;
    }
}
declare module "lib/remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source" {
    import { GameObject } from "@tabletop-playground/api";
    /**
     * Remove content based on source or NSID.
     */
    export class RemoveByNsidOrSource {
        private readonly _cardUtil;
        private readonly _removeSources;
        private readonly _removeNsids;
        private readonly _shouldRemove;
        /**
         * Add a source to remove.
         * @param source Source to remove.
         */
        addSource(source: string): this;
        /**
         * Add an NSID to remove.
         * @param nsid NSID to remove.
         */
        addNsid(nsid: string): this;
        hasSource(source: string): boolean;
        hasNsid(nsid: string): boolean;
        removeOne(obj: GameObject): this;
        removeAll(): this;
        shouldRemove(nsid: string): boolean;
    }
}
declare module "lib/faction-lib/unpack/unpack-leaders/unpack-leaders" {
    import { Card, GameObject, Rotator, SnapPoint } from "@tabletop-playground/api";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackLeaders extends AbstractUnpack {
        private readonly _cardUtil;
        private readonly _find;
        private readonly _removeByNsidOrSource;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
        _findLeaderSheetOrThrow(): GameObject;
        _unpackLeaders(deck: Card, leaderNsids: Array<string>, snapPoint: SnapPoint, rotator: Rotator): void;
    }
}
declare module "lib/tech-lib/find-player-tech-deck/find-player-tech-deck" {
    import { Card } from "@tabletop-playground/api";
    export class FindPlayerTechDeck {
        private readonly _find;
        _getTechDeck(playerSlot: number, errors: Array<string>): Card | undefined;
        getTechDeck(playerSlot: number): Card | undefined;
        getTechDeckOrThrow(playerSlot: number): Card;
    }
}
declare module "lib/faction-lib/unpack/unpack-starting-tech/unpack-starting-tech" {
    import { Card } from "@tabletop-playground/api";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackStartingTech extends AbstractUnpack {
        private readonly _cardUtil;
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
        _getTechDeckOrThrow(): Card;
    }
}
declare module "lib/faction-lib/unpack/unpack-starting-units/unpack-starting-units" {
    import { GameObject } from "@tabletop-playground/api";
    import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    export class UnpackStartingUnits extends AbstractUnpack {
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        _getUnitPlasticOrThrow(unit: UnitType): GameObject;
        _findHomeSystemTileOrThrow(): GameObject;
        unpack(): void;
        remove(): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-home-planet-cards/unpack-home-planet-cards" {
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { Card } from "@tabletop-playground/api";
    export class UnpackHomePlanetCards extends AbstractUnpack {
        private readonly _cardUtil;
        private readonly _find;
        constructor(faction: Faction, playerSlot: number);
        _getHomePlanetCardsNsidsOrThrow(): Array<string>;
        _getPlanetDeckOrThrow(): Card;
        unpack(): void;
        remove(): void;
    }
}
declare module "lib/faction-lib/unpack/unpack-all/unpack-all" {
    import { AbstractUnpack } from "lib/faction-lib/unpack/abstract-unpack/abstract-unpack";
    import { Faction } from "lib/faction-lib/faction/faction";
    export class UnpackAll extends AbstractUnpack {
        private readonly _unpacks;
        constructor(faction: Faction, playerSlot: number);
        unpack(): void;
        remove(): void;
    }
}
declare module "lib/draft-lib/draft-activity-finish/draft-activity-finish" {
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    export class DraftActivityFinish {
        private readonly _draftState;
        private readonly _find;
        constructor(draftState: DraftState);
        finishAll(): this;
        movePlayersToSeats(): this;
        moveSpeakerToken(): this;
        unpackFactions(): this;
        unpackMap(): this;
        setTurnOrder(): this;
    }
}
declare module "ui/panel/grid-ui-builder" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    /**
     * Requires all entries be the same size.
     */
    export class GridUIBuilder {
        private readonly _uis;
        private _maxRows;
        private _padding;
        private _spacing;
        addUIs(uis: Array<AbstractUI>): this;
        setMaxRows(maxRows: number): this;
        setPadding(padding: number): this;
        setSpacing(spacing: number): this;
        build(): AbstractUI;
    }
}
declare module "ui/draft/slice-ui/slice-ui" {
    import { Color } from "@tabletop-playground/api";
    import { HexType } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    export class SliceUI extends AbstractUI {
        private readonly _labelText;
        private readonly _defaultFontSize;
        constructor(slice: SliceTiles, sliceShape: ReadonlyArray<HexType>, sliceColor: Color, scale: number);
        setLabel(label: string): void;
    }
}
declare module "ui/turn-order-mini/turn-order-mini" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class TurnOrderMini extends AbstractUI {
        private readonly _entries;
        private readonly _onTurnOrderChanged;
        constructor(scale: number);
        destroy(): void;
    }
}
declare module "ui/wrapped-clickable-ui/abstract-wrapped-clickable-ui" {
    import { Border, ContentButton, Widget } from "@tabletop-playground/api";
    import { AbstractUI, UI_SIZE } from "ui/abstract-ui/abtract-ui";
    /**
     * ContentButton based UI with a Border.  Border color is set based on
     * the owning player slot.
     */
    export abstract class AbstractWrappedClickableUI extends AbstractUI {
        private _owningPlayerSlot;
        abstract getContentButton(): ContentButton;
        abstract getBorder(): Border;
        constructor(widget: Widget, size: UI_SIZE);
        getOwningPlayerSlot(): number;
        setOwningPlayerSlot(owningPlayerSlot: number | undefined): this;
    }
}
declare module "ui/wrapped-clickable-ui/wrapped-clickable-ui" {
    import { Border, ContentButton } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AbstractWrappedClickableUI } from "ui/wrapped-clickable-ui/abstract-wrapped-clickable-ui";
    export const WRAPPED_BORDER_WIDTH: number;
    /**
     * Wrap an AbstractUI inside a ContentButton.
     */
    export class WrappedClickableUI extends AbstractWrappedClickableUI {
        private readonly _innerUI;
        private readonly _contentButton;
        private readonly _border;
        constructor(ui: AbstractUI, scale: number);
        destroy(): void;
        getContentButton(): ContentButton;
        getBorder(): Border;
    }
}
declare module "ui/zoomable-ui/zoomable-ui" {
    import { ContentButton, Player } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export type CreateZoomedUiType = (scale: number) => AbstractUI;
    /**
     * Create a new UI containing the given UI and adding a zoom button.
     * Zooming calls the given function to create a new UI.
     *
     * Each player can only have one zoomed UI at a time, zomming a new UI will
     * close any existing one.
     */
    export class ZoomableUI extends AbstractUI {
        private readonly _unzoomedUi;
        private readonly _zoomButton;
        static _getOnZoomClosedHandler(): (button: ContentButton, player: Player) => void;
        static _getOnZoomOpenHandler<T>(createZoomedUI: CreateZoomedUiType, scale: number): (button: T, player: Player) => void;
        constructor(unzoomedUi: AbstractUI, scale: number, createZoomedUI: CreateZoomedUiType);
        destroy(): void;
    }
}
declare module "lib/draft-lib/resolve-conflicts/resolve-conflicts-keleres" {
    import { Faction } from "lib/faction-lib/faction/faction";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    /**
     * If Keleres AND at least one of their flavors are in the same draft, swap
     * Keleres to a different flavor if the current Keleres flavor's linked
     * faction is chosen by a different player.
     */
    export class ResolveConflictsKeleres {
        private readonly _draftState;
        /**
         * Get all Keleres flavors, not just any in the draft.
         *
         * @returns
         */
        static getAllKeleresFlavors(): ReadonlyArray<Faction>;
        /**
         * Get all linked-to-Keleres factions, not just any in the draft.
         *
         * @returns
         */
        static getAllLinkedFactions(): ReadonlyArray<Faction>;
        /**
         * Find Keleres in the draft's factions, -1 if missing.
         *
         * @param draftState
         * @returns
         */
        static getKeleresIndex(draftState: DraftState): number;
        /**
         * Given a Keleres flavor, get the linked non-Keleres faction.
         *
         * @param keleresFaction
         * @returns
         */
        static getLinkedFactionOrThrow(keleresFaction: Faction): Faction;
        static getAvailableFlavors(draftState: DraftState): ReadonlyArray<Faction>;
        constructor(draftState: DraftState);
        resolve(): void;
    }
}
declare module "ui/draft/faction-ui/keleres-ui" {
    import { Border, ContentButton, Player, Widget } from "@tabletop-playground/api";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { AbstractWrappedClickableUI } from "ui/wrapped-clickable-ui/abstract-wrapped-clickable-ui";
    type KeleresFlavor = "argent" | "mentak" | "xxcha";
    /**
     * Export for testing, not normally used externally.
     */
    export class KeleresFlavorButton {
        private readonly _draftState;
        private readonly _faction;
        private readonly _fg;
        private readonly _bg;
        private readonly _button;
        readonly _widget: Widget;
        /**
         * Switch the keleres faction to this flavor.
         *
         * @param _contentButton
         * @param _player
         */
        _onClicked: (button: ContentButton, player: Player) => void;
        static _getKeleresIndex(draftState: DraftState): number;
        constructor(draftState: DraftState, flavor: KeleresFlavor, w: number, h: number);
        /**
         * Update the button color to reflect if this is the active flavor.
         * This only updates the local widget attributes, never touches
         * the draft state (to avoid infinite update loops).
         */
        update(): void;
    }
    /**
     * Keleres has three flavors, based on Argent, Mentak, and Xxcha.
     *
     * Flavors are available so long as the corresponding actual faction
     * has not been selected.
     *
     * Use the "wrapped clickable ui" size because cannot have buttons
     * inside a content button.
     */
    export class KeleresUI extends AbstractWrappedClickableUI {
        private readonly _contentButton;
        private readonly _border;
        private readonly _draftState;
        private readonly _flavorButtons;
        private readonly _onDraftStateChanged;
        destroy(): void;
        getContentButton(): ContentButton;
        getBorder(): Border;
        constructor(draftState: DraftState, scale: number);
    }
}
declare module "ui/button-ui/confirm-button-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { ButtonUI } from "ui/button-ui/button-ui";
    /**
     * Wrap a FINISHED WITH SETUP button with a confirm button.
     */
    export class ConfirmButtonUI extends AbstractUI {
        constructor(buttonUi: ButtonUI);
    }
}
declare module "ui/draft/draft-state-ui/draft-state-ui" {
    import { Button, Color, ContentButton, Player } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { SliceShape, SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    import { CreateZoomedUiType } from "ui/zoomable-ui/zoomable-ui";
    export class DraftStateUI extends AbstractUI {
        private readonly _draftState;
        private readonly _onDraftStateChangedHandler;
        static _maybeAdvanceTurn: (player: Player) => void;
        static _createSliceClickHandler(draftState: DraftState, sliceIndex: number): (_button: ContentButton, player: Player) => void;
        static _createFactionClickHandler(draftState: DraftState, sliceIndex: number): (_button: ContentButton, player: Player) => void;
        static _createSeatClickHandler(draftState: DraftState, sliceIndex: number): (_button: ContentButton, player: Player) => void;
        static _createFinishClickHandler(draftState: DraftState): (button: Button, player: Player) => void;
        static _createCancelClickHandler(draftState: DraftState): (button: Button, player: Player) => void;
        static _getCreateZoomedSliceUi: (slice: SliceTiles, sliceShape: SliceShape, color: Color) => CreateZoomedUiType;
        static _getCreatedZoomedMapUi: (draftState: DraftState) => CreateZoomedUiType;
        static _getSliceColorOrThrow: (index: number) => Color;
        constructor(draftState: DraftState, scale: number);
        destroy(): void;
    }
}
declare module "lib/draft-lib/generate-factions/generate-factions" {
    import { Faction } from "lib/faction-lib/faction/faction";
    export class GenerateFactions {
        /**
         * Generate random factions, with some logic to deal with Keleres.
         *
         * @param count
         */
        generate(count: number): Array<Faction>;
        _resolve(count: number, factions: Array<Faction>): Array<Faction>;
        _resolveOrThrow(count: number, factions: Array<Faction>): Array<Faction>;
    }
}
declare module "lib/draft-lib/parse/parse-slices" {
    import { SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    export class ParseSlices {
        private readonly _sliceSize;
        constructor(sliceSize: number);
        parseSlices(config: string, errors: Array<string>): Array<SliceTiles> | undefined;
    }
}
declare module "lib/draft-lib/parse/parse-labels" {
    export class ParseLabels {
        parseLabels(config: string): Array<string> | undefined;
    }
}
declare module "lib/draft-lib/parse/parse-factions" {
    import { Faction } from "lib/faction-lib/faction/faction";
    export class ParseFactions {
        parseFactions(config: string, errors: Array<string>): Faction[] | undefined;
    }
}
declare module "lib/draft-lib/drafts/idraft" {
    import { NamespaceId } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { GenerateSlicesParams } from "lib/draft-lib/generate-slices/generate-slices";
    export interface IDraft {
        isEnabled(): boolean;
        getDraftName(): string;
        getGenerateSlicesParams(): GenerateSlicesParams;
        createEmptyDraftState(namespaceId: NamespaceId): DraftState;
    }
}
declare module "lib/draft-lib/draft-activity-start/draft-activity-start-params" {
    import { NamespaceId } from "ttpg-darrell";
    import { IDraft } from "lib/draft-lib/drafts/idraft";
    export const DRAFT_NAMESPACE_ID: NamespaceId;
    export type DraftActivityStartParams = {
        namespaceId: NamespaceId;
        draft: IDraft;
        numSlices: number;
        numFactions: number;
        config: string;
        onStart?: () => void;
    };
}
declare module "lib/draft-lib/parse/parse-base-map" {
    export class ParseBaseMap {
        parseBaseMap(config: string, errors: Array<string>): string | undefined;
    }
}
declare module "lib/draft-lib/draft-activity-start/draft-activity-start" {
    import { IGlobal } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { GenerateSlicesParams, SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class DraftActivityMaybeResume implements IGlobal {
        init(): void;
    }
    /**
     * Start (or resume) a draft activity.
     * Load draft information from a config string, or generate it.
     * Create UI.
     */
    export class DraftActivityStart {
        private _draftState;
        static getOrGenerateSlices(config: string, numSlices: number, generateSlicesParams: GenerateSlicesParams, blacklistSystemTileNumbers: Array<number>, errors: Array<string>): Array<SliceTiles>;
        static getSliceLabels(config: string): Array<string> | undefined;
        static getOrGenerateFactions(config: string, numFactions: number, errors: Array<string>): Array<Faction>;
        static getBaseMap(config: string, errors: Array<string>): string | undefined;
        getDraftState(): DraftState | undefined;
        start(params: DraftActivityStartParams, errors: Array<string>): boolean;
        resume(): this;
        _resume(): this;
        destroy(): void;
    }
}
declare module "ui/button-ui/checkbox-ui" {
    import { CheckBox } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class CheckBoxUI extends AbstractUI {
        private readonly _checkBox;
        constructor(scale: number);
        destroy(): void;
        getCheckBox(): CheckBox;
    }
}
declare module "ui/button-ui/editable-ui" {
    import { TextBox } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class EditableUI extends AbstractUI {
        private readonly _editText;
        constructor(scale: number);
        getEditText(): TextBox;
    }
}
declare module "ui/button-ui/long-label-ui" {
    import { Text } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class LongLabelUI extends AbstractUI {
        private readonly _text;
        constructor(scaledWidth: number, scale: number);
        getText(): Text;
    }
}
declare module "ui/button-ui/slider-with-value-ui" {
    import { Slider } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class SliderWithValueUI extends AbstractUI {
        private readonly _slider;
        constructor(scale: number);
        getSlider(): Slider;
    }
}
declare module "lib/draft-lib/drafts/milty" {
    import { NamespaceId } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { GenerateSlicesParams, SliceShape } from "lib/draft-lib/generate-slices/generate-slices";
    import { SystemTierType } from "lib/system-lib/system/system-tier";
    import { IDraft } from "lib/draft-lib/drafts/idraft";
    export const MILTY_SLICE_MAKEUP: ReadonlyArray<SystemTierType>;
    export const MILTY_SLICE_SHAPE: SliceShape;
    export const MILTY_SLICE_SHAPE_ALT: SliceShape;
    export class Milty implements IDraft {
        isEnabled(): boolean;
        getDraftName(): string;
        getGenerateSlicesParams(): GenerateSlicesParams;
        /**
         * Create the draft state with slice shapes.
         * Does not generate slices, factions, etc.
         *
         * @param namespaceId
         * @returns
         */
        createEmptyDraftState(namespaceId: NamespaceId): DraftState;
    }
}
declare module "lib/draft-lib/drafts/wekker" {
    import { NamespaceId } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { GenerateSlicesParams, SliceShape } from "lib/draft-lib/generate-slices/generate-slices";
    import { IDraft } from "lib/draft-lib/drafts/idraft";
    export const WEKKER_SLICE_SHAPE: SliceShape;
    export const WEKKER_SLICE_SHAPE_R: SliceShape;
    export const WEKKER_SLICE_SHAPE_L: SliceShape;
    export class Wekker implements IDraft {
        isEnabled(): boolean;
        getDraftName(): string;
        getGenerateSlicesParams(): GenerateSlicesParams;
        /**
         * Create the draft state with slice shapes.
         * Does not generate slices, factions, etc.
         *
         * @param namespaceId
         * @returns
         */
        createEmptyDraftState(namespaceId: NamespaceId): DraftState;
    }
}
declare module "lib/draft-lib/scpt/abstract-scpt/scpt-draft-params" {
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export type ScptDraftParams = {
        label: string;
        qual?: DraftActivityStartParams;
        prelim?: DraftActivityStartParams;
        semi?: DraftActivityStartParams;
        final?: DraftActivityStartParams;
    };
}
declare module "ui/draft/draft-start-ui/scpt-draft-button-ui" {
    import { Button, Player } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { TriggerableMulticastDelegate } from "ttpg-darrell";
    import { ScptDraftParams } from "lib/draft-lib/scpt/abstract-scpt/scpt-draft-params";
    /**
     * "YEAR" qual / prelim / semi / final.
     *
     * SCPT draft goes right to the draft.
     */
    export class ScptDraftButtonUI extends AbstractUI {
        private readonly _scptDraftParams;
        private readonly _onDraftStarted;
        _qualHandler: (_button: Button, _player: Player) => void;
        _prelimHandler: (_button: Button, _player: Player) => void;
        _semiHandler: (_button: Button, _player: Player) => void;
        _finalHandler: (_button: Button, _player: Player) => void;
        constructor(scale: number, scptDraftParams: ScptDraftParams, onDraftStarted: TriggerableMulticastDelegate<() => void>);
    }
}
declare module "lib/draft-lib/scpt/abstract-scpt/abstract-scpt" {
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    import { ScptDraftParams } from "lib/draft-lib/scpt/abstract-scpt/scpt-draft-params";
    export abstract class AbstractScpt {
        abstract getLabel(): string;
        abstract getQual(): DraftActivityStartParams | undefined;
        abstract getPrelim(): DraftActivityStartParams | undefined;
        abstract getSemi(): DraftActivityStartParams | undefined;
        abstract getFinal(): DraftActivityStartParams | undefined;
        getPlayerCount(): number;
        getScptDraftParams(): ScptDraftParams;
    }
}
declare module "lib/draft-lib/scpt/scpt-2024/scpt-2024" {
    import { AbstractScpt } from "lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class Scpt2024 extends AbstractScpt {
        getLabel(): string;
        getQual(): DraftActivityStartParams | undefined;
        getPrelim(): DraftActivityStartParams | undefined;
        getSemi(): DraftActivityStartParams | undefined;
        getFinal(): DraftActivityStartParams | undefined;
    }
}
declare module "lib/draft-lib/scpt/scpt-2023/scpt-2023" {
    import { AbstractScpt } from "lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class Scpt2023 extends AbstractScpt {
        getLabel(): string;
        getQual(): DraftActivityStartParams | undefined;
        getPrelim(): DraftActivityStartParams | undefined;
        getSemi(): DraftActivityStartParams | undefined;
        getFinal(): DraftActivityStartParams | undefined;
    }
}
declare module "lib/draft-lib/scpt/scpt-2022/scpt-2022" {
    import { AbstractScpt } from "lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class Scpt2022 extends AbstractScpt {
        getLabel(): string;
        getQual(): DraftActivityStartParams | undefined;
        getPrelim(): DraftActivityStartParams | undefined;
        getSemi(): DraftActivityStartParams | undefined;
        getFinal(): DraftActivityStartParams | undefined;
    }
}
declare module "lib/draft-lib/scpt/scpt-2021/scpt-2021" {
    import { AbstractScpt } from "lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class Scpt2021 extends AbstractScpt {
        getLabel(): string;
        getQual(): DraftActivityStartParams | undefined;
        getPrelim(): DraftActivityStartParams | undefined;
        getSemi(): DraftActivityStartParams | undefined;
        getFinal(): DraftActivityStartParams | undefined;
    }
}
declare module "lib/draft-lib/scpt/scpt-2025/scpt-2025" {
    import { AbstractScpt } from "lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class Scpt2025 extends AbstractScpt {
        getLabel(): string;
        getQual(): DraftActivityStartParams | undefined;
        getPrelim(): DraftActivityStartParams | undefined;
        getSemi(): DraftActivityStartParams | undefined;
        getFinal(): DraftActivityStartParams | undefined;
        /**
         * Place some systems and wormholes away from the main map.
         */
        _placeFinalsOuterSystemsAndWormholes(): void;
    }
}
declare module "ui/draft/draft-start-ui/scpt-drafts-ui" {
    import { TriggerableMulticastDelegate } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AbstractScpt } from "lib/draft-lib/scpt/abstract-scpt/abstract-scpt";
    export class ScptDraftsUi extends AbstractUI {
        static getScptDrafts(): Array<AbstractScpt>;
        constructor(scale: number, overrideHeight: number, onDraftStarted: TriggerableMulticastDelegate<() => void>);
    }
}
declare module "lib/draft-lib/drafts/nucleus" {
    import { HexType, NamespaceId } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { GenerateSlicesParams } from "lib/draft-lib/generate-slices/generate-slices";
    import { IDraft } from "lib/draft-lib/drafts/idraft";
    export const NUCLEUS_SLICE_SHAPE: ReadonlyArray<HexType>;
    export const NUCLEUS_SLICE_SHAPE_ALT: ReadonlyArray<HexType>;
    export const NUCLEUS_MAP_STRING: string;
    export class NucleusDraft implements IDraft {
        isEnabled(): boolean;
        getDraftName(): string;
        getGenerateSlicesParams(): GenerateSlicesParams;
        createEmptyDraftState(namespaceId: NamespaceId): DraftState;
        _getNucleusMapStringIndexes(): Array<number>;
        /**
         * Choose a handful of random wormhole location sets, use the
         * one with the largest "smallest distance between two wormholes".
         * Don't check too many, or results will be too similar.
         *
         * As a side effect, remove the chosen map string indexes from the
         * input array.
         */
        _getScattered(mapStringIndexes: Array<number>, want: number, iterations?: number): Array<number>;
        _getAvailableWormholes(): Array<number>;
        _getNonWormholeRedSystems(): Array<number>;
        _getNonWormholeBlueSystems(): Array<number>;
        _fillEntriesOrThrow(fillIndexes: Array<number>, fillWith: Array<number>, entries: Array<number>): void;
    }
}
declare module "lib/draft-lib/drafts/bag-draft" {
    import { Container } from "@tabletop-playground/api";
    import { NamespaceId, PlayerSlot } from "ttpg-darrell";
    import { DraftState } from "lib/draft-lib/draft-state/draft-state";
    import { GenerateSlicesParams, SliceTiles } from "lib/draft-lib/generate-slices/generate-slices";
    import { IDraft } from "lib/draft-lib/drafts/idraft";
    export class BagDraft implements IDraft {
        private readonly _find;
        private _containerNsid;
        isEnabled(): boolean;
        getDraftName(): string;
        getGenerateSlicesParams(): GenerateSlicesParams;
        /**
         * DOES NOT USE THIS FUNCTION, spawns containers with system tiles
         * in each player area.
         *
         * @param namespaceId
         */
        createEmptyDraftState(_namespaceId: NamespaceId): DraftState;
        _getSlices(): Array<SliceTiles>;
        _createContainer(playerSlot: PlayerSlot): Container;
        _fillContainer(container: Container, slice: SliceTiles): void;
        setContainerNsid(nsid: string): this;
        createDraftObjects(): void;
    }
}
declare module "ui/draft/draft-start-ui/draft-start-ui" {
    import { Button, CheckBox, MultilineTextBox, Player, Slider } from "@tabletop-playground/api";
    import { TriggerableMulticastDelegate } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    export class DraftStartUI extends AbstractUI {
        readonly onDraftStarted: TriggerableMulticastDelegate<() => void>;
        private readonly _idrafts;
        private readonly _params;
        private readonly _draftCheckBoxes;
        readonly _onDraftCheckStateChangedHandler: (checkBox: CheckBox, player: Player | undefined, _checked: boolean) => void;
        readonly _onSliceCountChanged: (_slider: Slider, _player: Player, value: number) => void;
        readonly _onFactionCountChanged: (_slider: Slider, _player: Player, value: number) => void;
        readonly _onTextCommitted: (_textBox: MultilineTextBox, _player: Player, text: string) => void;
        readonly _onStartButtonClicked: (button: Button, player: Player) => void;
        constructor(scale: number, params: DraftActivityStartParams);
        startDraft(): void;
    }
}
declare module "ui/draft/draft-start-ui/draft-start-window" {
    import { CreateAbstractUIType } from "ui/abstract-window/abstract-window";
    export class DraftStartWindow {
        private _window;
        readonly _onDraftStartedHandler: () => void;
        private readonly _draftActivityStartParams;
        readonly _createAbstractUI: CreateAbstractUIType;
        constructor();
        createAndAttachWindow(playerSlot: number): void;
    }
}
declare module "lib/map-string-lib/data/premade-map-type" {
    export type PremadeMapType = {
        playerCount: number;
        name: string;
        mapString: string;
        attributes?: string;
        sliceNames?: string;
        author?: string;
        comments?: string;
        difficulty?: string;
    };
}
declare module "lib/map-string-lib/data/premade-maps-2p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_2P: Array<PremadeMapType>;
}
declare module "lib/map-string-lib/data/premade-maps-3p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_3P: Array<PremadeMapType>;
}
declare module "lib/map-string-lib/data/premade-maps-4p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_4P: Array<PremadeMapType>;
}
declare module "lib/map-string-lib/data/premade-maps-5p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_5P: Array<PremadeMapType>;
}
declare module "lib/map-string-lib/data/premade-maps-6p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_6P: Array<PremadeMapType>;
}
declare module "lib/map-string-lib/data/premade-maps-7p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_7P: Array<PremadeMapType>;
}
declare module "lib/map-string-lib/data/premade-maps-8p.data" {
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    export const PREMADE_MAPS_8P: Array<PremadeMapType>;
}
declare module "ui/map-premade-ui/map-premade-ui" {
    import { Player, TextBox } from "@tabletop-playground/api";
    import { TriggerableMulticastDelegate } from "ttpg-darrell";
    import { PremadeMapType } from "lib/map-string-lib/data/premade-map-type";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class MapPremadeUI extends AbstractUI {
        readonly onMapString: TriggerableMulticastDelegate<(mapString: string) => void>;
        private _mapString;
        private readonly _premadeMapButtons;
        readonly _onFilterTextChanged: (_textBox: TextBox, _player: Player, text: string) => void;
        static _emptyMapString(playerCount: number): string;
        static getPremadeMaps(playerCount: number): Array<PremadeMapType>;
        constructor(scale: number);
    }
}
declare module "ui/map-tool-ui/map-tool-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { CreateAbstractUIType } from "ui/abstract-window/abstract-window";
    export class MapToolUI extends AbstractUI {
        private readonly _editText;
        private _premadeMapWindow;
        private readonly _onUsePremadeMap;
        private readonly _onUseSliceDraft;
        private readonly _onMapStringLoad;
        private readonly _onMapStringSave;
        private readonly _onPlacePlanetCards;
        private readonly _onPlaceFrontierTokens;
        private readonly _onRemovePlanetCards;
        private readonly _onRemoveFrontierTokens;
        private readonly _onPlaceHyperlanes;
        private readonly _onClearMap;
        constructor(scale: number);
        _createMapPremadeUI: CreateAbstractUIType;
    }
}
declare module "context-menu/toggle-map-tool/toggle-map-tool" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleMapTool implements IGlobal {
        init(): void;
    }
}
declare module "ui/stats-ui/stats-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    export class StatsUI extends AbstractUI {
        private readonly _statsEntries;
        private readonly _onGameData;
        constructor(scale: number);
        destroy(): void;
        update(gameData: GameData): void;
    }
}
declare module "context-menu/toggle-stats/toggle-stats" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleStats implements IGlobal {
        private _lastGameData;
        private readonly _onGameData;
        init(): void;
    }
}
declare module "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state" {
    import { GameObject } from "@tabletop-playground/api";
    import { NamespaceId, PlayerSlot, TriggerableMulticastDelegate } from "ttpg-darrell";
    export type StrategyCardNumberAndState = {
        number: number;
        state: string;
    };
    /**
     * Per-player set of active strategy cards, in order of play.
     */
    export class StrategyCardsState {
        readonly onStrategyCardsStateChanged: TriggerableMulticastDelegate<() => void>;
        private readonly onStrategyCardPlayedHandler;
        private readonly _persistenceKey;
        private readonly _playerSlotToActive;
        private readonly _strategyCardNumberToLastPlayerSlotPlayed;
        static strategyCardToNumber(strategyCard: GameObject): number | undefined;
        constructor(persistenceKey: NamespaceId);
        destroy(): void;
        _save(): void;
        _load(): void;
        _getMutableActive(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState>;
        active(playerSlot: PlayerSlot): Array<StrategyCardNumberAndState>;
        addOrUpdate(playerSlot: number, strategyCardNumber: number, state: string): this;
        remove(playerSlot: number, strategyCardNumber: number): this;
        setLastPlayerSlotPlayed(strategyCardNumber: number, playerSlot: PlayerSlot): this;
        getLastPlayerSlotPlayed(strategyCardNumber: number): PlayerSlot | undefined;
    }
}
declare module "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body" {
    import { PlayerSlot } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    /**
     * Manage the contents of a strategy card UI (betweent the title and the
     * play/pass buttons).
     *
     * Body can be empty.  Also provides optional additional report text.
     *
     * Use getState/setState to preserve any data needed to regenerate the body.
     */
    export abstract class AbstractStrategyCardBody {
        private readonly _strategyCardsState;
        private readonly _strategyCardNumber;
        private readonly _playerSlot;
        constructor(strategyCardsState: StrategyCardsState, strategyCardNumber: number, playerSlot: PlayerSlot);
        getState(): string | undefined;
        setState(state: string): void;
        isPlayingPlayer(): boolean;
        getPlayerSlot(): PlayerSlot;
        getStrategyCardNumber(): number;
        abstract getStrategyCardName(): string;
        abstract getBody(scale: number): AbstractUI | undefined;
        abstract getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/strategy-card-ui/zoomed-strategy-card-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { CreateZoomedUiType } from "ui/zoomable-ui/zoomable-ui";
    export class ZoomedStrategyCardUI extends AbstractUI {
        static generateCreateZoomedUi(strategyCardNumber: number): CreateZoomedUiType;
        constructor(scale: number, strategyCardNumber: number);
    }
}
declare module "ui/strategy-card-ui/strategy-card-ui/strategy-card-ui" {
    import { Button } from "@tabletop-playground/api";
    import { PlayerSlot } from "ttpg-darrell";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    /**
     * 2x wide, with an abstract body below the title.
     * [Play|Follow] [Pass]
     */
    export class StrategyCardUI extends AbstractUI {
        private readonly _strategyCardsState;
        private readonly _strategyCardBody;
        private readonly _playerSlot;
        private readonly _isPlay;
        private readonly _name;
        private readonly _ui;
        private readonly _buttonPlayingPlayerFinished;
        private readonly _buttonFollow;
        private readonly _buttonPass;
        private readonly _onPlayOrFollow;
        private readonly _onPass;
        constructor(scale: number, strategyCardsState: StrategyCardsState, strategyCardBody: AbstractStrategyCardBody, playerSlot: PlayerSlot);
        destroy(): void;
        getButtonPlayingPlayerFinished(): Button;
        getButtonFollow(): Button;
        getButtonPass(): Button;
    }
}
declare module "ui/strategy-card-ui/body-1-leadership/body-leadership" {
    import { Player, Slider } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyLeadership extends AbstractStrategyCardBody {
        private _tokenCount;
        readonly _onSliderChanged: (_slider: Slider, _player: Player, value: number) => void;
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-2-diplomacy/body-diplomacy" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyDiplomacy extends AbstractStrategyCardBody {
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(_scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-3-politics/body-politics" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyPolitics extends AbstractStrategyCardBody {
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(_scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-4-construction/body-construction" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyConstruction extends AbstractStrategyCardBody {
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(_scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-5-trade/body-trade" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyTrade extends AbstractStrategyCardBody {
        private readonly _checkedSlots;
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-6-warfare/body-warfare" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyWarfare extends AbstractStrategyCardBody {
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(_scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-7-technology/body-technology" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyTechnology extends AbstractStrategyCardBody {
        private readonly _onChooseTechButtonClicked;
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/body-8-imperial/body-imperial" {
    import { AbstractStrategyCardBody } from "ui/strategy-card-ui/abstract-strategy-card-body/abstract-strategy-card-body";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    export class BodyImperial extends AbstractStrategyCardBody {
        constructor(strategyCardsState: StrategyCardsState, playerSlot: number);
        getStrategyCardName(): string;
        getBody(_scale: number): AbstractUI | undefined;
        getReport(): string | undefined;
    }
}
declare module "ui/strategy-card-ui/strategy-cards-ui/strategy-cards-ui" {
    import { PlayerSlot } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    /**
     * UI with all active strategy cards.
     */
    export class StrategyCardsUI extends AbstractUI {
        private readonly _ui;
        constructor(scale: number, strategyCardsState: StrategyCardsState, playerSlot: PlayerSlot);
        destroy(): void;
    }
}
declare module "context-menu/toggle-strat-cards/toggle-strat-cards" {
    import { IGlobal, PlayerSlot, Window } from "ttpg-darrell";
    import { StrategyCardsState } from "lib/strategy-card-lib/strategy-cards-state/strategy-cards-state";
    /**
     *  Manage window with active strategy cards.
     */
    export class ToggleStratCards implements IGlobal {
        static readonly TOGGLE_ACTION_NAME: string;
        private readonly _strategyCardsState;
        private readonly _playerSlotToWindowData;
        /**
         * Cannot use the normal "toggle window" handler because there's a
         * different window for each player.
         */
        private readonly _onCustomActionHandler;
        private readonly _onStrategyCardsStateChangedHandler;
        _closeWindow(playerSlot: number): void;
        _openWindow(playerSlot: number): void;
        _updateWindow(playerSlot: number): void;
        constructor();
        init(): void;
        getStrategyCardsState(): StrategyCardsState;
        _createWindow(playerSlot: PlayerSlot): Window;
    }
}
declare module "ui/streamer-tool-ui/streamer-tool-ui" {
    import { Player, TextBox } from "@tabletop-playground/api";
    import { PlayerSlot } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class StreamerToolUI extends AbstractUI {
        private readonly _ui;
        readonly _editableTimestampCommitted: (textBox: TextBox, _player: Player, _text: string, _usingEnter: boolean) => void;
        constructor(scale: number, playerSlot: PlayerSlot);
        destroy(): void;
    }
}
declare module "context-menu/toggle-streamer-tool/toggle-streamer-tool" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleStreamerTool implements IGlobal {
        init(): void;
    }
}
declare module "lib/tech-lib/player-tech-summary/player-tech-summary" {
    import { Tech } from "lib/tech-lib/tech/tech";
    import { TechColorType } from "lib/tech-lib/schema/tech-schema";
    export class PlayerTechSummary {
        private readonly _cardUtil;
        private readonly _find;
        private readonly _ownedTechNsids;
        private readonly _techColorToOwnedCount;
        static _getOwnedTechs(playerSlot: number): Array<Tech>;
        constructor(playerSlot: number);
        isOwned(techNsid: string): boolean;
        getOwnedCount(color: TechColorType): number;
    }
}
declare module "lib/tech-lib/player-with-faction-techs/player-with-faction-techs" {
    import { Faction } from "lib/faction-lib/faction/faction";
    import { Tech } from "lib/tech-lib/tech/tech";
    /**
     * Get all available techs for a player, including faction tech.
     * Faction unit upgrades remove the base version unit upgrades.
     */
    export class PlayerWithFactionTechs {
        private readonly _faction;
        constructor(faction: Faction | undefined);
        get(): Array<Tech>;
        /**
         * Get all techs, including ALL faction tech.
         */
        _getAllTechs(): Array<Tech>;
        /**
         * Apply remove rules (e.g. codex replacement).
         */
        _applyRemoveRules(techs: Array<Tech>): Array<Tech>;
        /**
         * Remove other factions' faction tech.
         *
         * @param techs
         * @returns
         */
        _pruneOtherFactionTechs(techs: Array<Tech>): Array<Tech>;
        _pruneOverridenUnitUpgrades(techs: Array<Tech>): Array<Tech>;
    }
}
declare module "ui/choose-technology-ui/single-tech-ui" {
    import { Button } from "@tabletop-playground/api";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { PlayerTechSummary } from "lib/tech-lib/player-tech-summary/player-tech-summary";
    import { Tech } from "lib/tech-lib/tech/tech";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class SingleTechUI extends AbstractUI {
        private readonly _button;
        constructor(scale: number, tech: Tech, faction: Faction | undefined, playerTechSummary: PlayerTechSummary);
        getButton(): Button;
    }
}
declare module "ui/zoomable-ui/zoomable-ui-fully-clickable" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { CreateZoomedUiType } from "ui/zoomable-ui/zoomable-ui";
    /**
     * Make the unzoomed UI clickable, show the zoomed version when clicked.
     */
    export class ZoomableUiFullyClickable extends AbstractUI {
        private readonly _unzoomedUi;
        constructor(unzoomedUi: AbstractUI, scale: number, createZoomedUI: CreateZoomedUiType);
        destroy(): void;
    }
}
declare module "ui/choose-technology-ui/tech-card-mutable-ui" {
    import { Card, ImageWidget } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { CreateZoomedUiType } from "ui/zoomable-ui/zoomable-ui";
    import { ZoomableUiFullyClickable } from "ui/zoomable-ui/zoomable-ui-fully-clickable";
    export class UnzoomedTechCardMutableUI extends AbstractUI {
        constructor(scale: number, imageWidget: ImageWidget);
    }
    export class ZoomedTechCardUI extends AbstractUI {
        private readonly _imageWidget;
        constructor(scale: number, cardJson: string | undefined);
    }
    export class TechCardMutableUI extends ZoomableUiFullyClickable {
        private readonly _cardUitl;
        private readonly _imageWidget;
        private _cardJson;
        readonly _createZoomedUI: CreateZoomedUiType;
        constructor(scale: number);
        clearCard(): void;
        setCard(card: Card): void;
        /**
         * Spawn a new tech deck to get the card, use then destroy both.
         *
         * @param nsid
         * @returns
         */
        setCardNsid(techNsid: string): void;
    }
}
declare module "ui/choose-technology-ui/choose-technology-ui" {
    import { Button, Player } from "@tabletop-playground/api";
    import { PlayerSlot } from "ttpg-darrell";
    import { Faction } from "lib/faction-lib/faction/faction";
    import { PlayerTechSummary } from "lib/tech-lib/player-tech-summary/player-tech-summary";
    import { TechColorType } from "lib/tech-lib/schema/tech-schema";
    import { Tech } from "lib/tech-lib/tech/tech";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class ChooseTechnologyUI extends AbstractUI {
        private readonly _ui;
        private readonly _currentChoiceUi;
        private _currentTechSelection;
        _setCurrentTechSelection(tech: Tech | undefined): void;
        readonly _onFetchTechClickHandler: (button: Button, player: Player) => void;
        static _getTechColumn(scale: number, techColor: TechColorType, faction: Faction | undefined, playerTechSummary: PlayerTechSummary, onTechSelected: (tech: Tech) => void): AbstractUI;
        constructor(scale: number, playerSlot: PlayerSlot);
        destroy(): void;
    }
}
declare module "context-menu/toggle-tech-chooser/toggle-tech-chooser" {
    import { IGlobal } from "ttpg-darrell";
    export class ToggleTechChooser implements IGlobal {
        private _techChooserWindow;
        private readonly _onTechChooserRequestHandler;
        init(): void;
    }
}
declare module "context-menu/unpack-faction/unpack-faction" {
    import { Card, GameObject } from "@tabletop-playground/api";
    import { IGlobal, PlayerSlot } from "ttpg-darrell";
    import { Faction } from "lib/faction-lib/faction/faction";
    export const ACTION_UNPACK: string;
    export const ACTION_REMOVE: string;
    /**
     * Right click a faction reference card, "unpack" option.
     */
    export class UnpackFactionContextMenuItem implements IGlobal {
        private readonly _onCustomActionHandler;
        init(): void;
        _maybeAddContextMenuItem(card: Card): void;
        _getFaction(obj: GameObject): Faction;
        _getClosest(obj: GameObject): PlayerSlot;
        _unpackFaction(obj: GameObject): void;
        _removeFaction(obj: GameObject): void;
    }
}
declare module "lib/agenda-lib/agenda-turn-order/agenda-turn-order" {
    import { GameObject } from "@tabletop-playground/api";
    import { PlayerSlot } from "ttpg-darrell";
    export class AgendaTurnOrder {
        private readonly _find;
        _getSpeakerTokenOrThrow(): GameObject;
        _getSpeakerTokenSeatIndexOrThrow(): number;
        _getVotingDirection(): 1 | -1;
        _getZealPlayerSlots(): Array<PlayerSlot>;
        /**
         * "When" and "after" resolve order.
         *
         * [2.9] Players take turns resolving action cards starting with the
         * speaker and proceeding clockwise.
         *
         * @returns {Array.{PlayerDesk}}
         */
        getWhensOrAftersOrder(): Array<PlayerSlot>;
        /**
         * [8.2] Each player, starting with the player to the left of the
         * speaker and continuing clockwise, can cast votes for an outcome
         * of the current agenda.
         */
        getVotingOrder(): Array<PlayerSlot>;
    }
}
declare module "lib/agenda-lib/agenda-available-votes/agenda-available-votes" {
    import { Card } from "@tabletop-playground/api";
    import { PlayerSlot } from "ttpg-darrell";
    export class AgendaAvailableVotes {
        private readonly _cardUtil;
        private readonly _find;
        _getPlayerSlotToPerPlanetBonus(): Map<PlayerSlot, number>;
        _isRepresentativeGovernment(): boolean;
        _getXxekirGromOmegaPlayerSlots(): Set<PlayerSlot>;
        _getFaceUpPlanetCards(): Array<Card>;
        getPlayerSlotToAvailableVotes(): Map<PlayerSlot, number>;
    }
}
declare module "ui/agenda-ui/agenda-available-votes-ui/agenda-available-votes-ui" {
    import { LongRichTextUI } from "ui/button-ui/long-richtext-ui";
    /**
     * Show available votes, with externally-pokable reset.
     *
     * Feature request for editable available votes, but that
     * requires persistence.  Perhaps add +/- vote tokens homebrewers can add.
     * Or a vote +- counter?  Tokens you can flip to ignore might be cleanest.
     */
    export class AgendaAvailableVotesUI extends LongRichTextUI {
        static getAvailableVotesRichText(fontSize: number): string;
        constructor(scaledWidth: number, scale: number);
        update(): this;
    }
}
declare module "ui/zoomable-ui/create-zoomed-card-ui" {
    import { Card } from "@tabletop-playground/api";
    import { CreateZoomedUiType } from "ui/zoomable-ui/zoomable-ui";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class ZoomedCardUI extends AbstractUI {
        constructor(card: Card, scale: number);
    }
    /**
     * UI generator for a card.
     */
    export class CreateZoomedCardUI {
        private readonly _card;
        constructor(card: Card);
        get(): CreateZoomedUiType;
    }
}
declare module "ui/agenda-ui/agenda-card-ui/agenda-card-ui" {
    import { Card } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { ZoomableUiFullyClickable } from "ui/zoomable-ui/zoomable-ui-fully-clickable";
    export class UnzoomedCardUI extends AbstractUI {
        constructor(agendaCard: Card, scale: number);
    }
    export class AgendaCardUI extends ZoomableUiFullyClickable {
        static _getCreateZoomedUI(agendaCard: Card, scale: number): () => AbstractUI;
        constructor(agendaCard: Card, scale: number);
    }
    export class AgendaCardFaceDownUI extends AbstractUI {
        constructor(scale: number);
    }
}
declare module "ui/agenda-ui/agenda-how-to-ui/agenda-how-to-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class AgendaHowToUI extends AbstractUI {
        constructor(scale: number);
    }
}
declare module "ui/button-ui/editable-button-ui" {
    import { Button, ImageButton, Player, TextBox, WidgetSwitcher } from "@tabletop-playground/api";
    import { TriggerableMulticastDelegate } from "ttpg-darrell";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class EditableButtonUI extends AbstractUI {
        onEdited: TriggerableMulticastDelegate<(text: string) => void>;
        readonly _onEditClicked: (_button: ImageButton, _player: Player) => void;
        readonly _onEditTextCommitted: () => void;
        private readonly _button;
        private readonly _editText;
        private readonly _widgetSwitcher;
        constructor(scale: number);
        destroy(): void;
        getButton(): Button;
        /**
         * Expost the TextBox in order to restrict value types (e.g. numbers only).
         * @returns
         */
        getTextBox(): TextBox;
        getWidgetSwitcher(): WidgetSwitcher;
    }
}
declare module "ui/agenda-ui/agenda-outcome-ui/agenda-rider-ui" {
    import { Widget } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AgendaRiderSchemaType, AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    export class AgendaRiderUI extends AbstractUI {
        static _createRiderButton(rider: AgendaRiderSchemaType, scale: number): Widget | undefined;
        constructor(agendaState: AgendaState, outcomeIndex: number, scale: number);
    }
}
declare module "ui/agenda-ui/agenda-outcome-ui/agenda-outcome-ui" {
    import { Button, Player } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    /**
     * UI:
     * - Outcome name (Text and EditText in a WidgetSwitcher).
     * - Total votes (Text).
     * - Per-player votes (Text).
     * - Riders (Button, show zoomed rider on click).
     */
    export class AgendaOutcomeUI extends AbstractUI {
        private readonly _agendaState;
        private readonly _outcomeIndex;
        readonly _onOutcomeClicked: (button: Button, player: Player) => void;
        readonly _onEdited: (text: string) => void;
        constructor(agendaState: AgendaState, outcomeIndex: number, scale: number);
    }
}
declare module "ui/agenda-ui/agenda-vote-count-ui/agenda-vote-count-ui" {
    import { Button } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    /**
     * ONE player's vote entry.
     *
     * #editable [lock]
     */
    export class AgendaVoteCountUI extends AbstractUI {
        private readonly _agendaState;
        private readonly _seatIndex;
        private readonly _votesTextBox;
        private readonly _lockButton;
        private _delayedApplyVotesHandle;
        readonly _onLockClicked: (button: Button, player: import("@tabletop-playground/api").Player) => void;
        readonly _applyVoteCountToAgendaState: () => void;
        readonly _onVotesChanged: () => void;
        readonly _incr: (button: Button, player: import("@tabletop-playground/api").Player) => void;
        readonly _decr: (button: Button, player: import("@tabletop-playground/api").Player) => void;
        constructor(agendaState: AgendaState, seatIndex: number, scale: number);
        destroy(): void;
    }
}
declare module "ui/switcher-ui/switcher-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class SwitcherUI extends AbstractUI {
        private readonly _switcher;
        constructor(uis: Array<AbstractUI>);
        switchToIndex(index: number): void;
    }
}
declare module "lib/agenda-lib/agenda-outcomes/agenda-outcomes" {
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    export const AGENDA_OUTCOME_TYPE_TO_LABEL: Record<string, string>;
    export class AgendaOutcomes {
        /**
         * Do the populate as a transaction (rider processing gets batched).
         *
         * @param agendaState
         * @param outcomeType
         * @returns
         */
        populate(agendaState: AgendaState, outcomeType: string): boolean;
        _populate(agendaState: AgendaState, outcomeType: string): boolean;
        populateOrThrow(agendaState: AgendaState, outcomeType: string): void;
    }
}
declare module "ui/agenda-ui/agenda-choose-type-ui/agenda-choose-type-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    export class AgendaChooseTypeUI extends AbstractUI {
        constructor(agendaState: AgendaState, scale: number);
    }
}
declare module "ui/agenda-ui/agenda-state-ui/agenda-state-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    /**
     * [waiting for: ...]
     * [Available votes:] [Available votes]x3 [reset votes]
     * [1. My whens:] [play when] [no whens for now] [never whens] [reset whens]
     * [2. My afters:] [play after] [no afters for now] [never afters] [reset afters]
     * [Voting: choose outcome and set your votes for it below]
     * [...Outcome] [vote summary]+[]
     * [3. My votes:] [# + -] [lock votes] [reset votes]
     */
    export class AgendaStateUI extends AbstractUI {
        private readonly _agendaState;
        private readonly _switcherUiOutcomeTypeThenMain;
        static _createAgendaCardUI(agendaState: AgendaState, scale: number): AbstractUI;
        static _createWaitingForRow(agendaState: AgendaState, scale: number): AbstractUI;
        static _createAvailableVotesRow(scale: number): AbstractUI;
        static _createWhensRow(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
        static _createAftersRow(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
        /**
         * Votes: [not voting|#] [lock votes]
         *
         * @param agendaState
         * @param seatIndex
         * @param scale
         * @returns
         */
        static _createHowToVoteRow(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
        static _createOutcomeUIs(agendaState: AgendaState, scale: number): AbstractUI;
        static _createTopLeftUI(agendaState: AgendaState, seatIndex: number, scale: number): AbstractUI;
        static _createTopRightUI(agendaState: AgendaState, scale: number): AbstractUI;
        static _createBottomUI(agendaState: AgendaState, scale: number): AbstractUI;
        constructor(agendaState: AgendaState, seatIndex: number, scale: number);
        destroy(): void;
    }
}
declare module "lib/agenda-lib/agenda-activity-start/agenda-activity-start" {
    import { Card } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class AgendaActivityMaybeResume implements IGlobal {
        init(): void;
    }
    export class AgendaActivityStart {
        private _agendaState;
        private _agendaWindow;
        private readonly _onAgendaStateChangedHandler;
        start(agendaCard: Card): boolean;
        resume(): this;
        destroy(): void;
    }
}
declare module "event/on-agenda-card/on-agenda-card" {
    import { IGlobal } from "ttpg-darrell";
    export class OnAgendaCard implements IGlobal {
        init(): void;
    }
}
declare module "lib/agenda-lib/agenda-state/advance-no-whens-afters" {
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    /**
     * Advance turn and/or phase when the current player has no whens or afters
     * during the appropriate phase.
     */
    export class AdvanceNoWhensAfters {
        private readonly _agendaState;
        private readonly _onAgendaStateChangedHandler;
        constructor(agendaState: AgendaState);
        _isLastPlayerInTurnOrder(): boolean;
        _isWhenPlayed(): boolean;
        _isAfterPlayed(): boolean;
        _isSkipTurnWhen(): boolean;
        _isSkipTurnAfter(): boolean;
        _resetWhens(): void;
        _resetAfters(): void;
        _maybeAdvancePhaseWhens(): boolean;
        _maybeAdvancePhaseAfters(): boolean;
        _maybeSkipTurnWhens(): boolean;
        _maybeSkipTurnAfters(): boolean;
        maybeAdvance(): boolean;
    }
}
declare module "event/on-agenda-state-created/on-agenda-state-created" {
    import { IGlobal } from "ttpg-darrell";
    export class OnAgendaStateCreated implements IGlobal {
        init(): void;
    }
}
declare module "event/on-whisper/on-whisper" {
    import { Player, Sound } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class OnWhisper implements IGlobal {
        static readonly __sound: Sound;
        static chirpAtPlayer(player: Player): void;
        private readonly _onWhisper;
        init(): void;
    }
}
declare module "event/on-chat-message/on-chat-message" {
    import { IGlobal } from "ttpg-darrell";
    /**
     * If a public chat message contains "@<player-name-prefix>",
     * chirp at that player.
     */
    export class OnChatMessage implements IGlobal {
        private readonly _onChatMessage;
        init(): void;
    }
}
declare module "event/on-combat-clicked/on-combat-clicked" {
    import { IGlobal } from "ttpg-darrell";
    /**
     * Listen for combat UI clicks, turn into combat rolls.
     */
    export class OnCombatClicked implements IGlobal {
        private readonly _onCombatClickedHandler;
        init(): void;
        destroy(): void;
    }
}
declare module "lib/combat-lib/combat-roll-summary/combat-roll-summary" {
    import { DiceParams, DiceResult } from "ttpg-darrell";
    import { CombatRoll } from "lib/combat-lib/combat-roll/combat-roll";
    import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    export type UnitRollsSummary = {
        diceParams: DiceParams;
        hits: number;
        diceWithHitsCritsAndRerolls: Array<string>;
    };
    /**
     * Generate a text summary of a combat roll,
     * including a method to broadcast that summary.
     */
    export class CombatRollSummary {
        private readonly _combatRoll;
        private readonly _diceResults;
        /**
         * Convert a pile of dice into per-unit summaries.
         *
         * @param diceResults
         * @returns
         */
        static getUnitRollsSummaries(diceResults: Array<DiceResult>): Map<UnitType, UnitRollsSummary>;
        /**
         * Convert per-unit summaries into an overall summary.
         *
         * @param combatRoll
         * @param unitRollsSummaries
         * @returns
         */
        static getSimpleSummary(combatRoll: CombatRoll, unitRollsSummaries: Map<UnitType, UnitRollsSummary>): string;
        /**
         * Summarize only this combat roll result, not reusable for other rolls.
         *
         * @param combatRoll
         * @param diceResults
         */
        constructor(combatRoll: CombatRoll, diceResults: Array<DiceResult>);
        /**
         * Broadcast summary to all players, colored by the rolling player's slot.
         */
        broadcastAll(): void;
    }
}
declare module "event/on-combat-result/on-combat-result" {
    import { IGlobal } from "ttpg-darrell";
    /**
     * Report combat roll results.
     */
    export class OnCombatResult implements IGlobal {
        private readonly _onCombatResultHandler;
        init(): void;
        destroy(): void;
    }
}
declare module "event/on-game-end/on-game-end" {
    import { IGlobal } from "ttpg-darrell";
    /**
     * Trigger the game end event when a player reaches the required score.
     * Only send it once.
     */
    export class OnGameEnd implements IGlobal {
        private readonly _onGameData;
        init(): void;
    }
}
declare module "event/on-object-fell-through-table/on-object-fell-through-table" {
    import { GameObject, Vector, Zone } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class OnObjectFellThroughTable implements IGlobal {
        private _relocateTo;
        readonly _onBeginOverlapHandler: (_zone: Zone, object: GameObject) => void;
        static _getTablePositionAndExtent(): {
            tablePosition: Vector;
            tableExtent: Vector;
        };
        static _findOrCreateZone(): Zone;
        /**
         * Destroy the zone (will be recreated on next load).
         * This can be useful for testing, or before doing bulk setup that may create
         * things at the origin (below the table).
         */
        static destroyZone(): void;
        init(): void;
        setRelocateTo(position: Vector): this;
    }
}
declare module "ui/change-color-ui/color-choice-button" {
    import { ContentButton } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class ColorChoiceButton extends AbstractUI {
        private readonly _contentButton;
        constructor(colorHex: string, scale: number);
        getContentButton(): ContentButton;
    }
}
declare module "ui/change-color-ui/change-color-ui" {
    import { Button, ContentButton, Player } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class ChangeColorUI extends AbstractUI {
        private readonly _cancelButton;
        static _getAllColorNames(): Array<string>;
        static _getClickHandler(targetPlayerSlot: number, colorName: string, colorHex: string): (button: ContentButton, player: Player) => void;
        static _getColorRow(colorName: string, targetPlayerSlot: number, scale: number): AbstractUI;
        constructor(targetPlayerSlot: number, scale: number);
        getCancelButton(): Button;
    }
}
declare module "event/on-player-change-color-request/on-player-change-color-request" {
    import { Button, Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export class OnPlayerChangeColorRequest implements IGlobal {
        private _colorChangeWindow;
        readonly _onCancelClickedHandler: (_button: Button, _player: Player) => void;
        private readonly _onPlayerChangeColorRequestHandler;
        private readonly _onPlayerChangedColorHandler;
        _closeWindow(): void;
        init(): void;
        destroy(): void;
    }
}
declare module "lib/player-lib/change-color/change-color" {
    import { GameObject } from "@tabletop-playground/api";
    /**
     * Change player color.
     *
     * - Recolor status pad.
     * - Recolor command, leader sheets.
     * - Recolor units.
     * - Recolor unit containers.
     * - Recolor command, control tokens.
     * - Recolor faction-extras, command, control containers.
     * - Replace generic-color promissories.
     * - Recolor player area border lines.
     *
     * - Send on color changed event (unit containers).
     *
     * - Card holder hand / secret should automatically pick up slot color change.
     */
    export class ChangeColor {
        private readonly _playerSlot;
        private readonly _cardUtil;
        private readonly _find;
        private readonly _recolorNsids;
        private readonly _recolorNsidPrefixes;
        constructor(playerSlot: number);
        _shouldChangeColor(obj: GameObject): boolean;
        changeColor(newColorName: string, newColorHex: string): void;
        _recolorPlayerAreaBorderLines(): void;
        _replaceGenericPromissories(oldColorName: string, newColorName: string): void;
    }
}
declare module "event/on-player-changed-color/on-player-changed-color" {
    import { Player } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    /**
     * Apply the player changed color event.
     */
    export class OnPlayerChangedColor implements IGlobal {
        readonly _onPlayerChangedColorHandler: (playerSlot: number, colorName: string, colorHex: string, clickingPlayer: Player) => void;
        init(): void;
    }
}
declare module "event/on-slice-draft-request/on-slice-draft-request" {
    import { IGlobal } from "ttpg-darrell";
    export class OnSliceDraftRequest implements IGlobal {
        init(): void;
    }
}
declare module "event/on-strategy-card-played/on-strategy-card-played" {
    import { GameObject } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    /**
     * Adds a custom action to strategy cards, and triggers an event when played.
     */
    export class OnStrategyCardPlayed implements IGlobal {
        static readonly ACTION_NAME: string;
        private readonly _onCustomAction;
        init(): void;
        _maybeAdd(obj: GameObject): void;
    }
}
declare module "event/on-turn-state-changed/on-turn-state-changed" {
    import { IGlobal } from "ttpg-darrell";
    /**
     * Clear passed state when all players have passed.
     */
    export class OnTurnStateChanged implements IGlobal {
        private readonly _onTurnStateChanged;
        init(): void;
        destroy(): void;
    }
}
declare module "global/global-events" {
    import { Card, GameObject, Player } from "@tabletop-playground/api";
    import { DiceResult, TriggerableMulticastDelegate } from "ttpg-darrell";
    import { AgendaState } from "lib/agenda-lib/agenda-state/agenda-state";
    import { CombatRollType, CombatRoll } from "lib/combat-lib/combat-roll/combat-roll";
    import { DraftActivityStartParams } from "lib/draft-lib/draft-activity-start/draft-activity-start-params";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { System } from "lib/system-lib/system/system";
    /**
     * TI4 events.
     *
     * There are a few related events such as TurnOrder.onTurnOrderChanged, etc.
     */
    export class GlobalEvents {
        /**
         * Called when an agenda card is snapped to the agenda snap point.
         */
        readonly onAgendaCard: TriggerableMulticastDelegate<(agendaCard: Card, player: Player) => void>;
        /**
         * Called when an agenda card is removed from the agenda snap point.
         */
        readonly onAgendaCardRemoved: TriggerableMulticastDelegate<() => void>;
        /**
         * Called when agenda state is created.  Listeners can attach to
         * the AgendaState.onAgendaStateChanged event.
         *
         * @param agendaState state that was created.
         */
        readonly onAgendaStateCreated: TriggerableMulticastDelegate<(agendaState: AgendaState) => void>;
        readonly onAllPlayersPassed: TriggerableMulticastDelegate<() => void>;
        /**
         * Called when a player clicks a combat-initiating button.
         *
         * @param rollType The type of combat roll, e.g. "space-combat".
         * @param planetName Combat on this planet, or undefined if in space.
         * @param player The player who initiated the combat.
         */
        readonly onCombatClicked: TriggerableMulticastDelegate<(rollType: CombatRollType, planetName: string | undefined, player: Player) => void>;
        /**
         * Called when a combat roll is finished.
         *
         * @param combatRoll The combat roll that was rolled (includes player, roll type, etc).
         * @param diceResults The results of the dice roll.
         */
        readonly onCombatResult: TriggerableMulticastDelegate<(combatRoll: CombatRoll, diceResults: Array<DiceResult>) => void>;
        /**
         * Triggered when a player scores the final pooint.
         */
        readonly onGameEnd: TriggerableMulticastDelegate<() => void>;
        /**
         * Called after a player has changed their faction.
         *
         * @param playerSlot The player slot of the player seat that changed.
         */
        readonly onFactionChanged: TriggerableMulticastDelegate<(playerSlot: number) => void>;
        /**
         * Called after all game data updators finished this cycle.
         */
        readonly onGameData: TriggerableMulticastDelegate<(gameData: GameData) => void>;
        /**
         * Called when an object fall below the table.
         */
        readonly onObjectFellThroughTable: TriggerableMulticastDelegate<(object: GameObject) => void>;
        /**
         * Called when a player clicks a player color change button.
         */
        readonly onPlayerChangeColorRequest: TriggerableMulticastDelegate<(playerSlot: number, clickingPlayer: Player) => void>;
        /**
         * Called when a player changes color.  Clicking player might not
         * be the player who changed color.
         */
        readonly onPlayerChangedColor: TriggerableMulticastDelegate<(playerSlot: number, colorName: string, colorHex: string, clickingPlayer: Player) => void>;
        /**
         * Called when a player asks to start a slice draft.
         */
        readonly onSliceDraftRequest: TriggerableMulticastDelegate<(draftActivityStartParams: DraftActivityStartParams) => void>;
        /**
         * Called after start game request finishes, game is ready to start.
         * Used for any extra at-start setup.
         */
        readonly onStartGameComplete: TriggerableMulticastDelegate<() => void>;
        /**
         * Called when a player asks to start a game.
         */
        readonly onStartGameRequest: TriggerableMulticastDelegate<() => void>;
        /**
         * Called when a player plays a strategy card.
         */
        readonly onStrategyCardPlayed: TriggerableMulticastDelegate<(strategyCard: GameObject, player: Player) => void>;
        /**
         * Called when a player activates a system.  Other mechanisms may also
         * activate a system by triggering this event.
         *
         * @param system The system that was activated.
         * @param player The player who activated the system.
         */
        readonly onSystemActivated: TriggerableMulticastDelegate<(system: System, player: Player) => void>;
        /**
         * Called after a system (or planet therein) change (attachment add/remove).
         *
         * @param system The system that was changed.
         */
        readonly onSystemChanged: TriggerableMulticastDelegate<(system: System) => void>;
        /**
         * Show tech chooser to the given player.
         */
        readonly onTechChooserRequest: TriggerableMulticastDelegate<(playerSlot: number) => void>;
    }
}
declare module "lib/border-lib/space-planet-ownership/space-planet-ownership" {
    import { GameObject } from "@tabletop-playground/api";
    import { HexType, PlayerSlot } from "ttpg-darrell";
    import { Planet } from "lib/system-lib/planet/planet";
    import { System } from "lib/system-lib/system/system";
    import { UnitPlastic } from "lib/unit-lib/unit-plastic/unit-plastic";
    /**
     * Represent a GameObject that exerts control over a planet or space area.
     */
    export type ControlObjType = {
        obj: GameObject;
        owningPlayerSlot: PlayerSlot;
        hex: HexType;
        system: System;
        planet: Planet | undefined;
    };
    /**
     * Summarizes system control: who owns the space, and who owns each planet.
     * -1 = no control, -2 = multiple players (player slot for normal control).
     */
    export type ControlSystemType = {
        hex: HexType;
        system: System;
        spaceOwningPlayerSlot: PlayerSlot;
        planetNameToOwningPlayerSlot: Map<string, PlayerSlot>;
    };
    /**
     * Calculate per-hex control of space and planets.
     * Should be recreated for each use in case hex-to-system changed.
     */
    export class SpacePlanetOwnership {
        private readonly _hexToSystem;
        constructor();
        _createControlTypeFromUnitPlastic(unitPlastic: UnitPlastic): ControlObjType | undefined;
        _createControlTypeFromControlToken(controlToken: GameObject): ControlObjType | undefined;
        _getAllControlEntries(): Array<ControlObjType>;
        getHexToControlSystemEntry(): Map<HexType, ControlSystemType>;
    }
}
declare module "lib/border-lib/space-borders/space-borders" {
    import { DrawingLine } from "@tabletop-playground/api";
    import { HexType, PlayerSlot, Polygon, PolygonLineSegment } from "ttpg-darrell";
    import { ControlSystemType } from "lib/border-lib/space-planet-ownership/space-planet-ownership";
    /**
     * Get DrawingLines demarcating space borders.
     */
    export class SpaceBorders {
        private readonly _hexToControlSystemEntry;
        private readonly _lineThickness;
        constructor(hexToControlSystemEntry: Map<HexType, ControlSystemType>, lineThickness: number);
        _getLineSegments(owner: PlayerSlot): Array<PolygonLineSegment>;
        _getPolygons(owner: PlayerSlot): Array<Polygon>;
        _getDrawingLinesByOwner(owner: PlayerSlot): Array<DrawingLine>;
        getDrawingLines(): Array<DrawingLine>;
    }
}
declare module "lib/border-lib/planet-borders/planet-borders" {
    import { DrawingLine } from "@tabletop-playground/api";
    import { HexType, PlayerSlot } from "ttpg-darrell";
    import { ControlSystemType } from "lib/border-lib/space-planet-ownership/space-planet-ownership";
    import { Planet } from "lib/system-lib/planet/planet";
    export class PlanetBorders {
        private readonly _hexToControlSystemEntry;
        private readonly _lineThickness;
        constructor(hexToControlSystemEntry: Map<HexType, ControlSystemType>, lineThickness: number);
        _getPlanetDrawingLine(planet: Planet, owner: PlayerSlot): DrawingLine | undefined;
        _getSystemPlanetsDrawingLines(controlSystemEntry: ControlSystemType): Array<DrawingLine>;
        getDrawingLines(): Array<DrawingLine>;
    }
}
declare module "lib/border-lib/all-borders/all-borders" {
    import { DrawingLine } from "@tabletop-playground/api";
    import { IGlobal, PlayerSlot } from "ttpg-darrell";
    /**
     * Manage the actual control border DrawingLines.
     * DrawingLines persist across save/load/rewind so
     * we only need to update them in place.
     */
    export class AllBorders implements IGlobal {
        private _visibleTo;
        private readonly _onTurnChangedHandler;
        static getAllDrawingLines(): Array<DrawingLine>;
        static removeAllDrawingLines(): void;
        constructor();
        init(): void;
        destroy(): void;
        _save(): void;
        _restore(): void;
        _updateLines(): void;
        isVisibleTo(playerSlot: PlayerSlot): boolean;
        toggleVisibility(playerSlot: PlayerSlot): void;
    }
}
declare module "lib/streamer-lib/auto-streamer-camera/auto-streamer-camera" {
    import { Vector } from "@tabletop-playground/api";
    import { IGlobal, NamespaceId, PlayerSlot } from "ttpg-darrell";
    import { System } from "lib/system-lib/system/system";
    /**
     * Move the player's camera:
     *
     * - To system on system activation.
     * - To full map on turn change.
     * - To scoring area on all passed.
     *
     * No camera movement necessary for agenda, agenda UI is on screen.
     */
    export class AutoStreamerCamera implements IGlobal {
        private readonly _streamerPlayerSlots;
        private readonly _scoreboard;
        private readonly _namespaceId;
        private readonly _onAllPlayersPassed;
        private readonly _onSystemActivated;
        private readonly _onTurnStateChanged;
        constructor(namespaceId: NamespaceId);
        init(): void;
        destroy(): void;
        addStreamerPlayerSlot(playerSlot: PlayerSlot): void;
        hasStreamerPlayerSlot(playerSlot: PlayerSlot): boolean;
        removeStreamerPlayerSlot(playerSlot: PlayerSlot): void;
        _load(): void;
        _save(): void;
        _lookAtSystem(system: System): void;
        _lookAtScoring(): void;
        _lookAtFullMap(): void;
        _lookAt(pos: Vector, height: number): void;
    }
}
declare module "lib/config/config" {
    import { NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
    import { z } from "zod";
    export const ConfigSchema: z.ZodObject<{
        playerCount: z.ZodNumber;
        gamePoints: z.ZodNumber;
        timestamp: z.ZodNumber;
        sources: z.ZodArray<z.ZodString, "many">;
        exportGameData: z.ZodBoolean;
        reportErrors: z.ZodBoolean;
    }, "strict", z.ZodTypeAny, {
        playerCount: number;
        gamePoints: number;
        timestamp: number;
        sources: string[];
        exportGameData: boolean;
        reportErrors: boolean;
    }, {
        playerCount: number;
        gamePoints: number;
        timestamp: number;
        sources: string[];
        exportGameData: boolean;
        reportErrors: boolean;
    }>;
    export type ConfigSchemaType = z.infer<typeof ConfigSchema>;
    export class Config {
        readonly onConfigChanged: TriggerableMulticastDelegate<(config: Config) => void>;
        private readonly _namespaceId;
        private readonly _config;
        constructor(namespaceId: NamespaceId);
        _save(): void;
        get playerCount(): number;
        get gamePoints(): number;
        get sources(): Array<string>;
        get timestamp(): number;
        get exportGameData(): boolean;
        get reportErrors(): boolean;
        setPlayerCount(playerCount: number): this;
        setGamePoints(gamePoints: number): this;
        setSources(sources: Array<string>): this;
        setTimestamp(timestamp: number): this;
        setExportGameData(exportGameData: boolean): this;
        setReportErrors(reportErrors: boolean): this;
    }
}
declare module "ui/end-turn-button-ui/end-turn-button-ui" {
    export class EndTurnButtonUI {
        private readonly _endTurnButton;
        constructor();
        attachToScreen(): this;
        destroy(): void;
    }
}
declare module "ui/end-turn-button-ui/create-and-attach-end-turn-button-ui" {
    export class CreateAndAttachEndTurnButtonUI {
        private readonly _endTurnButtonUI;
        constructor();
        init(): void;
        destroy(): void;
    }
}
declare module "lib/strategy-card-lib/initiative-order/initiative-order" {
    import { GameObject } from "@tabletop-playground/api";
    import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
    export type InitiativeEntry = {
        playerSlot: number;
        initiative: number;
        strategyCards: Array<GameObject>;
    };
    export class InitiativeOrder {
        private readonly _find;
        private readonly _playerSeats;
        static getStrategyCardNsidNameFirst(obj: GameObject): NsidNameSchemaType | undefined;
        _isAtopStrategyCardMat(strategyCard: GameObject): boolean;
        get(): Array<InitiativeEntry>;
        setTurnOrderFromStrategyCards(): void;
    }
}
declare module "ui/turn-order-ui/turn-order-entry" {
    import { Color } from "@tabletop-playground/api";
    import { TurnEntryWart, TurnEntryWidget } from "ttpg-darrell";
    export class TurnOrderEntry extends TurnEntryWart {
        private readonly _scoreboard;
        private readonly _factionIcon;
        private readonly _factionName;
        private readonly _score;
        private readonly _strategyCardSolo;
        private readonly _strategyCardSoloOverlay;
        private readonly _strategyCardLeft;
        private readonly _strategyCardLeftOverLay;
        private readonly _strategyCardRight;
        private readonly _strategyCardRightOverLay;
        constructor(turnEntryWidget: TurnEntryWidget);
        destroy(): void;
        _updatePlayerSlotToFaction(): void;
        _updatePlayerSlotToScore(): void;
        _updatePlayerSlotToStrategyCards(): void;
        update(playerSlot: number, fgColor: Color, _bgColor: Color): void;
    }
}
declare module "ui/turn-order-ui/turn-order-ui" {
    import { TurnOrderWidgetParams } from "ttpg-darrell";
    export class TurnOrderUI {
        private readonly _params;
        private _onPlayerChangedColorHandler;
        private _turnOrderWidget;
        constructor();
        getParams(): TurnOrderWidgetParams;
        setPlayerCount(playerCount: number): this;
        attachToScreen(): this;
        destroy(): void;
    }
}
declare module "ui/turn-order-ui/create-and-attach-turn-order-ui" {
    import { IGlobal } from "ttpg-darrell";
    export class CreateAndAttachTurnOrderUI implements IGlobal {
        private readonly _onConfigChangedHandler;
        private _turnOrderUI;
        constructor();
        init(): void;
        destroy(): void;
    }
}
declare module "lib/faction-lib/data/faction.data" {
    import { FactionSchemaType } from "lib/faction-lib/schema/faction-schema";
    export const SOURCE_TO_FACTION_DATA: Record<string, Array<FactionSchemaType>>;
}
declare module "lib/faction-lib/data/faction-nsid-rewrite.data" {
    export const REWRITE_NSIDS: Record<string, string>;
}
declare module "lib/faction-lib/registry/faction-registry" {
    import { Faction } from "lib/faction-lib/faction/faction";
    import { FactionSchemaType } from "lib/faction-lib/schema/faction-schema";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    export class FactionRegistry {
        private readonly _find;
        private readonly _nsidToFaction;
        private readonly _nsidToRewriteNsid;
        private readonly _tileNumberToFaction;
        constructor();
        getAllFactions(): Array<Faction>;
        getAllFactionsFilteredByConfigSources(): Array<Faction>;
        getByHomeSystemTileNumber(tileNumber: number): Faction | undefined;
        getByNsid(nsid: string): Faction | undefined;
        getByNsidOrThrow(nsid: string): Faction;
        getByNsidName(nsidName: string): Faction | undefined;
        getByNsidNameOrThrow(nsidName: string): Faction;
        getByPlayerSlot(playerSlot: number): Faction | undefined;
        getPlayerSlotToFaction(): Map<number, Faction>;
        load(sourceAndPackageId: SourceAndPackageIdSchemaType, factions: Array<FactionSchemaType>): this;
        loadDefaultData(): this;
        loadRewriteLeader(rewrite: Record<string, string>): this;
        loadDefaultRewriteNsid(): this;
        /**
         * Leader overrides may have a different source than the faction
         * (e.g. zeu.omega).
         *
         * @param nsid
         * @returns
         */
        rewriteNsid(nsid: string): string;
        /**
         * Verify modifiers with tech or unit based triggers link to a known tech
         * or unit.
         *
         * @param errors
         * @returns
         */
        validate(errors: Array<string>): this;
        validateOrThrow(): this;
    }
}
declare module "lib/game-data-lib/game-data-export/game-data-export" {
    import { IGlobal } from "ttpg-darrell";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    /**
     * Send game data to AppEngine for stats.
     */
    export class GameDataExport implements IGlobal {
        private readonly _onGameData;
        private readonly _onGameEnd;
        private readonly _onInterval;
        private _sendNextGameData;
        private _intervalHandle;
        init(): void;
        destroy(): void;
        _maybeStartInterval(executionReason: string): void;
        _send(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/i-game-data-updator/i-game-data-updator" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    export interface IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/game-data-updator/game-data-updator" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class GameDataUpdator {
        private readonly _updators;
        private _gameData;
        private _nextProcessIndex;
        private _intervalHandle;
        readonly _onInterval: () => void;
        static createGameData(): GameData;
        constructor(updators: Array<IGameDataUpdator>);
        /**
         * Processes the next updator in the list.
         *
         * @returns true if all updators have been processed this cycle
         */
        _processNext(): boolean;
        startPeriodicUpdates(): this;
        stopPeriodicUpdates(): this;
        startPeriodicUpdatesInProduction(): this;
    }
}
declare module "lib/game-data-lib/updators/updator-active-system/updator-active-system" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorActiveSystem implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-config/updator-config" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorConfig implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-hex-summary/hex-summary-codes" {
    import { GameObject } from "@tabletop-playground/api";
    import { HexType } from "ttpg-darrell";
    import { UnitPlastic } from "lib/unit-lib/unit-plastic/unit-plastic";
    import { System } from "lib/system-lib/system/system";
    export type EntityAreaType = "unit" | "token" | "space" | "planet";
    export type EntityAreaTypeAndCode = {
        type: EntityAreaType;
        flippable?: boolean;
        code: string;
    };
    export type EntityType = {
        code: string;
        planetIndex: number;
        count: number;
        colorCode?: string;
        token?: boolean;
        attachment?: boolean;
        hex?: HexType;
    };
    export const ATTACHMENT_NSID_TO_TYPE_AND_CODE: Record<string, EntityAreaTypeAndCode>;
    export class HexSummaryCodes {
        private readonly _hexToSystem;
        constructor();
        getHexToSystem(): Map<HexType, System>;
        _getPlanetIndex(obj: GameObject): number;
        _colorCode(obj: GameObject): string | undefined;
        _unitCode(plastic: UnitPlastic): string | undefined;
        _tokenCode(obj: GameObject): string | undefined;
        unitEntity(plastic: UnitPlastic): EntityType | undefined;
        tokenEntity(obj: GameObject): EntityType | undefined;
        attachmentEntity(obj: GameObject): EntityType | undefined;
    }
}
declare module "lib/game-data-lib/updators/updator-hex-summary/sort-entity-type" {
    import { EntityType } from "lib/game-data-lib/updators/updator-hex-summary/hex-summary-codes";
    export class SortEntityType {
        sort(entityTypes: Array<EntityType>): void;
    }
}
declare module "lib/game-data-lib/updators/updator-hex-summary/updator-hex-summary" {
    import { HexType } from "ttpg-darrell";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    import { EntityType } from "lib/game-data-lib/updators/updator-hex-summary/hex-summary-codes";
    export class UpdatorHexSummary implements IGameDataUpdator {
        update(gameData: GameData): void;
        _getAllEntityTypes(): Array<EntityType>;
        _mergeEntityTypes(entityTypes: Array<EntityType>): Array<EntityType>;
        /**
         * Seconds: hex position.
         * @param hex
         * @returns
         */
        _encodeHex(hex: HexType): string;
        /**
         * Third: what is in the system.
         * @param entityTypes
         * @returns
         */
        _encodeEntityTypes(entityTypes: Array<EntityType>): string;
        encodeAll(): string;
    }
}
declare module "lib/game-data-lib/updators/updator-history/updator-history" {
    import { IGlobal } from "ttpg-darrell";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    /**
     * Report a very minimal history of GameData per round.
     */
    export class UpdatorHistory implements IGameDataUpdator, IGlobal {
        private readonly _find;
        private _registered;
        private readonly _onGameData;
        init(): void;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-laws/updator-laws" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorLaws implements IGameDataUpdator {
        private readonly _cardUtil;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-map-string/updator-map-string" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorMapString implements IGameDataUpdator {
        private readonly _mapStringSave;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-objectives/updator-objectives" {
    import { Card, GameObject } from "@tabletop-playground/api";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    import { UpdatorObjectivesType } from "lib/game-data-lib/updators/updator-objectives/updator-objectives-type";
    export class UpdatorObjectives implements IGameDataUpdator {
        update(gameData: GameData): void;
        _getControlTokens(): Array<GameObject>;
        _getRelevantCards(): Array<Card>;
        _fillObjectivesType(objectiveCards: Array<Card>): UpdatorObjectivesType;
    }
}
declare module "lib/game-data-lib/objective-progress/goal-counter" {
    import { Card } from "@tabletop-playground/api";
    import { HexType, PlayerSlot } from "ttpg-darrell";
    export class GoalCounter {
        private readonly _find;
        _getSystemHexes(): Set<HexType>;
        _getPlayerSlotToPlanetCards(): Map<PlayerSlot, Array<Card>>;
        _getPlayerSlotToHomePlanetCardNsids(): Map<PlayerSlot, Set<string>>;
        _getAllHomePlanetCardNsids(): Set<string>;
        _getPlayerSlotToHomeSystemHex(): Map<PlayerSlot, HexType>;
        _getPlayerSlotToControlledPlanetHexes(): Map<PlayerSlot, Set<HexType>>;
        /**
         * Count per-player number of flagships and war suns.
         *
         * @returns
         */
        countFlagshipsAndWarSuns(): Map<PlayerSlot, number>;
        countInfResTgs(): Map<PlayerSlot, {
            inf: number;
            res: number;
            tgs: number;
        }>;
        countMaxNonFighterShipsInSingleSystem(): Map<PlayerSlot, number>;
        countPlanetsAndGetNeighbors(): Map<PlayerSlot, {
            planets: number;
            neighbors: Array<PlayerSlot>;
        }>;
        countPlanetsInOthersHome(): Map<PlayerSlot, number>;
        countPlanetsNonHome(excludeCustodiaVigilia: boolean): Map<PlayerSlot, number>;
        countPlanetTraits(): Map<PlayerSlot, {
            cultural: number;
            industrial: number;
            hazardous: number;
        }>;
        countPlanetsWithAttachments(): Map<PlayerSlot, number>;
        countPlanetsWithStructuresOutsidePlayersHome(): Map<PlayerSlot, number>;
        countPlanetsWithTechSpecialties(): Map<PlayerSlot, number>;
        countStructures(): Map<PlayerSlot, number>;
        countSystemsWithControlledPlanetsInOrAdjToOthersHome(): Map<PlayerSlot, number>;
        countSystemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(): Map<PlayerSlot, number>;
        countSystemsWithoutPlanetsWithUnits(): Map<PlayerSlot, number>;
        countSystemsWithShipsAdjToMecatol(): Map<PlayerSlot, number>;
        countSystemsWithUnitsInLegendaryMecatolOrAnomaly(): Map<PlayerSlot, number>;
        countSystemsWithUnitsOnEdgeOfGameBoardOtherThanHome(): Map<PlayerSlot, number>;
        countTechnologyColors(): Map<PlayerSlot, {
            blue: number;
            green: number;
            red: number;
            yellow: number;
            unitUpgrade: number;
        }>;
        countTokensInTacticAndStrategy(): Map<PlayerSlot, number>;
    }
}
declare module "lib/game-data-lib/objective-progress/goal-progress" {
    import { PlayerSlot } from "ttpg-darrell";
    export type GoalProgressPerPlayerType = {
        value: number | string | boolean;
        success: boolean;
    };
    export type GoalProgressType = {
        header: string;
        values: Array<GoalProgressPerPlayerType | undefined>;
    };
    export function toSeats<T>(playerSlotToT: Map<PlayerSlot, T>): Array<T>;
    export class GoalProgress {
        private readonly _goalCounter;
        flagshipOrWarSun(needed: number): GoalProgressType;
        /**
         * Spend N inf
         * @param needed
         * @returns
         */
        influence(needed: number): GoalProgressType;
        /**
         * Spend N inf
         * @param needed
         * @returns
         */
        resources(needed: number): GoalProgressType;
        tradegoods(needed: number): GoalProgressType;
        infResTgs(needed: number): GoalProgressType;
        maxNonFighterShipsInSingleSystem(needed: number): GoalProgressType;
        morePlanetsThan2Neighbors(): GoalProgressType;
        planetsInOthersHome(needed: number): GoalProgressType;
        planetsNonHome(needed: number, excludeCustodiaVigilia: boolean): GoalProgressType;
        planetsSameTrait(needed: number): GoalProgressType;
        planetsWithAttachments(needed: number): GoalProgressType;
        planetsWithStructuresOutsidePlayersHome(needed: number): GoalProgressType;
        planetsWithTechSpecialties(needed: number): GoalProgressType;
        structures(needed: number): GoalProgressType;
        systemsWithControlledPlanetsInOrAdjToOthersHome(needed: number): GoalProgressType;
        systemsWithFlagshipOrWarSunAlsoOthersHomeOrMecatol(needed: number): GoalProgressType;
        systemsWithoutPlanetsWithUnits(needed: number): GoalProgressType;
        systemsWithShipsAdjToMecatol(needed: number): GoalProgressType;
        systemsWithUnitsInLegendaryMecatolOrAnomaly(needed: number): GoalProgressType;
        systemsWithUnitsOnEdgeOfGameBoardOtherThanHome(needed: number): GoalProgressType;
        twoTechInColors(needed: number): GoalProgressType;
        techUnitUpgrades(needed: number): GoalProgressType;
        tokensInTacticAndStrategy(needed: number): GoalProgressType;
    }
}
declare module "lib/game-data-lib/objective-progress/goal.data" {
    import { GoalProgressType } from "lib/game-data-lib/objective-progress/goal-progress";
    export type GoalDataEntry = {
        abbr: string;
        name: string;
        nsid: string;
        get: () => GoalProgressType;
    };
    export const GOAL_DATA_ENTRIES: ReadonlyArray<GoalDataEntry>;
}
declare module "lib/game-data-lib/updators/updator-objectives-progress/updator-objectives-progress" {
    import { GoalDataEntry } from "lib/game-data-lib/objective-progress/goal.data";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    import { GoalProgressType } from "lib/game-data-lib/objective-progress/goal-progress";
    import { UpdatorObjectiveProgressType } from "lib/game-data-lib/updators/updator-objectives-progress/updator-objectives-progress-type";
    export class UpdatorObjectivesProgress implements IGameDataUpdator {
        update(gameData: GameData): void;
        _nsidToStage(nsid: string): number;
        /**
         * Transform to the game data format.  Right now they're the same
         * except for handling undefined values ("can't happen" in practice).
         *
         * @param goalProgress
         * @returns
         */
        _goalProgressToValues(goalProgress: GoalProgressType): Array<{
            value: string | number | boolean;
            success: boolean;
        }>;
        /**
         * Which seat indexes scored the goal?
         *
         * @param goalProgress
         * @returns
         */
        _getProgressToScoredBy(goalProgress: GoalProgressType): Array<number>;
        _getObjectiveProgress(goalDataEntry: GoalDataEntry, goalProgress: GoalProgressType): UpdatorObjectiveProgressType;
    }
}
declare module "lib/game-data-lib/updators/updator-round/updator-round" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorRound implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-scoreboard/updator-scoreboard" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorScoreboard implements IGameDataUpdator {
        private readonly _scoreboard;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-setup-timestamp/updator-setup-timestamp" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorSetupTimestamp implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-speaker/updator-speaker" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorSpeaker implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-timer/updator-timer" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorTimer implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-timestamp/updator-timestamp" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorTimestamp implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-turn/udpator-turn" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorTurn implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-active/updator-player-active" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerActive implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-color/updator-player-color" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerColor implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-command-tokens/updator-player-command-tokens" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerCommandTokens implements IGameDataUpdator {
        private readonly _commandTokenCounter;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-custodians-points/updator-player-custodians-points" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerCustodiansPoints implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-faction/updator-player-faction" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerFaction implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-hand-summary/updator-player-hand-summary" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerHandSummary implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-leaders/updator-player-leaders" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerLeaders implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-name/updator-player-name" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerName implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-planet-totals/updator-player-planet-totals" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerPlanetTotals implements IGameDataUpdator {
        private readonly _cardUtil;
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-score/updator-player-score" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerScore implements IGameDataUpdator {
        private readonly _scoreboard;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-strategy-cards/updator-player-strategy-cards" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerStrategyCards implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-tech/updator-player-tech" {
    import { Card } from "@tabletop-playground/api";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerTech implements IGameDataUpdator {
        private readonly _cardUtil;
        private readonly _find;
        static getTimestamp(card: Card): number;
        static setTimestamp(card: Card): void;
        constructor();
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-tradegoods/updator-player-tradegoods" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerTradegoods implements IGameDataUpdator {
        private readonly _find;
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/updators/updator-player-turn-order/updator-player-turn-order" {
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export class UpdatorPlayerTurnOrder implements IGameDataUpdator {
        update(gameData: GameData): void;
    }
}
declare module "lib/game-data-lib/game-data-updators/game-data-updators" {
    import { IGameDataUpdator } from "lib/game-data-lib/i-game-data-updator/i-game-data-updator";
    export const GAME_DATA_UPDATORS: Array<IGameDataUpdator>;
}
declare module "lib/game-data-lib/objective-progress/goal-reporter" {
    import { IGlobal } from "ttpg-darrell";
    import { GoalDataEntry } from "lib/game-data-lib/objective-progress/goal.data";
    import { GoalProgressType } from "lib/game-data-lib/objective-progress/goal-progress";
    /**
     * Slowly cycles through the goal data entries, updates a local collection of
     * goal progress values.  Callers can fetch the current progress values.
     *
     * Is only active when streamer buddy is active.
     */
    export class GoalReporter implements IGlobal {
        private readonly _goalData;
        private readonly _goalNsidToProgress;
        private readonly _onStreamerBuddyChanged;
        private readonly _onInterval;
        private _intervalHandle;
        private _intervalIndex;
        constructor();
        init(): void;
        getAllGoalDataEntries(): ReadonlyArray<GoalDataEntry>;
        getGoalProgress(nsid: string): GoalProgressType | undefined;
    }
}
declare module "lib/streamer-lib/hide-mouse-cursor/hide-mouse-cursor" {
    import { Player, Vector, Zone } from "@tabletop-playground/api";
    import { IGlobal, NamespaceId } from "ttpg-darrell";
    export class HideMouseCursor implements IGlobal {
        private readonly _namespaceId;
        private readonly _hideCursorPlayerNames;
        private _zone;
        readonly _updateZoneHandler: () => void;
        constructor(namespaceId: NamespaceId);
        init(): void;
        addHideCursor(player: Player): void;
        hasHideCursor(player: Player): boolean;
        removeHideCursor(player: Player): void;
        private _updateZone;
        private _save;
        private _load;
        static _getTablePositionAndExtent(): {
            tablePosition: Vector;
            tableExtent: Vector;
        };
        static _findOrCreateZone(): Zone;
    }
}
declare module "lib/game-data-lib/last-game-data/last-game-data" {
    import { IGlobal } from "ttpg-darrell";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    export class LastGameData implements IGlobal {
        private _gameData;
        private readonly _onGameData;
        init(): void;
        destroy(): void;
        getLastGameData(): GameData | undefined;
    }
}
declare module "lib/numpad-key-lib/numpad-key-spawn/numpad-key-spawn" {
    export class NumpadKeySpawn {
        private readonly _keyToNsid;
        private readonly _onScriptButtonPressed;
        constructor(keyToNsid: Record<number, string>);
        destroy(): void;
    }
}
declare module "lib/numpad-key-lib/numpad-key-recycle/numpad-key-recycle" {
    import { Player } from "@tabletop-playground/api";
    export class NumpadKeyRecycle {
        private readonly _playerNameToCtrlKeyCount;
        private readonly _key;
        private readonly _onScriptButtonPressed;
        constructor(key: number);
        destroy(): void;
        _getCtrlKeyCount(player: Player): number;
    }
}
declare module "lib/numpad-key-lib/numpad-key-look-seat/numpad-key-look-seat" {
    export class NumpadKeyLookSeat {
        private readonly _onScriptButtonPressed;
        constructor();
        destroy(): void;
    }
}
declare module "lib/numpad-key-lib/numpad-key-look-active-system/numpad-key-look-active-system" {
    export class NumpadKeyLookActiveSystem {
        private readonly _key;
        private readonly _onScriptButtonPressed;
        constructor(key: number);
        destroy(): void;
    }
}
declare module "lib/numpad-key-lib/numpad-key-look-map/numpad-key-look-map" {
    export class NumpadKeyLookMap {
        private readonly _key;
        private readonly _onScriptButtonPressed;
        constructor(key: number);
        destroy(): void;
    }
}
declare module "lib/numpad-key-lib/numpad-key-look-my-seat/numpad-key-look-my-seat" {
    export class NumpadKeyLookMySeat {
        private readonly _find;
        private readonly _key;
        private readonly _onScriptButtonPressed;
        constructor(key: number);
        destroy(): void;
    }
}
declare module "lib/numpad-key-lib/numpad-key-look-scoring/numpad-key-look-scoring" {
    export class NumpadKeyLookScoring {
        private readonly _find;
        private readonly _key;
        private readonly _onScriptButtonPressed;
        constructor(key: number);
        destroy(): void;
    }
}
declare module "lib/numpad-key-lib/numpad-key-all/numpad-key-all" {
    import { IGlobal } from "ttpg-darrell";
    export class NumpadKeyAll implements IGlobal {
        init(): void;
    }
}
declare module "lib/system-lib/data/planet-attachment.data" {
    import { PlanetAttachmentSchemaType } from "lib/system-lib/schema/planet-attachment-schema";
    export const SOURCE_TO_PLANET_ATTACHMENT_DATA: Record<string, Array<PlanetAttachmentSchemaType>>;
}
declare module "lib/system-lib/registry/planet-attachment-registry" {
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    import { PlanetAttachment } from "lib/system-lib/planet-attachment/planet-attachment";
    import { PlanetAttachmentSchemaType } from "lib/system-lib/schema/planet-attachment-schema";
    export class PlanetAttachmentRegistry {
        private readonly _nsidToSchemaAndSource;
        private readonly _attachmentObjIdToPlanetAttachment;
        private readonly _onObjectCreatedHandler;
        private readonly _onObjectDestroyedHandler;
        constructor();
        destroy(): void;
        /**
         * Add planet attachments to planets.
         *
         * Init runs after setting up other objects, in this case we need system
         * registry to have loaded system data for finding by positon.
         *
         * Global takes care of calling init, but if any homebrew loads new content
         * it must also be sure to call init to attach any existing tokens.
         */
        init(): void;
        load(sourceAndPackageId: SourceAndPackageIdSchemaType, planetAttachmentSchemaTypes: Array<PlanetAttachmentSchemaType>): this;
        /**
         * Load the game data (base plus codices and expansions).
         *
         * @returns
         */
        loadDefaultData(): this;
        getAllNsids(): Array<string>;
        /**
         * Find the attachment by the linked card.
         * Only finds attachments inside a container, not loose on the table.
         *
         * @param cardNsid
         * @returns
         */
        getByCardNsid(cardNsid: string): PlanetAttachment | undefined;
        /**
         * Lookup planet attachment by planet attachment token object nsid.
         * Duplicate tiles for the "same" attachment have separate instances.
         *
         * @param objId
         * @returns
         */
        getByPlanetAttachmentObjId(objId: string): PlanetAttachment | undefined;
        rawByNsid(nsid: string): PlanetAttachmentSchemaType | undefined;
        rawByCardNsid(cardNsid: string): PlanetAttachmentSchemaType | undefined;
    }
}
declare module "lib/player-lib/player-action-phase-time/player-action-phase-time" {
    import { IGlobal, NamespaceId } from "ttpg-darrell";
    export class PlayerActionPhaseTime implements IGlobal {
        private readonly _namespaceId;
        private readonly _roundToSeatIndexToSeconds;
        private _intervalHandle;
        private _isActionPhase;
        private _round;
        constructor(namespaceId: NamespaceId | undefined);
        _save(): void;
        _load(): Array<Array<number>>;
        private readonly _onGameData;
        readonly _onInterval: () => void;
        _getSeatIndexToSeconds(round: number): Array<number>;
        _incrSeconds(round: number, seatIndex: number, incrBy: number): void;
        getSeconds(round: number, seatIndex: number): number;
        init(): void;
        _maybeStartInterval(executionReason: string): void;
        destroy(): void;
        getRound(): number;
        isActiveActionPhase(): boolean;
    }
}
declare module "lib/player-lib/player-color/player-color" {
    import { Color } from "@tabletop-playground/api";
    import { NamespaceId } from "ttpg-darrell";
    type PlayerColorEntry = {
        colorName: string;
        target: string;
        plastic: string;
        widget: string;
    };
    export class PlayerColor {
        private readonly _namespaceId;
        private readonly _colorLib;
        constructor(namespaceId: NamespaceId);
        getAnonymousColor(): Color;
        _getPlayerColorEntry(slot: number): PlayerColorEntry | undefined;
        _setPlayerColorEntry(slot: number, entry: PlayerColorEntry): void;
        setSlotColor(slot: number, colorName: string, colorHex?: string): void;
        getSlotColorName(slot: number): string | undefined;
        getSlotColorNameOrThrow(slot: number): string;
        getSlotPlasticColor(slot: number): Color | undefined;
        getSlotPlasticColorOrThrow(slot: number): Color;
        getSlotWidgetColor(slot: number): Color | undefined;
        getSlotWidgetColorOrThrow(slot: number): Color;
    }
}
declare module "lib/player-lib/player-name/player-name" {
    import { Player } from "@tabletop-playground/api";
    /**
     * Use a consistent player name.
     */
    export class PlayerName {
        getByPlayer(player: Player): string;
        getBySlot(playerSlot: number): string;
    }
}
declare module "lib/remove-lib/data/remove.data" {
    /**
     * When including a given source, remove the linked NSIDs (e.g., with PoK
     * remove some base game agendas).
     *
     * Include sources without remove directives, that way we can remove the source too.
     */
    export const SOURCE_TO_REMOVE_NSIDS: Record<string, Array<string>>;
}
declare module "lib/remove-lib/registry/remove-registry" {
    import { RemoveByNsidOrSource } from "lib/remove-lib/remove-by-nsid-or-source/remove-by-nsid-or-source";
    export class RemoveRegistry {
        private readonly _sourceToRemoveNsids;
        createRemoveFromRegistryAndConfig(): RemoveByNsidOrSource;
        getAllNsids(): Array<string>;
        getAllSources(): Array<string>;
        getRemoveBySource(source: string): Array<string>;
        load(source: string, nsids: Array<string>): this;
        loadDefaultData(): this;
    }
}
declare module "lib/command-token-lib/report-command-token-put-get/report-command-token-put-get" {
    import { Container, GameObject } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    /**
     * Report players' adding/removing command tokens.
     */
    export class PerContainerReportCommandTokenPutGet {
        private readonly _container;
        private _timeoutHandle;
        private _insertCount;
        private _removeCount;
        constructor(container: Container);
        _getMessageAndResetCounts(): string;
        private readonly _report;
        private readonly _onInserted;
        private readonly _onRemoved;
    }
    export class ReportCommandTokenPutGet implements IGlobal {
        init(): void;
        _maybeAdd(obj: GameObject): void;
    }
}
declare module "global/r-swap-split-combine" {
    import { Container, GameObject, Player } from "@tabletop-playground/api";
    import { IGlobal, SwapSplitCombine } from "ttpg-darrell";
    export class RSwapSplitCombine extends SwapSplitCombine implements IGlobal {
        private readonly _find;
        constructor();
        getPlasticContainer(unit: "infantry" | "fighter", player: Player): Container | undefined;
        getPlastic(unit: "infantry" | "fighter", player: Player): GameObject | undefined;
        putPlastic(unit: "infantry" | "fighter", player: Player, obj: GameObject): boolean;
    }
}
declare module "global/shuffle-decks" {
    import { IGlobal } from "ttpg-darrell";
    export class ShuffleDecks implements IGlobal {
        init(): void;
    }
}
declare module "lib/slash-command-lib/data/commands/abstract-slash-command/abstract-slash-command" {
    import { Player } from "@tabletop-playground/api";
    export abstract class AbstractSlashCommand {
        abstract getSlashCommand(): `/${string}`;
        abstract isHostOnly(): boolean;
        abstract run(argv: Array<string>, player: Player): void;
    }
}
declare module "lib/slash-command-lib/data/commands/slash-perf/slash-perf" {
    import { Player } from "@tabletop-playground/api";
    import { AbstractSlashCommand } from "lib/slash-command-lib/data/commands/abstract-slash-command/abstract-slash-command";
    export class SlashPerf extends AbstractSlashCommand {
        private _perfWidget;
        getSlashCommand(): `/${string}`;
        isHostOnly(): boolean;
        run(_argv: Array<string>, player: Player): void;
    }
}
declare module "lib/slash-command-lib/data/commands/slash-toggle-units/slash-toggle-units" {
    import { Player } from "@tabletop-playground/api";
    import { AbstractSlashCommand } from "lib/slash-command-lib/data/commands/abstract-slash-command/abstract-slash-command";
    export class SlashToggleUnits implements AbstractSlashCommand {
        getSlashCommand(): `/${string}`;
        isHostOnly(): boolean;
        run(_argv: Array<string>, _player: Player): void;
    }
}
declare module "lib/homebrew-lib/validate/abstract-validate/abstract-validate" {
    export abstract class AbstractValidate {
        abstract getCommandName(): string;
        abstract getDescription(): string;
        /**
         * Get the errors from the validation.
         * @param errors The array to populate with errors.
         */
        abstract getErrors(errors: Array<string>): void;
        /**
         * Get the set of card NSIDs where the registered decks match the nsid prefix.
         *
         * @param cardNsidPrefix
         * @returns
         */
        getCardNsids(cardNsidPrefix: string): Set<string>;
        /**
         * Return items in src that are not in dst.
         *
         * @param src
         * @param dst
         * @returns
         */
        getSrcMissingFromDst(src: Set<string>, dst: Set<string>): Array<string>;
    }
}
declare module "lib/homebrew-lib/validate/validate-attachments/validate-attachments" {
    import { AbstractValidate } from "lib/homebrew-lib/validate/abstract-validate/abstract-validate";
    export class ValidateAttachments extends AbstractValidate {
        getCommandName(): string;
        getDescription(): string;
        getErrors(errors: Array<string>): void;
        _getPlanetAttachmentNsids(): Array<string>;
        _getSystemAttachmentNsids(): Array<string>;
    }
}
declare module "lib/homebrew-lib/validate/validate-factions/validate-factions" {
    import { Faction } from "lib/faction-lib/faction/faction";
    import { AbstractValidate } from "lib/homebrew-lib/validate/abstract-validate/abstract-validate";
    export class ValidateFactions extends AbstractValidate {
        getCommandName(): string;
        getDescription(): string;
        getErrors(errors: Array<string>): void;
        _getLeaderNsids(faction: Faction): Array<string>;
        _getTechNsids(faction: Faction): Array<string>;
        _getOtherNsids(faction: Faction): Array<string>;
    }
}
declare module "lib/homebrew-lib/validate/validate-planet-cards/validate-planet-cards" {
    import { AbstractValidate } from "lib/homebrew-lib/validate/abstract-validate/abstract-validate";
    /**
     * Get planet cards NSIDs, spawn planet decks and make sure all nsids exist.
     */
    export class ValidatePlanetCards extends AbstractValidate {
        getCommandName(): string;
        getDescription(): string;
        getErrors(erros: Array<string>): void;
        _getRegisteredPlanetCardNsids(): Set<string>;
    }
}
declare module "lib/homebrew-lib/validate/validate-systems/validate-systems" {
    import { AbstractValidate } from "lib/homebrew-lib/validate/abstract-validate/abstract-validate";
    export class ValidateSystems extends AbstractValidate {
        getCommandName(): string;
        getDescription(): string;
        getErrors(errors: Array<string>): void;
    }
}
declare module "lib/homebrew-lib/validate/validate-template-nsids/validate-template-nsids" {
    import { AbstractValidate } from "lib/homebrew-lib/validate/abstract-validate/abstract-validate";
    /**
     * Verify all non-deck spawn NSIDs match the resulting object NSIDs.
     * Careful with this, objects may have scripts.
     */
    export class ValidateTemplateNsids extends AbstractValidate {
        getCommandName(): string;
        getDescription(): string;
        getErrors(errors: Array<string>): void;
        /**
         * If the NSID isn't a card, verity the resulting object has that
         * NSID.  Return an error message, or undefined if it matches.
         *
         * @param nsid
         */
        _checkNsid(nsid: string): string | undefined;
    }
}
declare module "lib/slash-command-lib/data/commands/slash-validate/slash-validate" {
    import { Player } from "@tabletop-playground/api";
    import { AbstractSlashCommand } from "lib/slash-command-lib/data/commands/abstract-slash-command/abstract-slash-command";
    export class SlashValidate extends AbstractSlashCommand {
        private readonly _validates;
        getSlashCommand(): `/${string}`;
        isHostOnly(): boolean;
        run(argv: Array<string>, player: Player): void;
    }
}
declare module "lib/slash-command-lib/data/slash-command.data" {
    import { AbstractSlashCommand } from "lib/slash-command-lib/data/commands/abstract-slash-command/abstract-slash-command";
    export const SLASH_COMMANDS: Array<AbstractSlashCommand>;
}
declare module "lib/slash-command-lib/slash-command-registry/slash-command-registry" {
    import { IGlobal } from "ttpg-darrell";
    import { AbstractSlashCommand } from "lib/slash-command-lib/data/commands/abstract-slash-command/abstract-slash-command";
    export class SlashCommandRegistry implements IGlobal {
        private readonly _commandToAction;
        private readonly _onChat;
        init(): void;
        load(commands: Array<AbstractSlashCommand>): this;
        loadDefaultData(): this;
    }
}
declare module "setup/layout/layout-config" {
    export const LayoutConfig: Readonly<{
        spacing: 1;
        spacingWide: 4;
        spacingExtraWide: 12;
    }>;
}
declare module "setup/layout/layout-player-area/layout-unit-box" {
    import { LayoutObjects } from "ttpg-darrell";
    import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    export class LayoutUnitBox {
        private readonly _layout;
        constructor(unit: UnitType, playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-player-area/layout-unit-boxes" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutUnitBoxes {
        private readonly _layout;
        constructor(playerSlot: number, numCols?: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-combat-arena/layout-combat-arena" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutCombatArena {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-combat-arena/layout-combat-arena-and-unit-boxes" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutCombatArenaAndUnitBoxes {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-fighter-inf-tg-containers/layout-fighter-containers" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutFighterContainers {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-fighter-inf-tg-containers/layout-infantry-containers" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutInfantryContainers {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-fighter-inf-tg-containers/layout-tradegood-containers" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutTradegoodContainers {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-fighter-inf-tg-containers/layout-fighter-inf-tg-containers" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutFighterInfTgContainers {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-map-area/layout-map-area" {
    import { Vector } from "@tabletop-playground/api";
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutMapArea {
        private readonly _layout;
        constructor(numRings: number);
        getLayout(): LayoutObjects;
        _getCorners(ring: number, overrun: boolean): Array<Vector>;
        _addMapRingLines(numRings: number): void;
    }
}
declare module "setup/layout/layout-player-area/layout-mats" {
    import { Card, SnapPoint } from "@tabletop-playground/api";
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutMats {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
        _spawnTechDeck(snapPoint: SnapPoint | undefined): void;
        _filterTechDeck(deck: Card): void;
    }
}
declare module "setup/layout/layout-player-area/layout-sheets" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutSheets {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-player-area/layout-token-containers" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutTokenContainers {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-player-area/place-generic-promissories" {
    import { Card, CardHolder } from "@tabletop-playground/api";
    export class PlaceGenericPromissories {
        private readonly _playerSlot;
        private readonly _cardUtil;
        private readonly _find;
        constructor(playerSlot: number);
        place(): void;
        _getCardHolder(): CardHolder | undefined;
        _getColorName(): string | undefined;
        _getPromissoryDeck(): Card;
        _getGenericPromissoryCards(deck: Card, colorName: string): Array<Card>;
        _placeCards(cardHolder: CardHolder, cards: Array<Card>): void;
    }
}
declare module "setup/layout/layout-player-area/layout-trove-mat" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutTroveMat {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-player-area/layout-status-pad" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutStatusPad {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-player-area/layout-row-troves-and-status-pad" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutRowTrovesAndStatusPad {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-player-area/layout-player-area" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutPlayerArea {
        private readonly _layout;
        constructor(playerSlot: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-table-decks/layout-table-decks" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutTableDecks {
        private readonly _layout;
        static _spawnDeck(nsidPrefix: string, snapPointTag: string): void;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-scoring-area/layout-objectives" {
    import { GameObject } from "@tabletop-playground/api";
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutObjectives {
        private readonly _layout;
        private readonly _scoreboard;
        constructor();
        getLayout(): LayoutObjects;
        getScoreboard(): GameObject;
    }
}
declare module "setup/layout/layout-scoring-area/layout-player-secrets" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutPlayerSecrets {
        private readonly _layout;
        constructor(playerCount: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-scoring-area/layout-agenda-laws-mat" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutAgendaLawsMat {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-scoring-area/layout-timer" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutTimer {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-scoring-area/layout-scoring-area" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutScoringArea {
        private readonly _layout;
        constructor(playerCount: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-strategy-cards/layout-strategy-cards" {
    import { GameObject, SnapPoint } from "@tabletop-playground/api";
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutStrategyCards {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
        _placeStrategyCard(strategyCard: GameObject, snapPoint: SnapPoint | undefined): void;
    }
}
declare module "setup/layout/layout-table-containers/layout-system-container" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutSystemContainer {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-table-containers/layout-exploration-container" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutExplorationContainer {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-table-containers/layout-frontier-container" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutFrontierContainer {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-table-containers/layout-table-containers" {
    import { LayoutObjects } from "ttpg-darrell";
    /**
     * Misc containers.
     */
    export class LayoutTableContainers {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-table-system-tiles/layout-table-system-tiles" {
    import { Rotator, Vector } from "@tabletop-playground/api";
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutTableSystemTiles {
        private readonly _layout;
        private readonly _find;
        constructor();
        getLayout(): LayoutObjects;
        _moveSystemTileFromContainer(tileNumber: number, pos: Vector, rot: Rotator): boolean;
    }
}
declare module "setup/layout/layout-quick-roller/layout-quick-roller" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutQuickRoller {
        private readonly _layout;
        constructor();
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-map-area/place-generic-home-systems" {
    /**
     * This needs the player areas to be set up first, to get the correct player
     * seat order.
     */
    export class PlaceGenericHomeSystems {
        placeOrThrow(): void;
    }
}
declare module "setup/layout/layout-all/layout-all" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutAll {
        private readonly _layout;
        constructor(playerCount: number);
        getLayout(): LayoutObjects;
    }
}
declare module "setup/layout/layout-all/scrub-all" {
    import { GameObject } from "@tabletop-playground/api";
    export function scrubAll(preserveThisObj: GameObject | undefined): void;
}
declare module "lib/start-game-lib/start-game" {
    import { IGlobal } from "ttpg-darrell";
    export class StartGame implements IGlobal {
        private readonly _onStartGameRequest;
        init(): void;
        _applyPlayerCount(): void;
        _doRemove(): void;
        _maybeFlipScoreboard(): void;
    }
}
declare module "ui/start-game-ui/start-game-ui" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class StartGameUI extends AbstractUI {
        constructor(scale: number);
    }
}
declare module "lib/start-game-lib/start-game-window" {
    import { IGlobal } from "ttpg-darrell";
    export class StartGameWindow implements IGlobal {
        init(): void;
    }
}
declare module "lib/system-lib/data/system-attachment.data" {
    import { SystemAttachmentSchemaType } from "lib/system-lib/schema/system-attachment-schema";
    export const SOURCE_TO_SYSTEM_ATTACHMENT_DATA: Record<string, Array<SystemAttachmentSchemaType>>;
}
declare module "lib/system-lib/registry/system-attachment-registry" {
    import { SystemAttachment } from "lib/system-lib/system-attachment/system-attachment";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    import { SystemAttachmentSchemaType } from "lib/system-lib/schema/system-attachment-schema";
    export class SystemAttachmentRegistry {
        private readonly _nsidToSchemaAndSource;
        private readonly _attachmentObjIdToSystemAttachment;
        private readonly _onObjectCreatedHandler;
        private readonly _onObjectDestroyedHandler;
        constructor();
        destroy(): void;
        /**
         * Add system attachments to systems.
         *
         * Init runs after setting up other objects, in this case we need system
         * registry to have loaded system data for finding by positon.
         *
         * Global takes care of calling init, but if any homebrew loads new content
         * it must also be sure to call init to attach any existing tokens.
         */
        init(): void;
        /**
         * Define new system attachment types.
         * Call init to attach to existing tokens.
         *
         * @param systemAttachmentSchemaTypes
         * @param source
         * @returns
         */
        load(sourceAndPackageId: SourceAndPackageIdSchemaType, systemAttachmentSchemaTypes: Array<SystemAttachmentSchemaType>): this;
        /**
         * Load the game data (base plus codices and expansions).
         *
         * @returns
         */
        loadDefaultData(): this;
        _maybeRewriteCardNsidName(cardNsidName: string): string;
        getAllNsids(): Array<string>;
        /**
         * Find the attachment by the linked card.
         * Only finds attachments inside a container, not loose on the table.
         *
         * @param cardNsid
         * @returns
         */
        getByCardNsid(cardNsid: string): SystemAttachment | undefined;
        /**
         * Lookup system attachment by system attachment token object nsid.
         * Duplicate tokens for the "same" attachment have separate instances.
         *
         * @param objId
         * @returns
         */
        getBySystemAttachmentObjId(objId: string): SystemAttachment | undefined;
        rawByNsid(nsid: string): SystemAttachmentSchemaType | undefined;
        rawByCardNsid(cardNsid: string): SystemAttachmentSchemaType | undefined;
    }
}
declare module "lib/system-lib/data/system.data" {
    import { SystemSchemaType } from "lib/system-lib/schema/system-schema";
    export const SOURCE_TO_SYSTEM_DATA: Record<string, Array<SystemSchemaType>>;
}
declare module "lib/system-lib/registry/system-registry" {
    import { Vector } from "@tabletop-playground/api";
    import { Planet } from "lib/system-lib/planet/planet";
    import { SystemSchemaType } from "lib/system-lib/schema/system-schema";
    import { System } from "lib/system-lib/system/system";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    /**
     * Keep system data, lookup by tile number or system tile object id.
     */
    export class SystemRegistry {
        private readonly _systemTileNumberToSchemaAndSource;
        private readonly _systemTileObjIdToSystem;
        private readonly _onObjectCreatedHandler;
        private readonly _onObjectDestroyedHandler;
        constructor();
        destroy(): void;
        /**
         * Register new systems.
         *
         * @param systems
         * @returns
         */
        load(sourceAndPackageId: SourceAndPackageIdSchemaType, systemSchemaTypes: Array<SystemSchemaType>): this;
        /**
         * Load the game data (base plus codices and expansions).
         *
         * @returns
         */
        loadDefaultData(): this;
        /**
         * Get all registered system tile numbers.
         *
         * @returns
         */
        getAllSystemTileNumbers(): Array<number>;
        getAllDraftableSystemsFilteredByConfigSources(): Array<System>;
        /**
         * Get systems for system tile objects (optionally skip contained).
         *
         * @returns
         */
        getAllSystemsWithObjs(skipContained?: boolean): Array<System>;
        /**
         * Lookup system by position.
         *
         * @param pos
         * @returns
         */
        getByPosition(pos: Vector): System | undefined;
        getBySystemTileNumber(tileNumber: number): System | undefined;
        /**
         * Lookup system by system tile object nsid.
         * Duplicate tiles for the "same" system have separate System instances.
         *
         * @param objId
         * @returns
         */
        getBySystemTileObjId(objId: string): System | undefined;
        /**
         * Get planet by planet card nsid.
         *
         * @param nsid
         * @returns
         */
        getPlanetByPlanetCardNsid(nsid: string): Planet | undefined;
        /**
         * Get all planet card NSIDs, including from missing systems
         * (e.g. home systems might not exist in the system box).
         */
        rawAllPlanetCardNsids(): Array<string>;
        /**
         * Get the raw system schema associated with the tile number.
         *
         * @param tileNumber
         * @returns
         */
        rawBySystemTileNumber(tileNumber: number): SystemSchemaType | undefined;
        /**
         * Get the registered system's system tile object NSID.
         *
         * @param tileNumber
         * @returns
         */
        tileNumberToSystemTileObjNsid(tileNumber: number): string | undefined;
    }
}
declare module "lib/tech-lib/data/tech.data" {
    import { TechSchemaType } from "lib/tech-lib/schema/tech-schema";
    export const SOURCE_TO_TECH_DATA: Record<string, Array<TechSchemaType>>;
}
declare module "lib/tech-lib/registry/tech-registry" {
    import { NsidNameSchemaType } from "lib/system-lib/schema/basic-types-schema";
    import { TechSchemaType } from "lib/tech-lib/schema/tech-schema";
    import { Tech } from "lib/tech-lib/tech/tech";
    export class TechRegistry {
        private readonly _nsidToTech;
        getAllNsids(): Array<string>;
        getAllTechs(): Array<Tech>;
        getByNsid(nsid: string): Tech | undefined;
        getByNsidNameMaybeOmegaToo(nsidName: string): Array<Tech>;
        load(source: NsidNameSchemaType, techSchemas: Array<TechSchemaType>): this;
        loadDefaultData(): this;
    }
}
declare module "lib/unit-lib/data/unit-attrs.data" {
    import { UnitAttrsSchemaType } from "lib/unit-lib/schema/unit-attrs-schema";
    export const SOURCE_TO_UNIT_ATTRS_DATA: Record<string, Array<UnitAttrsSchemaType>>;
}
declare module "lib/unit-lib/registry/unit-attrs-registry" {
    import { UnitAttrsSchemaType, UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { UnitAttrsSet } from "lib/unit-lib/unit-attrs-set/unit-attrs-set";
    export class UnitAttrsRegistry {
        private readonly _unitToBaseAttrs;
        private readonly _nsidToOverrideAttrs;
        constructor();
        defaultUnitAttrsSet(): UnitAttrsSet;
        getAllBaseAttrs(): Array<UnitAttrsSchemaType>;
        getAllNsids(): Array<string>;
        rawByUnit(unit: UnitType): UnitAttrsSchemaType | undefined;
        rawByNsid(nsid: string): UnitAttrsSchemaType | undefined;
        load(source: string, unitAttrsArray: Array<UnitAttrsSchemaType>): this;
        /**
         * Load the game data (base plus codices and expansions).
         *
         * @returns
         */
        loadDefaultData(): this;
        /**
         * Verify modifiers with tech or unit based triggers link to a known tech
         * or unit.
         *
         * @param errors
         * @returns
         */
        validate(errors: Array<string>): this;
        validateOrThrow(): this;
    }
}
declare module "lib/unit-lib/data/unit-modifiers/base/antimass-deflectors" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const AntimassDeflectors: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/bunker" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Bunker: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/cmorran-norr" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const CmorranNorr: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/conventions-of-war" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ConventionsOfWar: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/disable" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Disable: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/experimental-battlestation" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ExperimentalBattlestation: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/fighter-prototype" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const FighterPrototype: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/fourth-moon" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const FourthMoon: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/fragile" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Fragile: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/matriarch" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Matriarch: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/mirror-computing" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const MirrorComputing: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/morale-boost" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const MoraleBoost: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/munitions-reserves" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const MunitionsReserves: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/nebula-defense" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const NebulaDefense: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/plasma-scoring" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const PlasmaScoring: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/prophecy-of-ixth" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ProphecyOfIxth: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/publicize-weapon-schematics" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const PublicizeWeaponSchematics: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/regulated-conscription" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const RegulatedConscription: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/salai-sai-corian" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const SalaiSaiCorian: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/sarween-tools" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const SarweenTools: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/tekklar-legion" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const TekklarLegion: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/the-alastor" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const TheAlastor: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/base/unrelenting" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Unrelenting: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/codex-liberation/x89-bacterial-weapon" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const X89BacterialWeapon: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/codex-ordinian/blitz" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Blitz: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/codex-ordinian/war-machine" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const WarMachine: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/codex-vigil/custodia-vigilia" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const CustodiaVigilia: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/codex-vigil/xxekir-grom" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const XxekirGrom: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/2ram" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const _2ram: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/annihilator" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Annihilator: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/articles-of-war" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ArticlesOfWar: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/arvicon-rex" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ArviconRex: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/brother-omar" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const BrotherOmar: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/eidolon" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Eidolon: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/emissary-taivra" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const EmissaryTaivra: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/evelyn-delouis" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const EvelynDelouis: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/iconoclast" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Iconoclast: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/maban" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Maban: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/moll-terminus" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const MollTerminus: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/mordred" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Mordred: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/navarch-feng" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const NavarchFeng: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/quetzecoatl" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Quetzecoatl: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/rickar-rickani" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const RickarRickani: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/shield-paling" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ShieldPaling: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/strike-wing-ambuscade" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const StrikeWingAbuscade: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/supercharge" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const Supercharge: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/ta-zern" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const TaZern: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/that-which-molds-flesh" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ThatWhichMoldsFlesh: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/the-cavalry" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const TheCavalry: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/the-crown-of-thalnos" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const TheCrownOfThalnos: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/trrakan-aun-zulok" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const TrrakanAunZulok: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/ul-the-progenitor" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const UlTheProgenitor: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/viscount-unlenn" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ViscountUnlenn: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifiers/pok/visz-el-vir" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const ViszElVir: UnitModifierSchemaType;
}
declare module "lib/unit-lib/data/unit-modifier.data" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export const SOURCE_TO_UNIT_MODIFIER_DATA: Record<string, Array<UnitModifierSchemaType>>;
}
declare module "lib/unit-lib/registry/unit-modifier-registry" {
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    import { UnitModifier } from "lib/unit-lib/unit-modifier/unit-modifier";
    export class UnitModifierRegistry {
        private readonly _nsidToSchema;
        private readonly _always;
        getAllNsids(): Array<string>;
        getAllWithNsids(): Array<UnitModifier>;
        getAlways(): Array<UnitModifier>;
        getByNsid(nsid: string): UnitModifier | undefined;
        load(source: string, unitModifierSchemas: Array<UnitModifierSchemaType>): this;
        /**
         * Load the game data (base plus codices and expansions).
         *
         * @returns
         */
        loadDefaultData(): this;
        /**
         * Verify modifiers with tech or unit based triggers link to a known tech
         * or unit.
         *
         * @param errors
         * @returns
         */
        validate(errors: Array<string>): this;
        validateOrThrow(): this;
    }
}
declare module "lib/streamer-lib/use-streamer-buddy/use-streamer-buddy" {
    import { IGlobal, NamespaceId, TriggerableMulticastDelegate } from "ttpg-darrell";
    import { GameData } from "lib/game-data-lib/game-data/game-data";
    export class UseStreamerBuddy implements IGlobal {
        readonly onStreamerBuddyChanged: TriggerableMulticastDelegate<(isActive: boolean) => void>;
        private readonly _namespaceId;
        private _useStreeamerBuddy;
        readonly _onGameData: (gameData: GameData) => void;
        constructor(namespaceId: NamespaceId);
        init(): void;
        getUseStreamerBuddy(): boolean;
        setUseStreamerBuddy(useStreamerBuddy: boolean): void;
        private _load;
        private _save;
    }
}
declare module "lib/streamer-lib/whisper-spy/whisper-spy" {
    import { Player } from "@tabletop-playground/api";
    import { IGlobal, NamespaceId } from "ttpg-darrell";
    /**
     * Report whisper CONTENTS to the streamer.
     */
    export class WhisperSpy implements IGlobal {
        private readonly _namespaceId;
        private readonly _reportToPlayerNames;
        private readonly _onWhisper;
        constructor(namespaceId: NamespaceId);
        init(): void;
        /**
         * To prevent abuse, only report to unseated players.
         *
         * @param player
         */
        isLegalReportTo(player: Player): boolean;
        hasReportTo(player: Player): boolean;
        addReportTo(player: Player): void;
        removeReportTo(player: Player): void;
        private _save;
        private _load;
    }
}
declare module "locale/locale-context-menus" {
    export const LOCALE_CONTENT_MENUS: {
        [key: string]: string;
    };
}
declare module "nsid/nsid-to-template-id" {
    export const NSID_TO_TEMPLATE_ID: {
        [key: string]: string;
    };
}
declare module "global/global" {
    import { Hex, Timer, TurnOrder } from "ttpg-darrell";
    import { AllBorders } from "lib/border-lib/all-borders/all-borders";
    import { AutoStreamerCamera } from "lib/streamer-lib/auto-streamer-camera/auto-streamer-camera";
    import { Config } from "lib/config/config";
    import { FactionRegistry } from "lib/faction-lib/registry/faction-registry";
    import { GameDataUpdator } from "lib/game-data-lib/game-data-updator/game-data-updator";
    import { GlobalEvents } from "global/global-events";
    import { GoalReporter } from "lib/game-data-lib/objective-progress/goal-reporter";
    import { HideMouseCursor } from "lib/streamer-lib/hide-mouse-cursor/hide-mouse-cursor";
    import { LastGameData } from "lib/game-data-lib/last-game-data/last-game-data";
    import { PlanetAttachmentRegistry } from "lib/system-lib/registry/planet-attachment-registry";
    import { PlayerActionPhaseTime } from "lib/player-lib/player-action-phase-time/player-action-phase-time";
    import { PlayerColor } from "lib/player-lib/player-color/player-color";
    import { PlayerName } from "lib/player-lib/player-name/player-name";
    import { PlayerSeats } from "lib/player-lib/player-seats/player-seats";
    import { RemoveRegistry } from "lib/remove-lib/registry/remove-registry";
    import { SlashCommandRegistry } from "lib/slash-command-lib/slash-command-registry/slash-command-registry";
    import { SystemAttachmentRegistry } from "lib/system-lib/registry/system-attachment-registry";
    import { SystemRegistry } from "lib/system-lib/registry/system-registry";
    import { TechRegistry } from "lib/tech-lib/registry/tech-registry";
    import { UnitAttrsRegistry } from "lib/unit-lib/registry/unit-attrs-registry";
    import { UnitModifierRegistry } from "lib/unit-lib/registry/unit-modifier-registry";
    import { UseStreamerBuddy } from "lib/streamer-lib/use-streamer-buddy/use-streamer-buddy";
    import { WhisperSpy } from "lib/streamer-lib/whisper-spy/whisper-spy";
    export function registerErrorHandler(): void;
    export class TI4Class {
        readonly locale: {
            (key: string, replacement?: {
                [key: string]: string | number;
            }): string;
            inject(dict: {
                [key: string]: string;
            }): void;
        };
        readonly events: Readonly<GlobalEvents>;
        readonly autoStreamerCamera: AutoStreamerCamera;
        readonly borders: AllBorders;
        readonly config: Config;
        readonly hex: Hex;
        readonly factionRegistry: FactionRegistry;
        readonly gameDataUpdator: GameDataUpdator;
        readonly goalReporter: GoalReporter;
        readonly hideMouseCursor: HideMouseCursor;
        readonly lastGameData: LastGameData;
        readonly planetAttachmentRegistry: PlanetAttachmentRegistry;
        readonly playerActionPhaseTime: PlayerActionPhaseTime;
        readonly playerColor: PlayerColor;
        readonly playerName: PlayerName;
        readonly playerSeats: PlayerSeats;
        readonly removeRegistry: RemoveRegistry;
        readonly slashCommandRegistry: SlashCommandRegistry;
        readonly systemAttachmentRegistry: SystemAttachmentRegistry;
        readonly systemRegistry: SystemRegistry;
        readonly techRegistry: TechRegistry;
        readonly timer: Timer;
        readonly turnOrder: TurnOrder;
        readonly unitAttrsRegistry: UnitAttrsRegistry;
        readonly unitModifierRegistry: UnitModifierRegistry;
        readonly useStreamerBuddy: UseStreamerBuddy;
        readonly whisperSpy: WhisperSpy;
    }
    global {
        var TI4: TI4Class;
    }
    export function resetGlobalThisTI4(): TI4Class;
}
declare module "setup/setup-player-slot-colors/setup-player-slot-colors" {
    /**
     * Player color names in seat order, top-left to top-right
     * then bottom-left to bottom-right.
     */
    export const ALL_PLAYER_COLOR_NAMES: Array<string>;
    /**
     * Compute reworked slot colors based on these defaults, not
     * whatever the current setup is using.
     */
    export const DEFAULT_SLOT_COLORS: Array<string>;
    /**
     * Use player slots 10-18 for players.  This lets new players join without
     * accidentally taking a seated player slot, and simplifies assigning slots
     * to seats.
     */
    export class SetupPlayerSlotColors {
        setup(): void;
    }
}
declare module "nsid/nsid-to-template-id.test" {
    export function addObjectTemplatesToMockWorld(): void;
}
declare module "global/jest-setup" { }
declare module "lib/action-card-lib/deal-action-cards/deal-action-cards" {
    export class DealActionCards {
        private readonly _cardUtil;
        private readonly _find;
        private readonly _playerSeats;
        getPlayerSlotToActionCardCount(): Map<number, number>;
        /**
         * Deal action cards to players.
         *
         * @returns Set of player slots that did not receive enough cards.
         */
        dealAllActionCards(): Set<number>;
        /**
         * Deal action cards to a player.
         *
         * @param playerSlot
         * @param count
         */
        dealActionCards(playerSlot: number, count: number): boolean;
    }
}
declare module "lib/agenda-lib/reset-planet-cards/reset-planet-cards" {
    export class ResetPlanetCards {
        private readonly _cardUtil;
        reset(): void;
    }
}
declare module "lib/build-lib/build-consume" {
    import { GameObject } from "@tabletop-playground/api";
    export type BuildConsumeType = "tradegood" | "planet";
    export type BuildConsumeEntry = {
        obj: GameObject;
        type: BuildConsumeType;
        name: string;
        value: number;
    };
    export class BuildConsume {
        private readonly _entries;
        private readonly _unitModifierNames;
        constructor(objs: Array<GameObject>, unitModifierNames: Array<string>);
        getEntries(): Array<BuildConsumeEntry>;
        getTradegoodValue(): number;
        getPlanetValue(): number;
        getTotalValue(): number;
        getTotalValueWithModifiers(): string;
        report(): string;
    }
}
declare module "lib/build-lib/build-produce" {
    import { GameObject } from "@tabletop-playground/api";
    import { UnitAttrsSet } from "lib/unit-lib/unit-attrs-set/unit-attrs-set";
    import { UnitType } from "lib/unit-lib/schema/unit-attrs-schema";
    export type BuildProduceEntry = {
        obj: GameObject;
        unit: UnitType;
        count: number;
    };
    export class BuildProduce {
        private readonly _entries;
        private readonly _unitAttrsSet;
        constructor(objs: Array<GameObject>, unitAttrsSet: UnitAttrsSet);
        getCost(): number;
        getEntries(): Array<BuildProduceEntry>;
        getPlasticCount(): number;
        moveToSystemTile(systemTileObj: GameObject): void;
        report(): string;
    }
}
declare module "lib/recycle-lib/handlers/card/promissory/recycle-card-promissory" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleCardPromissory extends GarbageHandler {
        private readonly _cardUtil;
        constructor();
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/command-token-lib/add-command-tokens/add-command-tokens" {
    export class AddCommandTokens {
        private readonly _cardUtil;
        private readonly _find;
        private readonly _playerSeats;
        private readonly _recycleCardPromissory;
        getPlayerSlotToCommandTokenCount(): Map<number, number>;
        /**
         * Add command tokens for each player.
         *
         * @returns Set of player slots where not all tokens were added (too few).
         */
        addAllCommandTokens(): Set<number>;
        /**
         * Move command tokens from the container to above the command sheet.
         *
         * @param playerSlot
         * @param count
         * @returns
         */
        addCommandTokens(playerSlot: number, count: number): boolean;
    }
}
declare module "lib/homebrew-lib/homebrew-registry/homebrew-registry" {
    import { FactionSchemaType } from "lib/faction-lib/schema/faction-schema";
    import { PlanetAttachmentSchemaType } from "lib/system-lib/schema/planet-attachment-schema";
    import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
    import { SystemAttachmentSchemaType } from "lib/system-lib/schema/system-attachment-schema";
    import { SystemSchemaType } from "lib/system-lib/schema/system-schema";
    import { UnitAttrsSchemaType } from "lib/unit-lib/schema/unit-attrs-schema";
    import { UnitModifierSchemaType } from "lib/unit-lib/schema/unit-modifier-schema";
    export type HomebrewModuleType = {
        sourceAndPackageId: SourceAndPackageIdSchemaType;
        factions?: Array<FactionSchemaType>;
        systems?: Array<SystemSchemaType>;
        planetAttachments?: Array<PlanetAttachmentSchemaType>;
        systemAttachments?: Array<SystemAttachmentSchemaType>;
        unitAttrs?: Array<UnitAttrsSchemaType>;
        unitModifiers?: Array<UnitModifierSchemaType>;
        remove?: Array<string>;
    };
    /**
     * Homebrew modules register via this class.
     */
    export class HomebrewRegistry {
        load(params: HomebrewModuleType): void;
    }
}
declare module "lib/homebrew-lib/run-inject-script/run-inject-script" {
    import { Package } from "@tabletop-playground/api";
    import { IGlobal } from "ttpg-darrell";
    export const RUN_SCRIPT_NSID: string;
    /**
     * Homebrew modules can have inject scripts, run them when loaded.
     */
    export class RunInjectScript implements IGlobal {
        readonly _onPackageAdded: (pkg: Package) => void;
        init(): void;
        _maybeRunInjectScript(pkg: Package): void;
    }
}
declare module "lib/homebrew-lib/spawn-missing-cards/spawn-missing-cards" {
    import { Card } from "@tabletop-playground/api";
    /**
     * Homebrew injection may add new cards to existings decks.
     * Given a new deck nsid, add any missing cards to the corresponding deck.
     */
    export class SpawnMissingCards {
        private readonly _cardUtil;
        private readonly _find;
        static shouldSpawnMissingCards(deckNsid: string): boolean;
        spawnAndAddMissingCards(deckNsid: string): void;
        _spawnDeck(deckNsid: string): Card | undefined;
        /**
         * Decks are normally stored on snap points of `deck-${type}`
         * where cards have a `card.${type}` nsid prefix.
         *
         * @param deckNsid
         */
        _getExistingDeck(deckNsid: string): Card | undefined;
        _addMissingCards(srcDeck: Card, dstDeck: Card): void;
    }
}
declare module "lib/ready-lib/ready-lib" {
    export class ReadyLib {
        private readonly _cardUtil;
        private readonly _readyNsidPrefixes;
        readyAll(): void;
    }
}
declare module "lib/recycle-lib/handlers/card/action/recycle-card-action" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardAction extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/agenda/recycle-card-agenda" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardAgenda extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/alliance/recycle-card-alliance" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleCardAlliance extends GarbageHandler {
        private readonly _cardUtil;
        constructor();
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/card/event/recycle-card-event" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardEvent extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/exploration/cultural/recycle-card-exploration-cultural" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardExplorationCultural extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/exploration/frontier/recycle-card-exploration-frontier" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardExplorationFrontier extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/exploration/hazardous/recycle-card-exploration-hazardous" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardExplorationHazardous extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/exploration/industrial/recycle-card-exploration-industrial" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardExplorationIndustrial extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/faction-reference/recycle-card-faction-reference" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardFactionReference extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/leader/recycle-card-leader" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleCardLeader extends GarbageHandler {
        private readonly _cardUtil;
        constructor();
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/card/legendary-planet/recycle-card-legendary-planet" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardLegendaryPlanet extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/objective/stage-1/recycle-card-objective-stage-1" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardObjectiveStage1 extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/objective/stage-2/recycle-card-objective-stage-2" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardObjectiveStage2 extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/planet/recycle-card-planet" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardPlanet extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/relic/recycle-card-relic" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardRelic extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/secret/recycle-card-secret" {
    import { SimpleCardGarbageHandler } from "ttpg-darrell";
    export class RecycleCardSecret extends SimpleCardGarbageHandler {
        constructor();
    }
}
declare module "lib/recycle-lib/handlers/card/technology/recycle-card-tech" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleCardTech extends GarbageHandler {
        private readonly _find;
        constructor();
        canRecycle(obj: GameObject): boolean;
        recycle(card: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/strategy-card/recycle-strategy-card" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleStrategyCard extends GarbageHandler {
        private readonly _find;
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/system-tile/recycle-system-tile" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleSystemTile extends GarbageHandler {
        private readonly _find;
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-attachment/recycle-token-attachment" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenAttachment extends GarbageHandler {
        private readonly _find;
        constructor();
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-control/recycle-token-control" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenControl extends GarbageHandler {
        private readonly _find;
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-fighter/recycle-token-fighter" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenFighter extends GarbageHandler {
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-frontier/recycle-token-frontier" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenFrontier extends GarbageHandler {
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-infantry/recycle-token-infantry" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenInfantry extends GarbageHandler {
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/token/recycle-token-tradegood/recycle-token-tradegood" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleTokenTradegood extends GarbageHandler {
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/handlers/unit/recycle-unit" {
    import { GameObject } from "@tabletop-playground/api";
    import { GarbageHandler } from "ttpg-darrell";
    export class RecycleUnit extends GarbageHandler {
        private readonly _find;
        canRecycle(obj: GameObject): boolean;
        recycle(obj: GameObject): boolean;
    }
}
declare module "lib/recycle-lib/recycle-container/recycle-container" {
    import { GarbageContainer } from "ttpg-darrell";
    export class RecycleContainer extends GarbageContainer {
    }
}
declare module "lib/strategy-card-lib/place-tgs-unpicked/place-tgs-unpicked" {
    import { GameObject } from "@tabletop-playground/api";
    export class PlaceTgsUnpicked {
        _getUnpickedStrategyCards(): Array<GameObject>;
        _placeTradeGood(strategyCard: GameObject): boolean;
        placeTgsUnpicked(): void;
    }
}
declare module "lib/strategy-card-lib/return-strategy-card/return-strategy-card" {
    export class ReturnStrategyCard {
        private readonly _find;
        private readonly _recycleStrateydCard;
        returnAllStrategyCardsRespecingPoliticalStability(): void;
    }
}
declare module "lib/system-lib/planet/refresh-all-planets" {
    import { HexType } from "ttpg-darrell";
    export class RefreshAllPlanets {
        private readonly _cardUtil;
        _getSystemHexes(): Set<HexType>;
        /**
         * Refresh all planet cards that are not on a system hex or in a card holder.
         */
        refresh(alsoRefreshTechAgentRelic: boolean): void;
    }
}
declare module "lib/system-lib/system/system-labels" {
    import { DrawingLine } from "@tabletop-playground/api";
    import { System } from "lib/system-lib/system/system";
    import { Planet } from "lib/system-lib/planet/planet";
    export class SystemLabels {
        private static readonly SCALE;
        private readonly _system;
        private _uis;
        private _lines;
        static removePlanetLines(): void;
        static getPlanetLine(planet: Planet): DrawingLine;
        constructor(system: System);
        attach(): this;
        detach(): this;
    }
}
declare module "setup/layout/layout-player-area/layout-player-areas" {
    import { LayoutObjects } from "ttpg-darrell";
    export class LayoutPlayerAreas {
        private readonly _layout;
        constructor(playerCount: number);
        getLayout(): LayoutObjects;
    }
}
declare module "ui/button-ui/long-button-ui" {
    import { Button } from "@tabletop-playground/api";
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class LongButtonUI extends AbstractUI {
        private readonly _button;
        constructor(scaledWidth: number, scale: number);
        destroy(): void;
        getButton(): Button;
    }
}
declare module "ui/combat-ui/combat-ui-hex/combat-ui-hex" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    export class CombatUIHex extends AbstractUI {
        private readonly _canvas;
        private readonly _onSystemActivatedHandler;
        constructor(scale: number);
        destroy(): void;
        update(): void;
    }
}
declare module "ui/combat-ui/combat-ui-all/combat-ui-all" {
    import { AbstractUI } from "ui/abstract-ui/abtract-ui";
    import { PlayerSlot } from "ttpg-darrell";
    /**
     * space | hex
     * planet| planet | planet
     */
    export class CombatUIAll extends AbstractUI {
        private readonly _combatUiSpace;
        private readonly _combatUiPlanets;
        private readonly _combatUiHex;
        constructor(scale: number, playerSlot: PlayerSlot);
        destroy(): void;
    }
}
