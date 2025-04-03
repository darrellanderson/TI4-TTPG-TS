import { UseStreamerBuddy } from "./use-streamer-buddy";

it("constructor/init", () => {
  const useStreamerBuddy = new UseStreamerBuddy("@test/test");
  useStreamerBuddy.init();
});

it("set/get", () => {
  const useStreamerBuddy = new UseStreamerBuddy("@test/test");
  useStreamerBuddy.init();

  expect(useStreamerBuddy.getUseStreamerBuddy()).toBe(false);
  useStreamerBuddy.setUseStreamerBuddy(true);
  expect(useStreamerBuddy.getUseStreamerBuddy()).toBe(true);

  const loadFromState = new UseStreamerBuddy("@test/test");
  loadFromState.init();
  expect(loadFromState.getUseStreamerBuddy()).toBe(true);

  useStreamerBuddy.setUseStreamerBuddy(false);
});

it("_intervalRunnable", () => {
  const useStreamerBuddy = new UseStreamerBuddy("@test/test");
  useStreamerBuddy.init();
  useStreamerBuddy._intervalRunnable();
});
