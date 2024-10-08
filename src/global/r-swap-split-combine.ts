import { IGlobal, SwapSplitCombine } from "ttpg-darrell";

export class RSwapSplitCombine extends SwapSplitCombine implements IGlobal {
  constructor() {
    super([
      {
        src: {
          nsids: ["token:base/infantry-1", "unit:base/infantry"],
          count: 3,
        },
        dst: { nsid: "token:base/infantry-3", count: 1 },
        repeat: true,
      },
      {
        src: { nsids: ["token:base/fighter-1", "unit:base/fighter"], count: 3 },
        dst: { nsid: "token:base/fighter-3", count: 1 },
        repeat: true,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-1"], count: 3 },
        dst: { nsid: "token:base/tradegood-commodity-3", count: 1 },
        requireFaceUp: true,
        repeat: true,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-1"], count: 3 },
        dst: { nsid: "token:base/tradegood-commodity-3", count: 1 },
        requireFaceDown: true,
        repeat: true,
      },
      {
        src: { nsids: ["token:base/infantry-3"], count: 1 },
        dst: { nsid: "token:base/infantry-1", count: 3 },
        repeat: false,
      },
      {
        src: { nsids: ["token:base/fighter-3"], count: 1 },
        dst: { nsid: "token:base/fighter-1", count: 3 },
        repeat: false,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-3"], count: 1 },
        dst: { nsid: "token:base/tradegood-commodity-1", count: 3 },
        requireFaceUp: true,
        repeat: false,
      },
      {
        src: { nsids: ["token:base/tradegood-commodity-3"], count: 1 },
        dst: { nsid: "token:base/tradegood-commodity-1", count: 3 },
        requireFaceDown: true,
        repeat: false,
      },
    ]);
  }
}
