import { MockGameObject } from "ttpg-mock";
import { SystemReserveSpace } from "./system-reserve-space";

it("constructor", () => {
  const systemTileObj = new MockGameObject();
  new SystemReserveSpace(systemTileObj);
});

it("lift/drop", () => {
  const systemTileObj = new MockGameObject();
  new MockGameObject(); // other object
  new MockGameObject(); // other object
  new SystemReserveSpace(systemTileObj).lift().drop();
});
