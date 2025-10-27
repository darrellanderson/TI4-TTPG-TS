import { MockGameObject } from "ttpg-mock";
import { MapStringSave } from "./map-string-save";

it("constructor", () => {
  new MapStringSave();
});

it("mecatol center", () => {
  new MockGameObject({ templateMetadata: "tile.system:thunders-edge/112" });
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("");
});

it("custom center", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/19" });
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("{19}");
});

it("custom center (side and rot)", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/19",
    rotation: [0, 60, 180],
  });
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("{19B1}");
});

it("custom center (off-map)", () => {
  new MockGameObject({ templateMetadata: "tile.system:pok/82" });
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("");
});

it("custom center (too far away)", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/19",
    position: [200, 0, 0],
  });
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("");
});

it("custom center (generic home)", () => {
  new MockGameObject({
    templateMetadata: "tile.system:base/1",
    rotation: [0, 60, 180],
  });
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("{0}");
});

it("map string (empty slot)", () => {
  new MockGameObject({ templateMetadata: "tile.system:base/1" }).setPosition(
    TI4.hex.toPosition("<1,0,-1>")
  );
  new MockGameObject({ templateMetadata: "tile.system:base/1" }).setPosition(
    TI4.hex.toPosition("<-1,0,1>")
  );
  const mapString: string = new MapStringSave().save();
  expect(mapString).toEqual("{-1} 1 -1 -1 1");
});
