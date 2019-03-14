function requireApi<T>(name: string) : Promise<T> {
    // -- START -- static loader
    let unresolvedPackages = {} as any;
    let providedPackages = {} as any;
    const loaderName = 'pssmasloader';
    // set or reuse existing loader implementation
    const loader = (window as any)[loaderName] = (window as any)[loaderName] || {         
        // Requires packageName and returns it via callback 
        require(packageName: string, cb: any) {
            const pack = providedPackages[packageName];
            if (pack !== undefined) {
                // -- will callback directly if required functionality was already provided
                cb(pack, null)
            } else {
                // -- will queue callbacks if required functionality is not yet available
                unresolvedPackages[packageName] = unresolvedPackages[packageName] || []
                unresolvedPackages[packageName].push(cb)
            }
        },

        // private state
        _: {
            u: unresolvedPackages,
            p: providedPackages,
        }
    }
    // -- END -- static loader

    return new Promise(function(resolve, reject) {
        loader.require(name, function(res: T, error: any) {
            if (error) {
                reject(error)
            } else {
                resolve(res)
            }
        })
    })
}

export interface WhoamiV1 {
    isLoggedIn: () => boolean
    doLogin: () => string
    doRegister: () => string

}

export function whoamiV1() : Promise<WhoamiV1> {
    return requireApi('whoami:v1');
}
