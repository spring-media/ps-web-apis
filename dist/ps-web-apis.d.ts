export interface WhoamiV1 {
    /**
     * gives information if user is currently loggedin from ui perspective
    */
    isLoggedIn(): boolean;
    /**
     * fn will be called after the state changed from logged to logged out or vice versa
     */
    onStateChange(fn: () => void): void;
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
export declare function whoamiV1(): Promise<WhoamiV1>;
