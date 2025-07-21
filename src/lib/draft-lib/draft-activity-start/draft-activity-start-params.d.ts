import { NamespaceId } from "ttpg-darrell";
import { IDraft } from "../drafts/idraft";
export declare const DRAFT_NAMESPACE_ID: NamespaceId;
export type DraftActivityStartParams = {
    namespaceId: NamespaceId;
    draft: IDraft;
    numSlices: number;
    numFactions: number;
    config: string;
    onStart?: () => void;
};
