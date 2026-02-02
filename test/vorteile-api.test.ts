import { vorteileV1, VorteileV1 } from "../src/ps-web-apis";

describe("vorteile-api loader", () => {
    it("uses preexisting require to get the api if necessary", async () => {
        // given
        const fakeApi = {} as VorteileV1;
        (global as any).window = {
            pssmasloader: {
                require(name: string, cb: any) {
                    expect(name).toBe("vorteile:v1");
                    cb(fakeApi, null);
                }
            }
        };

        // when
        const api = await vorteileV1();

        // then
        expect(api).toBe(fakeApi);
    });

    it("throws promise correctly should an error occur", async () => {
        // given
        const err = new Error("vorteile error");
        (global as any).window = {
            pssmasloader: {
                require(name: string, cb: any) {
                    cb(null, err);
                }
            }
        };

        // when
        expect(vorteileV1())
            // then
            .rejects.toBe(err);
    });

    it("installs its own require in the loader should that not exist yet and register itself into the unresolved package pile", async () => {
        // given
        const fakeApi = {} as VorteileV1;
        const window: any = ((global as any).window = {});

        // when: requesting the API
        const pendingVorteileApi = vorteileV1();

        // then:
        expect(window.pssmasloader.require).toBeDefined();
        expect(window.pssmasloader._.u).toBeDefined();
        expect(window.pssmasloader._.u["vorteile:v1"]).toBeDefined();
        expect(window.pssmasloader._.u["vorteile:v1"].length).toBe(1);
        expect(window.pssmasloader._.p).toBeDefined();

        // and when: someone then provides the unresolved package
        window.pssmasloader._.u["vorteile:v1"][0](fakeApi, null);

        // then: the promise resolved
        expect(await pendingVorteileApi).toBe(fakeApi);
    });
});
