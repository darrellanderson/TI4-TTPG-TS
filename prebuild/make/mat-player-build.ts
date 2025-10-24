import {
  ZCanvasCell,
  ZImageCell,
  ZPaddedCell,
} from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/image/cell/cell-parser/cell-schema";
import { CreateBoardParams } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board-params";
import { CreateBoard } from "../../node_modules/ttpg-darrell/build/cjs/lib-ext/create-assets/create-board/create-board";

const MAT_W_WORLD: number = 18.4;
const MAT_H_WORLD: number = 18.4;

const MAT_W: number = 512;
const MAT_H: number = 512;
const SYMBOL_SIZE: number = 200;

const SPACING: number = Math.round((0.5 * MAT_H) / MAT_H_WORLD);

function getGrid(): ZCanvasCell {
  const symbolCell: ZImageCell = {
    type: "ImageCell",
    width: SYMBOL_SIZE,
    height: SYMBOL_SIZE,
    imageFile: "prebuild/mat/slot/symbol-build.png",
  };
  return {
    type: "CanvasCell",
    width: MAT_W,
    height: MAT_H,
    children: [
      {
        left: (MAT_W - SYMBOL_SIZE) / 2,
        top: (MAT_H - SYMBOL_SIZE) / 2,
        child: symbolCell,
      },
    ],
  };
}

function getMat(): ZPaddedCell {
  return {
    type: "PaddedCell",
    padding: SPACING,
    child: getGrid(),
    background: "#171717",
  };
}
const params: CreateBoardParams = {
  templateName: "Player Build Mat",
  assetFilename: "mat/player-build",
  scriptName: "obj/build-area.js",
  templateMetadata: "mat.player:base/build",
  srcImage: getMat(),
  topDownWorldSize: {
    width: MAT_W_WORLD,
    height: MAT_H_WORLD,
    depth: 0.25,
  },
  preshrink: 512,
};

async function go() {
  const createBoard = new CreateBoard(params);
  await createBoard.clean();
  await createBoard.writeFiles();
}
go();
