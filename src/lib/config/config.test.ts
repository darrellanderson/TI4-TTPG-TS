import { world } from "@tabletop-playground/api";
import { Config } from "./config";

it("constructor", () => {
  new Config("@config/test");
});

it("save/restore", () => {
  let config: Config;
  let json: string | undefined;

  json = world.getSavedData("@config/test");
  expect(json).toBeUndefined();

  // First use.
  config = new Config("@config/test");
  expect(config.playerCount).toBe(6);
  expect(config.timestamp).toBe(0);

  config.setPlayerCount(3);
  config.setSources(["base", "pok"]);
  config.setTimestamp(1234567890);
  expect(config.playerCount).toBe(3);
  expect(config.timestamp).toBe(1234567890);

  json = world.getSavedData("@config/test");
  expect(json).toBe(
    '{"playerCount":3,"sources":["base","pok"],"timestamp":1234567890}'
  );

  // Recreate from saved data.
  config = new Config("@config/test");
  expect(config.playerCount).toBe(3);
  expect(config.timestamp).toBe(1234567890);
});
