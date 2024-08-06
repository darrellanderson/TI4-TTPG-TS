import {
  CreateBoard,
  CreateBoardParams,
  ZBaseCell,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
  ZTextCell,
} from "../../../ttpg-darrell/src/index-ext";

const W: number = 220;
const H: number = 308;
const SYMBOL_SIZE: number = 200;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * H) / H_WORLD);
const DECK_EXTRA_GAP: number = SPACING; // gap + spacing on both sides

function labeledCell(labelText: string, isDeck: boolean): ZColCell {
  const slot: ZImageCell = {
    type: "ImageCell",
    width: W,
    height: H,
    imageFile: `prebuild/mat/slot/slot-portrait.jpg`,
    snapPoints: [{ tags: ["card-objective-1"] }],
  };
  if (isDeck) {
    slot.snapPoints?.[0]?.tags?.push("deck-objective-1");
  }
  const symbol: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: `prebuild/mat/slot/symbol-objective-1.png`,
  };
  const slotWithSymbol: ZCanvasCell = {
    type: "CanvasCell",
    width: W,
    height: H,
    children: [
      { left: 0, top: 0, child: slot },
      {
        left: (W - SYMBOL_SIZE) / 2,
        top: (H - SYMBOL_SIZE) / 2,
        child: symbol,
      },
    ],
  };
  const label: ZTextCell = {
    type: "TextCell",
    width: W,
    height: 24,
    text: labelText.toUpperCase(),
    textColor: "#ffffff",
    fontSize: 24,
    font: "Handel Gothic", // font installed on system
  };
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [slotWithSymbol, label],
  };
}

function gapCell(): ZBaseCell {
  return {
    type: "SolidCell",
    width: DECK_EXTRA_GAP,
    height: H,
    color: "#171717",
  };
}

function objectiveRow(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      labeledCell("Stage I", true),
      gapCell(),
      labeledCell("I", false),
      labeledCell("I", false),
      labeledCell("II", false),
      labeledCell("III", false),
      labeledCell("IV", false),
    ],
  };
}

function objectiveMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: objectiveRow(),
    background: "#171717",
  };
}

const params: CreateBoardParams = {
  templateName: "Objective 1 Mat",
  assetFilename: "mat/objective-1",
  templateMetadata: "mat:base/objective-1",
  srcImage: objectiveMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: H, world: H_WORLD },
    depth: 0.25,
  },
  preshrink: 1024,
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
