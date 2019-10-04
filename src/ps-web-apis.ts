function requireApi<T>(name: string): Promise<T> {
    // -- START -- static loader
    let unresolvedPackages = {} as any;
    let providedPackages = {} as any;
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

    return new Promise(function(resolve, reject) {
        loader.require(name, function(res: T, error: any) {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
}

export interface WhoamiV1 {
    /**
     * gives information if user is currently loggedin from ui perspective
     */
    isLoggedIn(): boolean;
    /**
     * will assert valid not outdated session before fetch will be done. backend credentials will be added automatically
     * an error is resolved if session is invalid and not refeshable (= user logged out)
     */
    authorizedFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    /**
     * will assert valid not outdated session before promise is resolved
     * an error is resolved if session is invalid and not refeshable (= user logged out)
     */
    ensureUserHasAuthorization(): Promise<void>;
    /**
     * will start login-process (e.g. go to sso-login)
     */
    doLogin(additionalParameter?: Map<String, String[]>): void;
    /**
     * will start registration-process (e.g. go to sso-register)
     */
    doRegister(additionalParameter?: Map<String, String[]>): void;
    /**
     * will start logout-process (e.g. go to sso-logout)
     */
    doLogout(additionalParameter?: Map<String, String[]>): void;
    /**
     * will update access token and therefore content entitlements to current state
     */
    forceAccessTokenRefresh(): Promise<void>;
}

export function whoamiV1(): Promise<WhoamiV1> {
    return requireApi("whoami:v1");
}
