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
      p: providedPackages,
    },
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
export type FetchOptions = RequestInit & { timeout?: number };
export type WaitingRoomQueueDefault = "";
export type WaitingRoomQueue = WaitingRoomQueueDefault | "auth" | "checkout";

/**
 * Custom fetch interface which includes the possibility to customize timeouts for fetch requests
 */
export type Fetch = (
  input: RequestInfo,
  init?: FetchOptions
) => Promise<Response>;
export type GetRosettaEnvByKey = (key: string) => string | undefined;
export type WaitForCapacity = (queue: WaitingRoomQueue) => Promise<void>;

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
}

export interface UtilsV1 {
  fetchWithTimeout: Fetch;
  getRosettaEnvByKey: GetRosettaEnvByKey;
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

export function CligV1(): Promise<ICligV1> {
  return requirePackage("ppclig:v1");
}

export function CligV2(): Promise<ICligV2> {
  return requirePackage("clig:v2");
}

export const provideApi = provide;
export const requireApi = requirePackage;
