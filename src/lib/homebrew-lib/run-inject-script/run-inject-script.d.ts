import { Package } from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";
export declare const RUN_SCRIPT_NSID: string;
/**
 * Homebrew modules can have inject scripts, run them when loaded.
 */
export declare class RunInjectScript implements IGlobal {
    readonly _onPackageAdded: (pkg: Package) => void;
    init(): void;
    _maybeRunInjectScript(pkg: Package): void;
}
