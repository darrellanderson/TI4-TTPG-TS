import { NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import {
  GenerateSlices,
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { ParseSlices } from "../parse/parse-slices";
import { ParseLabels } from "../parse/parse-labels";
import { Faction } from "lib/faction-lib/faction/faction";
import { ParseFactions } from "../parse/parse-factions";
import { GenerateFactions } from "../generate-factions/generate-factions";

export type CreateDraftParams = {
  namespaceId: NamespaceId;
  numSlices: number;
  numFactions: number;
  config: string;
};

export abstract class AbstractDraft {
  abstract getGenerateSlicesParams(): GenerateSlicesParams;
  abstract createEmptyDraftState(namespaceId: NamespaceId): DraftState;

  createDraftState(
    params: CreateDraftParams,
    errors: Array<string>
  ): DraftState {
    const draftState: DraftState = this.createEmptyDraftState(
      params.namespaceId
    );

    // Slices.
    const sliceSize: number = draftState.getSliceShape(-1).length - 1;
    let slices: Array<SliceTiles> | undefined;
    slices = new ParseSlices(sliceSize).parseSlices(params.config, errors);
    if (slices === undefined) {
      const generateSlicesParams: GenerateSlicesParams =
        this.getGenerateSlicesParams();
      slices = new GenerateSlices(generateSlicesParams).generateSlices(
        params.numSlices
      );
    }
    draftState.setSlices(slices);

    // Slice labels.
    const labels: Array<string> | undefined = new ParseLabels().parseLabels(
      params.config
    );
    if (labels !== undefined) {
      draftState.setSliceLabels(labels);
    }

    // Factions.
    let factions: Array<Faction> | undefined =
      new ParseFactions().parseFactions(params.config, errors);
    if (factions === undefined) {
      factions = new GenerateFactions().generate(params.numFactions);
    }
    draftState.setFactions(factions);

    const speakerIndex: number = Math.floor(
      Math.random() * TI4.config.playerCount
    );
    draftState.setSpeakerIndex(speakerIndex);

    return draftState;
  }
}
