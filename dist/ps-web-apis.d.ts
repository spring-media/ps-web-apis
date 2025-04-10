import { provide } from "./apiprovide";
declare function requirePackage<T>(name: string): Promise<T>;
export interface WhoamiUserInfo {
    user_id: string;
    first_name?: string;
    last_name?: string;
}
export interface PurchaseData {
    entitlements: string[];
}
export interface ServicePassportSuccessResponse {
    code: string;
    message: string;
    passport: string;
    expires: number;
}
export interface ServicePassportErrorResponse {
    code: string;
    message: string;
}
export declare type ServicePassportResponse = ServicePassportSuccessResponse | ServicePassportErrorResponse;
export interface UserDataRequestResult {
    success: boolean;
    reason?: "userNotLoggedIn" | "generalError" | "userAborted";
}
export declare type FetchOptions = RequestInit & {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    retryStatusCodes?: number[];
};
export declare type WaitingRoomQueueDefault = "";
export declare type WaitingRoomQueue = WaitingRoomQueueDefault | "auth" | "checkout" | "lefty-in-app-purchase" | "logora";
/**
 * Custom fetch interface which includes the possibility to customize timeouts for fetch requests
 */
export declare type Fetch = (input: RequestInfo, init?: FetchOptions) => Promise<Response>;
export declare type GetRosettaEnvByKey = (key: string) => string | undefined;
export declare type WaitForCapacity = (queue: WaitingRoomQueue) => Promise<void>;
export declare type GetUserCreditBalance = () => Promise<number>;
export declare type RegisterIframeMessageListener = (eventtype: string, listener: (event: any, iframe: HTMLIFrameElement) => void) => void;
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
     * @param {Object} config - config container object
     * @param {HTMLElement} [config.container] - The HTML element in which the Wonderwall should be rendered in. default = overlay
     * @param {boolean} [config.inlineRender] - Renders Wonderwall directly in container instead of as overlay. default = false
     * @param {Object} config.props - The props which will be passed to the Wonderwall web component.
     * @param {String} config.props.template - valid choices are "register" and "login"
     * @param {String} config.props.variant - variant of the brand that should be shown e.g bild or welt
     * @param {boolean} [config.props.abortable] - user can leave auth screen if true (not yet implemented)
     * @param {String} [config.props.loginHeadline]
     * @param {String} [config.props.registerHeadline]
     * @param {String} [config.props.loginCta]
     * @param {String} [config.props.registerCta]
     *
     */
    renderAuthComponent(config: AuthComponentConfig): Promise<AuthRes>;
    /**
     * Retrieves a service passport for the specified service.
     * The passport is intended to be used for authenticated communication with the service.
     *
     * @param service - The identifier or type of the service for which the passport is requested.
     *                  Use "logora" or a custom service identifier as a string.
     *
     * @returns A promise that resolves to a ServicePassportResponse containing the token and related details.
     */
    getServicePassport(service: "logora" | string): Promise<ServicePassportResponse>;
}
export interface AuthRes {
    isLoggedIn: boolean;
    message: string;
}
export declare type WonderwallVariant = "welt" | "bild" | "bild-tv" | "sportbild" | "bild-markenshop" | "osp" | "computerbild-vip-lounge" | "autobild" | "autobild-vip-lounge" | "sportbild-fanmeile" | "lidlbild" | "bz";
export declare type WonderwallProps = {
    template: "login" | "register";
    variant: WonderwallVariant;
    abortable?: boolean;
    loginHeadline?: string;
    registerHeadline?: string;
    loginCta?: string;
    registerCta?: string;
};
export interface AuthComponentConfig {
    container?: HTMLElement;
    inlineRender?: boolean;
    props: WonderwallProps;
}
export interface UtilsV1 {
    fetchWithTimeout: Fetch;
    getRosettaEnvByKey: GetRosettaEnvByKey;
    getOverwritableRosettaEnvByKey: GetRosettaEnvByKey;
    registerIframeMessageListener: RegisterIframeMessageListener;
}
export interface AbV1 {
    userInTestGroupForFeature: (key: string) => {
        canSeeFeature: boolean;
        testGroup: "A" | "B";
    };
}
export interface WaitingRoomV1 {
    waitForCapacity: WaitForCapacity;
}
export interface WalletV1 {
    getUserCreditBalance: GetUserCreditBalance;
}
export declare type ILayer = "privacy" | "reject";
export declare type IApp = "offerpage" | "checkout" | "cancellation";
export declare type ITenant = "welt" | "bild";
export interface IAccount {
    accountId: number | string;
    propertyId: number | string;
    baseEndpoint: string;
    purEntitlement: string;
    layers: {
        [key in ILayer]: number | string;
    };
}
export declare type IAppConfig = {
    [key in ITenant]: IAccount;
} & {
    urlsWithoutConsentLayer: string[];
};
export declare type IConfig = {
    [key in IApp]: IAppConfig;
};
export interface ICligV1 {
    init: (app: IApp) => Promise<void>;
    open: (layer: ILayer) => void;
}
export declare type ICligV2 = (app: IApp) => Promise<{
    open: (layer: ILayer) => void;
}>;
export declare function whoamiV1(): Promise<WhoamiV1>;
export declare function utilsV1(): Promise<UtilsV1>;
export declare function waitingRoomV1(): Promise<WaitingRoomV1>;
export declare function abV1(): Promise<AbV1>;
export declare function walletV1(): Promise<WalletV1>;
export declare function CligV1(): Promise<ICligV1>;
export declare function CligV2(): Promise<ICligV2>;
export declare const provideApi: typeof provide;
export declare const requireApi: typeof requirePackage;
export {};
