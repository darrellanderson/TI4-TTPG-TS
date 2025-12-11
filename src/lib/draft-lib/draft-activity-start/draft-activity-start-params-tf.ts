import { NamespaceId } from "ttpg-darrell";
import { IDraft } from "../drafts/idraft";

export const DRAFT_NAMESPACE_ID_TF: NamespaceId = "@ti4/draft-tf";

export type DraftActivityStartParamsTF = {
  namespaceId: NamespaceId;
  draft: IDraft;
  numSlices: number;
  numFactions: number;
  config: string;
  useFactionsOnTable?: boolean;
  countdownHours?: number;

  // Optional on-start setup.
  onStart?: () => void;
};
