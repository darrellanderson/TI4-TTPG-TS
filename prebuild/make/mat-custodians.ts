import {
  CreateBoard,
  CreateBoardParams,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZTextCell,
} from "../../../ttpg-darrell/src/index-ext";

const TOKEN_SIZE_WORLD: number = 5.08;
const TOKEN_SIZE: number = Math.round(TOKEN_SIZE_WORLD * (308 / 6.3));
const SYMBOL_SIZE: number = 200;
const SPACING: number = Math.round((0.5 * TOKEN_SIZE) / TOKEN_SIZE_WORLD);
const COLOR: string = "#171717";

function getSymbolCell(): ZCanvasCell {
  const symbolCell: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: "prebuild/mat/slot/symbol-custodians.png",
    snapPoints: [{ tags: ["token-custodians"] }],
  };
  return {
    type: "CanvasCell",
    width: TOKEN_SIZE,
    height: TOKEN_SIZE,
    children: [
      {
        left: (TOKEN_SIZE - SYMBOL_SIZE) / 2,
        top: (TOKEN_SIZE - SYMBOL_SIZE) / 2,
        child: symbolCell,
      },
    ],
  };
}

function getLabel(labelText: string): ZTextCell {
  return {
    type: "TextCell",
    width: TOKEN_SIZE,
    height: 24,
    text: labelText.toUpperCase(),
    textColor: "#ffffff",
    fontSize: 24,
    font: "Handel Gothic", // font installed on system
  };
}

function getGrid(): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [getSymbolCell(), getLabel("Custodians")],
  };
}

function getMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: getGrid(),
    background: COLOR,
  };
}

const params: CreateBoardParams = {
  templateName: "Custodians Mat",
  assetFilename: "mat/custodians",
  templateMetadata: "mat:base/custodians",
  srcImage: getMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: TOKEN_SIZE, world: TOKEN_SIZE_WORLD },
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
