import { Card, GameObject, Player } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
import { Planet } from "../../../lib/system-lib/planet/planet";
import { System } from "../../../lib/system-lib/system/system";
import { TraitSchemaType } from "../../../lib/system-lib/schema/basic-types-schema";
export declare class RightClickExplore implements IGlobal {
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
