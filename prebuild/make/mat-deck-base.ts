import {
  CreateBoard,
  CreateBoardParams,
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

function labeledCell(
  labelText: string,
  symbolFile: string,
  tags: Array<string>
): ZColCell {
  const slot: ZImageCell = {
    type: "ImageCell",
    width: W,
    height: H,
    imageFile: `prebuild/mat/slot/slot-portrait.jpg`,
    snapPoints: [{ tags: tags }],
  };
  const symbol: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: symbolFile,
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

function deckGrid(): ZRowCell {
  const col1: ZColCell = {
    type: "ColCell",
    spacing: SPACING,
    children: [
      labeledCell("Secret", "prebuild/mat/slot/symbol-secret.png", [
        "deck-secret",
        "card-secret",
      ]),
      labeledCell("Planet", "prebuild/mat/slot/symbol-planet.png", [
        "deck-planet",
        "card-planet",
      ]),
    ],
  };

  const col2: ZColCell = {
    type: "ColCell",
    spacing: SPACING,
    children: [
      labeledCell("Agenda", "prebuild/mat/slot/symbol-agenda.png", [
        "deck-agenda",
        "card-agenda",
      ]),
      labeledCell("Discard", "prebuild/mat/slot/symbol-agenda.png", [
        "discard-agenda",
        "card-agenda",
      ]),
    ],
  };

  const col3: ZColCell = {
    type: "ColCell",
    spacing: SPACING,
    children: [
      labeledCell("Action", "prebuild/mat/slot/symbol-action.png", [
        "deck-action",
        "card-action",
      ]),
      labeledCell("Discard", "prebuild/mat/slot/symbol-action.png", [
        "discard-action",
        "card-action",
      ]),
    ],
  };

  return {
    type: "RowCell",
    spacing: SPACING,
    children: [col1, col2, col3],
  };
}

function deckMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: deckGrid(),
    background: "#171717",
  };
}

const params: CreateBoardParams = {
  templateName: "Base Decks Mat",
  assetFilename: "mat/deck-base",
  templateMetadata: "mat.deck:base/base",
  srcImage: deckMat(),
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
