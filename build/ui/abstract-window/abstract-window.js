"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractWindow = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * AbstractUI and Window have similar, but not identical APIs.
 * This class is a bridge from AbstractUI to Window.
 *
 * Not actually an "abstract" class, but deals in AbstractUIs.
 */
class AbstractWindow {
    static getPlayerSlotToTransform() {
        const playerSlotToTransform = {};
        for (const playerSeat of TI4.playerSeats.getAllSeats()) {
            const playerSlot = playerSeat.playerSlot;
            const pos = playerSeat.cardHolder.getPosition().add([0, 0, 4]);
            pos.x = pos.x * 0.75; // move toward middle
            const rot = new api_1.Rotator(0, 0, 0);
            playerSlotToTransform[playerSlot] = {
                pos,
                rot,
            };
        }
        return playerSlotToTransform;
    }
    constructor(createAbstractUI, namespaceId, windowTitle) {
        this._addHost = false;
        this._createAbstractUI = createAbstractUI;
        this._namespaceId = namespaceId;
        const defaultParams = {
            playerSlot: -1,
            scale: 1,
        };
        const defaultUi = createAbstractUI(defaultParams);
        const defaultSize = defaultUi.getSize();
        defaultUi.destroy();
        const windowWidgetGenerator = () => {
            return new (class {
                create(params) {
                    const abstractUiParams = {
                        playerSlot: params.playerSlot,
                        scale: params.scale,
                    };
                    this._abstractUi = createAbstractUI(abstractUiParams);
                    return this._abstractUi.getWidget();
                }
                destroy() {
                    if (this._abstractUi) {
                        this._abstractUi.destroy();
                    }
                    this._abstractUi = undefined;
                }
            })();
        };
        this._windowParams = {
            size: {
                width: defaultSize.w,
                height: defaultSize.h,
            },
            windowWidgetGenerator,
            title: windowTitle,
            defaultTarget: "screen",
            // Use u=0.814 to see turn order.
            screen: { anchor: { u: 1, v: 0 }, pos: { u: 0.97, v: 0.05 } },
            world: {
                anchor: {
                    u: 0.5,
                    v: 0.5,
                },
                playerSlotToTransform: AbstractWindow.getPlayerSlotToTransform(),
            },
        };
    }
    invalidateSize() {
        const defaultParams = {
            playerSlot: -1,
            scale: 1,
        };
        const defaultUi = this._createAbstractUI(defaultParams);
        const defaultSize = defaultUi.getSize();
        defaultUi.destroy();
        this._windowParams.size = {
            width: defaultSize.w,
            height: defaultSize.h,
        };
    }
    addHost() {
        this._addHost = true;
        return this;
    }
    getMutableWindowParams() {
        return this._windowParams;
    }
    moveWindowLeftOfTurnOrder() {
        if (this._windowParams.screen) {
            this._windowParams.screen.pos.u = 0.814;
        }
        return this;
    }
    createWindow(playerSlots) {
        if (!playerSlots) {
            playerSlots = TI4.playerSeats
                .getAllSeats()
                .map((seat) => seat.playerSlot);
        }
        // Add the host player slot.
        let host = -1;
        for (const player of api_1.world.getAllPlayers()) {
            if (player.isHost()) {
                host = player.getSlot();
                break;
            }
        }
        if (host >= 0 && !playerSlots.includes(host) && this._addHost) {
            playerSlots.push(host);
        }
        return new ttpg_darrell_1.Window(this._windowParams, playerSlots, this._namespaceId);
    }
}
exports.AbstractWindow = AbstractWindow;
//# sourceMappingURL=abstract-window.js.map