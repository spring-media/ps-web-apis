import sinon from "sinon";

import { provide } from "../src/apiprovide";
describe("apiprovide", () => {
    it("puts provided api in the provided pile (own loader)", () => {
        // given
        const fakeApi = {} as any;
        const window: any = ((global as any).window = {});

        // when: providing the API
        provide("whoareyou", fakeApi);

        // then
        expect(window.pssmasloader._.p["whoareyou"]).toEqual(fakeApi);
    });

    it("puts provided api in the provided pile (3rd party loader)", () => {
        // given
        const fakeApi = {} as any;
        const window: any = ((global as any).window = {
            pssmasloader: {
                _: {
                    p: {},
                    u: {}
                }
            }
        });
        const providedPackagesPile = window.pssmasloader._.p;

        // when: providing the API
        provide("whoareyou", fakeApi);

        // then
        expect(window.pssmasloader._.p["whoareyou"]).toEqual(fakeApi);
        expect(providedPackagesPile).toEqual(window.pssmasloader._.p);
    });

    it("calls up unresolved requires previous to providing", () => {
        // given
        const fakeApi = {} as any;
        const whoareYouRequest = sinon.spy();
        const whoareYouRequest2 = sinon.spy();
        (global as any).window = {
            pssmasloader: {
                _: {
                    p: {},
                    u: {
                        whoareyou: [whoareYouRequest, whoareYouRequest2]
                    }
                }
            }
        };

        // when: providing the API
        provide("whoareyou", fakeApi);

        // then
        sinon.assert.calledWith(whoareYouRequest, fakeApi, null);
        sinon.assert.calledWith(whoareYouRequest2, fakeApi, null);
    });

    it("installs its own loader that is able to queue unresolved packages", () => {
        // given
        const window: any = ((global as any).window = {});

        // when: providing the API
        provide("whoareyou", {});

        // and when: 3rd party services uses the require functionality again
        const fooCb = () => {};
        window.pssmasloader.require("fooservice:v1", fooCb);

        // then
        expect(window.pssmasloader._.u["fooservice:v1"]).toEqual([fooCb]);
    });

    it("installs its own loader that is able to load provided packages", () => {
        // given
        const fooApi = {};
        const window: any = ((global as any).window = {});

        // when: providing the API
        provide("whoareyou", {});

        // and when: service is registered
        window.pssmasloader._.p["fooservice:v1"] = fooApi;

        // and when: 3rd party services uses the require functionality again
        const requireCb = sinon.spy();
        window.pssmasloader.require("fooservice:v1", requireCb);

        sinon.assert.calledWith(requireCb, fooApi, null);
    });
});
