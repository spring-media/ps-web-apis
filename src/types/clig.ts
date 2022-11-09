export type ILayer = "privacy" | "reject";
export type IApp = "offerpage" | "checkout";
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

export type ICligV1 = (app: IApp) => Promise<{ open: (layer: ILayer) => void }>;
