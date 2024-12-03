import { provide } from "./apiprovide";

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
export interface WhoamiUserInfo {
    user_id: string;
    first_name?: string;
    last_name?: string;
}

export interface PurchaseData {
    entitlements: [string];
}

export interface UserDataRequestResult {
    success: boolean;
    reason?: "userNotLoggedIn" | "generalError" | "userAborted";
}

export type FetchOptions = RequestInit & {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    retryStatusCodes?: number[];
};
export type WaitingRoomQueueDefault = "";
export type WaitingRoomQueue = WaitingRoomQueueDefault | "auth" | "checkout" | "lefty-in-app-purchase";

/**
 * Custom fetch interface which includes the possibility to customize timeouts for fetch requests
 */
export type Fetch = (input: RequestInfo, init?: FetchOptions) => Promise<Response>;
export type GetRosettaEnvByKey = (key: string) => string | undefined;
export type WaitForCapacity = (queue: WaitingRoomQueue) => Promise<void>;
export type RegisterIframeMessageListener = (eventtype: string, listener: (event: any, iframe: HTMLIFrameElement) => void) => void;

export interface WhoamiV1 {
    /**
     * will assert valid not outdated session before fetch will be done. backend credentials will be added automatically
     * an error is resolved if session is invalid and not refeshable (= user logged out)
     * Important: as of version 1.9.9 all requests are timeout after 5s by default.
     * Can be changed by adding the field timeout to the FetchOptions Interface
     */
    authorizedFetch: Fetch;
    /**
     * gives information if user is currently loggedin from ui perspective
     */
    isLoggedIn(): boolean;
    /**
     * gives information if the user is currently a C1 User. These are users which are not logged in from
     * sso/mypass perspective. These users are originated from the apps and have potentially in app purchases.
     * If this method resolves to true isLogged in will resolve to false.
     * @deprecated there is not replacement for the client planned
     */
    isC1User(): boolean;
    /**
     * gives information if the user is currently a Plenigo User. These are users which are not logged in from
     * sso/mypass perspective. These users are originated from the apps and have potentially in app purchases.
     * If this method resolves to true isLogged in will resolve to false.
     */
    isPlenigoUser(): boolean;
    /**
     * will assert valid not outdated session before promise is resolved
     * an error is resolved if session is invalid and not refeshable (= user logged out)
     */
    ensureUserHasAuthorization(): Promise<void>;

    /**
     * Ensures that the user has provided both a first name and a last name.
     * If the user has not provided these details, the function will prompt the user
     * to enter them. Depending on the `skippable` parameter, the user may be allowed
     * to skip this step.
     *
     * @param skippable - If true, the user can choose to skip providing their first name
     *                    and last name.
     * @param title - Optional. A custom title for the prompt that asks for the user's
     *                first name and last name. If not set default will be used.
     * @param text - Optional. A custom text or message to display in the prompt. If not
     *               set default will be used.
     *
     * @returns A promise that resolves to an object indicating whether the user provided
     *          the required information (`success: true`) or not, along with a `reason` if applicable.
     *          Possible reasons include "userNotLoggedIn", "error", or "userAborted".
     */
    ensureUserHasFirstNameAndLastName(skippable: boolean, title?: string, text?: string): Promise<UserDataRequestResult>;

    /**
     * Ensures that the user has opted in to a specific data collection or processing activity.
     * If the user has not opted in, the function will prompt the user to do so.
     *
     * @param optIn - A string representing the specific opt-in name.
     * This could be the new Marketing_AS_2024 or any other opt-in,
     * which are present in agreement.
     *
     * @returns A promise that resolves to an object indicating whether the user opted in
     *          successfully (`success: true`) or not, along with a `reason` if applicable.
     *          Possible reasons include "userNotLoggedIn", "generalError", or "userAborted".
     */
    ensureUserHasOptin(optIn: string): Promise<UserDataRequestResult>;
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
     * @deprecated there is not replacement for the client planned
     */
    getCustomerId(clientId: string): Promise<string>;
    /**
     * will provide unsafe purchase data
     */
    getUnsafePurchaseData(): Promise<PurchaseData>;
    /**
     * will provide users registration date if available otherwise returns null.
     * Registration date in unix timestamp.
     */
    getUnsafeRegistrationDate(): Promise<null | number>;

    /**
     * will provide jaId for logged in users, otherwise
     * @throws error
     */
    getJaId(): string;

    /**
     * will render the Wonderwall in the given container with the given props and call the callback after main functionality is done
     *
     * @param container - The HTML element in which the Wonderwall should be rendered.
     * The container should be an HTML element.
     *
     * @param {Object} props - The props that should be passed, which will be passed to the auth component.
     * @param {String} props.template - valid choices are "register" and "login"
     * @param {String} props.variant - variant of the brand that should be shown e.g bild or welt
     * @param {boolean} [props.abortable] - user can leave auth screen if true (not yet implemented)
     * @param {String} [props.loginHeadline]
     * @param {String} [props.registerHeadline]
     * @param {String} [props.loginCta]
     * @param {String} [props.registerCta]
     *
     */
    renderAuthComponent(container: HTMLElement, props: WonderwallProps): Promise<AuthRes>;
}

export interface AuthRes {
    isLoggedIn: boolean;
    message: string;
}

export type WonderwallVariant =
    | "welt"
    | "bild"
    | "bild-tv"
    | "sportbild"
    | "bild-markenshop"
    | "osp"
    | "computerbild-vip-lounge"
    | "autobild"
    | "autobild-vip-lounge"
    | "sportbild-fanmeile"
    | "lidlbild"
    | "bz";

export type WonderwallProps = {
    template: "login" | "register";
    variant: WonderwallVariant;
    abortable?: boolean;
    loginHeadline?: string;
    registerHeadline?: string;
    loginCta?: string;
    registerCta?: string;
};

export interface UtilsV1 {
    fetchWithTimeout: Fetch;
    getRosettaEnvByKey: GetRosettaEnvByKey;
    registerIframeMessageListener: RegisterIframeMessageListener;
}

export interface AbV1 {
    userInTestGroupForFeature: (key: string) => { canSeeFeature: boolean; testGroup: "A" | "B" };
}

export interface WaitingRoomV1 {
    waitForCapacity: WaitForCapacity;
}

export type ILayer = "privacy" | "reject";
export type IApp = "offerpage" | "checkout" | "cancellation";
export type ITenant = "welt" | "bild";

export interface IAccount {
    accountId: number | string;
    propertyId: number | string;
    baseEndpoint: string;
    purEntitlement: string;
    layers: {
        [key in ILayer]: number | string;
    };
}

export type IAppConfig = {
    [key in ITenant]: IAccount;
} & { urlsWithoutConsentLayer: string[] };

export type IConfig = {
    [key in IApp]: IAppConfig;
};

export interface ICligV1 {
    init: (app: IApp) => Promise<void>;
    open: (layer: ILayer) => void;
}
export type ICligV2 = (app: IApp) => Promise<{ open: (layer: ILayer) => void }>;

export function whoamiV1(): Promise<WhoamiV1> {
    return requirePackage("whoami:v1");
}

export function utilsV1(): Promise<UtilsV1> {
    return requirePackage("utils:v1");
}

export function waitingRoomV1(): Promise<WaitingRoomV1> {
    return requireApi("waiting_room:v1");
}

export function abV1(): Promise<AbV1> {
    return requirePackage("ab:v1");
}

export function CligV1(): Promise<ICligV1> {
    return requirePackage("ppclig:v1");
}

export function CligV2(): Promise<ICligV2> {
    return requirePackage("clig:v2");
}

export const provideApi = provide;
export const requireApi = requirePackage;
