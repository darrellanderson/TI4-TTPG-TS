import { Rotator, Vector } from "@tabletop-playground/api";
import { NamespaceId, Window, WindowParams } from "ttpg-darrell";
import { AbstractUI } from "../abstract-ui/abtract-ui";
export type CreateAbstractUIParams = {
    playerSlot: number;
    scale: number;
};
export type CreateAbstractUIType = (params: CreateAbstractUIParams) => AbstractUI;
/**
 * AbstractUI and Window have similar, but not identical APIs.
 * This class is a bridge from AbstractUI to Window.
 *
 * Not actually an "abstract" class, but deals in AbstractUIs.
 */
export declare class AbstractWindow {
    private readonly _createAbstractUI;
    private readonly _namespaceId;
    private readonly _windowParams;
    private _addHost;
    static getPlayerSlotToTransform(): {
        [key: number]: {
            pos: [x: number, y: number, z: number] | Vector;
            rot: [pitch: number, yaw: number, roll: number] | Rotator;
        };
    };
    constructor(createAbstractUI: CreateAbstractUIType, namespaceId: NamespaceId | undefined, windowTitle: string);
    invalidateSize(): void;
    addHost(): this;
    getMutableWindowParams(): WindowParams;
    moveWindowLeftOfTurnOrder(): this;
    createWindow(playerSlots?: Array<number>): Window;
}
