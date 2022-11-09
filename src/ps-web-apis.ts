import { provide } from "./apiprovide";
import { UtilsV1, WhoamiV1 } from "./types/whoami";
import { ICligV1 } from "./types/clig";

function requirePackage<T>(name: string): Promise<T> {
    // -- START -- static loader
    const unresolvedPackages = {} as any;
    const providedPackages = {} as any;
    const loaderName = "pssmasloader";
    // set or reuse existing loader implementation
    const loader = ((window as any)[loaderName] = (window as any)[loaderName] || {
        // Requires packageName and returns it via callback
        require(packageName: string, cb: any) {
            const pack = providedPackages[packageName];
            if (pack !== undefined) {
                // -- will callback directly if required functionality was already provided
                cb(pack, null);
            } else {
                // -- will queue callbacks if required functionality is not yet available
                unresolvedPackages[packageName] = unresolvedPackages[packageName] || [];
                unresolvedPackages[packageName].push(cb);
            }
        },

        // private state
        _: {
            u: unresolvedPackages,
            p: providedPackages
        }
    });
    // -- END -- static loader

    return new Promise((resolve, reject) => {
        loader.require(name, (res: T, error: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
}

export function whoamiV1(): Promise<WhoamiV1> {
    return requirePackage("whoami:v1");
}

export function utilsV1(): Promise<UtilsV1> {
    return requirePackage("utils:v1");
}

export function CligV1(): Promise<ICligV1> {
    return requirePackage("clig:v1");
}

export const provideApi = provide;
export const requireApi = requirePackage;
