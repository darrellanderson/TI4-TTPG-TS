import { NamespaceId } from "ttpg-darrell";
import { IDraft } from "../drafts/idraft";

export const DRAFT_NAMESPACE_ID: NamespaceId = "@ti4/draft";

export type DraftActivityStartParams = {
  namespaceId: NamespaceId;
  draft: IDraft;
  numSlices: number;
  numFactions: number;
  config: string;

  // Optional on-start setup.
  onStart?: () => void;
};
