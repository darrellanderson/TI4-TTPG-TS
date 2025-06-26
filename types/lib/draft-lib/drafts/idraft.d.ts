import { NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
export interface IDraft {
    isEnabled(): boolean;
    getDraftName(): string;
    getGenerateSlicesParams(): GenerateSlicesParams;
    createEmptyDraftState(namespaceId: NamespaceId): DraftState;
}
