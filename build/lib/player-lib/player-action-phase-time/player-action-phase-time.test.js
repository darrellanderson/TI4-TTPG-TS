"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ttpg_mock_1 = require("ttpg-mock");
const player_action_phase_time_1 = require("./player-action-phase-time");
it("constructor/init/destroy", () => {
    const playerActionPhaseTime = new player_action_phase_time_1.PlayerActionPhaseTime(undefined);
    playerActionPhaseTime._maybeStartInterval("definitely-real");
    playerActionPhaseTime.init();
    playerActionPhaseTime.destroy();
});
it("event, interval", () => {
    new ttpg_mock_1.MockCardHolder({
        templateMetadata: "card-holder:base/player-hand",
        owningPlayerSlot: 10,
    });
    const timerValue = 0;
    const timerDirection = 1;
    TI4.timer.start(timerValue, timerDirection);
    expect(TI4.timer.export().active).toBe(true);
    TI4.turnOrder.setTurnOrder([10], "forward", 10);
    const playerActionPhaseTime = new player_action_phase_time_1.PlayerActionPhaseTime("@test/test");
    playerActionPhaseTime.init();
    expect(playerActionPhaseTime.isActiveActionPhase()).toBe(false);
    const gameData = {
        round: 1,
        players: [{ strategyCards: ["1", "2", "3", "4", "5", "6"] }],
    };
    TI4.events.onGameData.trigger(gameData);
    TI4.events.onGameData.trigger(gameData); // again
    expect(playerActionPhaseTime.getRound()).toBe(1);
    expect(playerActionPhaseTime.isActiveActionPhase()).toBe(true);
    expect(playerActionPhaseTime.getSeconds(1, 0)).toBe(0);
    playerActionPhaseTime._onInterval();
    playerActionPhaseTime._onInterval(); // again
    expect(playerActionPhaseTime.isActiveActionPhase()).toBe(true);
    expect(playerActionPhaseTime.getSeconds(1, 0)).toBe(2);
    // Again with a < 5 player count.
    TI4.config.setPlayerCount(4);
    TI4.events.onGameData.trigger(gameData);
    // Also send an empty event.
    const emptyGameData = { players: [] };
    TI4.events.onGameData.trigger(emptyGameData);
    expect(playerActionPhaseTime.isActiveActionPhase()).toBe(false);
    playerActionPhaseTime.destroy();
    TI4.timer.stop();
    // Reload with same namespaceId.
    const playerActionPhaseTime2 = new player_action_phase_time_1.PlayerActionPhaseTime("@test/test");
    expect(playerActionPhaseTime2.getSeconds(1, 0)).toBe(2);
});
//# sourceMappingURL=player-action-phase-time.test.js.map