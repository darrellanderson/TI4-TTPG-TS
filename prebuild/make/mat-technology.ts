import {
  CreateBoard,
  CreateBoardParams,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
} from "../../../ttpg-darrell/src/index-ext";

const W: number = 308;
const H: number = 220;
const SYMBOL_SIZE: number = 200;

const W_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * W) / W_WORLD);

console.log("SPACING", SPACING);

function baseCell(): ZImageCell {
  return {
    type: "ImageCell",
    width: W,
    height: H,
    imageFile: "prebuild/mat/slot/slot-landscape.jpg",
    snapPoints: [{ tags: ["card-technology"] }],
  };
}

function symbolImage(symbolFile: string): ZImageCell {
  return {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: symbolFile,
  };
}

function symbolCell(symbolFile: string): ZCanvasCell {
  return {
    type: "CanvasCell",
    width: W,
    height: H,
    children: [
      {
        left: 0,
        top: 0,
        child: baseCell(),
      },
      {
        left: (W - SYMBOL_SIZE) / 2,
        top: (H - SYMBOL_SIZE) / 2,
        child: symbolImage(symbolFile),
      },
    ],
  };
}

function technologyColumn(symbolFile: string): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [baseCell(), baseCell(), baseCell(), symbolCell(symbolFile)],
  };
}

function technologyGrid(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      technologyColumn("prebuild/mat/slot/symbol-tech-blue.png"),
      technologyColumn("prebuild/mat/slot/symbol-tech-green.png"),
      technologyColumn("prebuild/mat/slot/symbol-tech-red.png"),
      technologyColumn("prebuild/mat/slot/symbol-tech-yellow.png"),
      technologyColumn("prebuild/mat/slot/symbol-tech-unit.png"),
    ],
  };
}

function technologyMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: technologyGrid(),
    background: "#171717",
  };
}

const params: CreateBoardParams = {
  templateName: "Technology Mat",
  assetFilename: "mat/technology",
  templateMetadata: "mat:base/technology",
  srcImage: technologyMat(),
  topDownWorldSize: {
    autoWidthHeight: { pixel: W, world: W_WORLD },
    depth: 0.25,
  },
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
