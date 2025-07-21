"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ttpg_mock_1 = require("ttpg-mock");
const game_data_updator_1 = require("../game-data-updator/game-data-updator");
const game_data_export_1 = require("./game-data-export");
it("constructor/init/destroy", () => {
    const gameDataExport = new game_data_export_1.GameDataExport();
    gameDataExport.init();
    gameDataExport.destroy();
});
it("onGameEnd/onGameData", () => {
    // fetch(url: string, options?: FetchOptions): Promise<FetchResponse>
    jest.spyOn(global, "fetch").mockImplementation();
    ttpg_mock_1.mockWorld._addPlayer(new ttpg_mock_1.MockPlayer());
    ttpg_mock_1.mockWorld._addPlayer(new ttpg_mock_1.MockPlayer());
    TI4.config.setTimestamp(1);
    const gameDataExport = new game_data_export_1.GameDataExport();
    gameDataExport.init();
    TI4.events.onGameEnd.trigger();
    const gameData = game_data_updator_1.GameDataUpdator.createGameData();
    TI4.events.onGameData.trigger(gameData);
    gameDataExport.destroy();
});
it("interval", () => {
    jest.useFakeTimers();
    const gameDataExport = new game_data_export_1.GameDataExport();
    gameDataExport.init();
    gameDataExport._maybeStartInterval("real");
    jest.runOnlyPendingTimers();
    gameDataExport.destroy();
});
//# sourceMappingURL=game-data-export.test.js.map