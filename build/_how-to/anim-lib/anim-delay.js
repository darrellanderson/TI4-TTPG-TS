"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimDelay = void 0;
class AnimDelay {
    static simple(msecs) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, msecs);
        });
    }
}
exports.AnimDelay = AnimDelay;
//# sourceMappingURL=anim-delay.js.map