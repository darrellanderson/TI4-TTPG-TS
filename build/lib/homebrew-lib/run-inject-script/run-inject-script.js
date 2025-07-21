"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunInjectScript = exports.RUN_SCRIPT_NSID = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
// Script must be bound to an object, spawn one of these to host it.
exports.RUN_SCRIPT_NSID = "unit:base/carrier";
/**
 * Homebrew modules can have inject scripts, run them when loaded.
 */
class RunInjectScript {
    constructor() {
        this._onPackageAdded = (pkg) => {
            this._maybeRunInjectScript(pkg);
        };
    }
    init() {
        api_1.globalEvents.onPackageAdded.add(this._onPackageAdded);
        for (const pkg of api_1.world.getAllowedPackages()) {
            this._maybeRunInjectScript(pkg);
        }
    }
    _maybeRunInjectScript(pkg) {
        pkg.getScriptFiles().forEach((scriptFile) => {
            if (scriptFile === "inject.js" || scriptFile.endsWith("/inject.js")) {
                console.log(`Running "${scriptFile}" script for package: ${pkg.getName()}`);
                // If the script is inject.js, run it.
                // Create a new object, set the script to this, delete next frame.
                const obj = ttpg_darrell_1.Spawn.spawn(exports.RUN_SCRIPT_NSID, [0, 0, -100]);
                if (obj) {
                    obj.setObjectType(api_1.ObjectType.NonInteractive);
                    process.nextTick(() => {
                        // Wait a frame to set the script, otherwise it runs twice.
                        obj.setScript(scriptFile, pkg.getUniqueId());
                        ttpg_darrell_1.DeletedItemsContainer.destroyWithoutCopying(obj);
                    });
                }
            }
        });
    }
}
exports.RunInjectScript = RunInjectScript;
//# sourceMappingURL=run-inject-script.js.map