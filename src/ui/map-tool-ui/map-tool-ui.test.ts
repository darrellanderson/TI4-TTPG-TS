import { MapToolUI } from "./map-tool-ui";

it("constructor", () => {
  const scale: number = 1;
  const mapToolUI = new MapToolUI(scale);
  expect(mapToolUI).toBeDefined();
});
