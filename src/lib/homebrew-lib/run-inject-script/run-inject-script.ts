import {
  GameObject,
  globalEvents,
  ObjectType,
  Package,
  world,
} from "@tabletop-playground/api";
import { DeletedItemsContainer, IGlobal } from "ttpg-darrell";

// Script must be bound to an object, spawn one of these to host it.
export const RUN_SCRIPT_NSID: string = "unit:base/carrier";

/**
 * Homebrew modules can have inject scripts, run them when loaded.
 */
export class RunInjectScript implements IGlobal {
  readonly _onPackageAdded = (pkg: Package): void => {
    this._maybeRunInjectScript(pkg);
  };

  init(): void {
    globalEvents.onPackageAdded.add(this._onPackageAdded);
    for (const pkg of world.getAllowedPackages()) {
      this._maybeRunInjectScript(pkg);
    }
  }

  _maybeRunInjectScript(pkg: Package): void {
    pkg.getScriptFiles().forEach((scriptFile: string) => {
      if (scriptFile === "inject.js" || scriptFile.endsWith("/inject.js")) {
        console.log(
          `Running "${scriptFile}" script for package: ${pkg.getName()}`
        );

        // If the script is inject.js, run it.
        // Create a new object, set the script to this, delete next frame.
        const obj: GameObject | undefined = TI4.spawn.spawn(
          RUN_SCRIPT_NSID,
          [0, 0, -100]
        );
        if (obj) {
          obj.setObjectType(ObjectType.NonInteractive);
          process.nextTick(() => {
            // Wait a frame to set the script, otherwise it runs twice.
            obj.setScript(scriptFile, pkg.getUniqueId());
            DeletedItemsContainer.destroyWithoutCopying(obj);
          });
        }
      }
    });
  }
}
