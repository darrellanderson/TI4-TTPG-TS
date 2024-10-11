import {
  CreateBoard,
  CreateBoardParams,
  ZCanvasCell,
  ZColCell,
  ZImageCell,
  ZPaddedCell,
  ZRowCell,
} from "../../../ttpg-darrell/src/index-ext";

const W: number = 220;
const H: number = 308;
const SYMBOL_SIZE: number = 200;

const H_WORLD: number = 6.3;
const SPACING: number = Math.round((0.5 * H) / H_WORLD);

function baseCell(): ZImageCell {
  return {
    type: "ImageCell",
    width: W,
    height: H,
    imageFile: "prebuild/mat/slot/slot-portrait.jpg",
    snapPoints: [{ tags: ["card-planet"] }],
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

function planetColumn(symbolFile?: string): ZColCell {
  return {
    type: "ColCell",
    spacing: SPACING,
    children: [
      baseCell(),
      baseCell(),
      baseCell(),
      symbolFile ? symbolCell(symbolFile) : baseCell(),
    ],
  };
}

function planetGrid(): ZRowCell {
  return {
    type: "RowCell",
    spacing: SPACING,
    children: [
      planetColumn("prebuild/mat/slot/symbol-planet.png"),
      planetColumn(),
      planetColumn(),
      planetColumn(),
      planetColumn(), // add an extra column than old version
    ],
  };
}

function planetMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: planetGrid(),
    background: "#171717",
  };
}

const params: CreateBoardParams = {
  templateName: "Player Planet Mat",
  assetFilename: "mat/player-planet",
  templateMetadata: "mat.player:base/planet",
  scriptName: "obj/planet-mat.js",
  srcImage: planetMat(),
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
