export interface WhoamiUserInfo {
    user_id: string;
    first_name?: string;
    last_name?: string;
}
export interface WhoamiV1 {
    /**
     * will assert valid not outdated session before fetch will be done. backend credentials will be added automatically
     * an error is resolved if session is invalid and not refeshable (= user logged out)
     */
    authorizedFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    /**
     * gives information if user is currently loggedin from ui perspective
     */
    isLoggedIn(): boolean;
    /**
     * will assert valid not outdated session before promise is resolved
     * an error is resolved if session is invalid and not refeshable (= user logged out)
     */
    ensureUserHasAuthorization(): Promise<void>;
    /**
     * will start login-process (e.g. go to sso-login)
     */
    doLogin(additionalParameter?: Map<string, string[]>): void;
    /**
     * will start registration-process (e.g. go to sso-register)
     */
    doRegister(additionalParameter?: Map<string, string[]>): void;
    /**
     * will start logout-process (e.g. go to sso-logout)
     */
    doLogout(additionalParameter?: Map<string, string[]>): void;
    /**
     * will start logout-process and redirect user to portal homepage afterwards (e.g. go to sso-logout)
     */
    doLogoutToHome(additionalParameter?: Map<string, string[]>): void;
    /**
     * will update access token and therefore content entitlements to current state
     */
    forceAccessTokenRefresh(): Promise<void>;
    /**
     * will request userinfo from whoami backend
     * @return {WhoamiUserInfo} some relevant userdata
     */
    getUserInfo(): Promise<WhoamiUserInfo>;
    /**
     * will request customer pseudo id for currently logged user from consent backend
     * @param clientId The string identifier of the client for which the customer id is requested.
     */
    getCustomerId(clientId: string): Promise<string>;
}
export declare function whoamiV1(): Promise<WhoamiV1>;
