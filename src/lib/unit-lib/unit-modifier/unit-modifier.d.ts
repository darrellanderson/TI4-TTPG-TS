import { CombatRoll } from "../../combat-lib/combat-roll/combat-roll";
import { UnitModifierOwnerType, UnitModifierPriorityType, UnitModifierSchemaType, UnitModifierTriggerType } from "../schema/unit-modifier-schema";
import { NsidNameSchemaType } from "../../system-lib/schema/basic-types-schema";
export declare class UnitModifier {
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
