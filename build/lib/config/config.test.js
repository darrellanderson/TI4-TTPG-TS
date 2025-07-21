"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const config_1 = require("./config");
it("constructor", () => {
    new config_1.Config("@config/test");
});
it("save/restore", () => {
    let config;
    let json;
    json = api_1.world.getSavedData("@config/test");
    expect(json).toBeUndefined();
    // First use.
    config = new config_1.Config("@config/test");
    expect(config.playerCount).toBe(6);
    expect(config.gamePoints).toBe(10);
    expect(config.timestamp).toBe(0);
    expect(config.sources).toContain("pok");
    expect(config.exportGameData).toBe(true);
    expect(config.reportErrors).toBe(true);
    config.setPlayerCount(3);
    config.setGamePoints(14);
    config.setSources(["base", "pok"]);
    config.setTimestamp(1234567890);
    config.setExportGameData(false);
    config.setReportErrors(false);
    expect(config.playerCount).toBe(3);
    expect(config.gamePoints).toBe(14);
    expect(config.timestamp).toBe(1234567890);
    expect(config.sources).toContain("base");
    expect(config.exportGameData).toBe(false);
    expect(config.reportErrors).toBe(false);
    json = api_1.world.getSavedData("@config/test");
    expect(json).toBe('{"exportGameData":false,"gamePoints":14,"playerCount":3,"reportErrors":false,"sources":["base","pok"],"timestamp":1234567890}');
    // Recreate from saved data.
    config = new config_1.Config("@config/test");
    expect(config.playerCount).toBe(3);
    expect(config.timestamp).toBe(1234567890);
});
//# sourceMappingURL=config.test.js.map