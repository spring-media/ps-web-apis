export interface WhoamiV1 {
    isLoggedIn: () => boolean;
}
export declare function whoamiV1(): Promise<WhoamiV1>;
