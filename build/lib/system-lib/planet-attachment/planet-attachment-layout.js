"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanetAttachmentLayout = void 0;
const api_1 = require("@tabletop-playground/api");
const system_reserve_space_1 = require("../system/system-reserve-space");
class PlanetAttachmentLayout {
    static _getOffset(index) {
        const steps = Math.floor(index / 3);
        const extra = steps % 2 === 1 ? 0.5 : 0;
        const phi = ((index + extra) * 120 * Math.PI) / 180;
        const r = 1.58;
        return new api_1.Vector(-Math.sin(phi) * r, -Math.cos(phi) * r, 0);
    }
    layout(planet) {
        const planetPos = planet.getPosition();
        // Lift everything in the area, including attachments.
        const systemReserveSpace = new system_reserve_space_1.SystemReserveSpace(planet.getObj()).lift();
        const attachments = planet.getAttachments();
        for (let i = 0; i < attachments.length; i++) {
            const attachment = attachments[i];
            if (attachment) {
                const offset = PlanetAttachmentLayout._getOffset(i);
                const pos = planetPos.add(offset).add(new api_1.Vector(0, 0, 1));
                attachment.getObj().setPosition(pos);
                attachment.getObj().snapToGround();
                attachment.getObj().setObjectType(api_1.ObjectType.Ground);
            }
        }
        // Drop everything lifted (in bottom to top order).
        systemReserveSpace.drop();
    }
}
exports.PlanetAttachmentLayout = PlanetAttachmentLayout;
//# sourceMappingURL=planet-attachment-layout.js.map