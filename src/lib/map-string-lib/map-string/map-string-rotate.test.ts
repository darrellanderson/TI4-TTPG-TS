import { MapStringRotate } from "./map-string-rotate";

it("should rotate a map string 180 degrees", () => {
  const mapStringBefore: string = "1 2 3 4 5 6";
  const mapStringAfter: string = new MapStringRotate().rotate(mapStringBefore);
  expect(mapStringAfter).toBe("{112} 4 5 6 1 2 3");
});
