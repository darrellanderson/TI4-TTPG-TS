import { Container } from "@tabletop-playground/api";
import { RecycleContainer } from "./recycle-container";
import { MockContainer } from "ttpg-mock";

it("constructor", () => {
  const container: Container = new MockContainer();
  new RecycleContainer(container);
});
