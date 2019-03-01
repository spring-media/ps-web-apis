import sinon from 'sinon';
import {whoamiV1, WhoamiV1} from '../src/ps-web-apis'

describe('whoami-api loader', () => {
    it('uses preexisting require to get the api if necessary', async () => {
        // given
        const fakeApi = {} as WhoamiV1;
        (global as any).window = {
            pssmasloader: {
                require(name: string, cb: any) {
                    expect(name).toBe('whoami:v1');
                    cb(fakeApi, null)
                }
            }
        }
        
        // when
        const api = await whoamiV1();

        // then
        expect(api).toBe(fakeApi);
    })

    it('throws promise correctly should an error occur', async () => {
        // given
        const err = new Error('moep moep');
        (global as any).window = {
            pssmasloader: {
                require(name: string, cb: any) {
                    cb(null, err)
                }
            }
        }
        
        // when
        expect(whoamiV1())
        // then
            .rejects.toBe(err)
    })


    it('installs its own require in the loader should that not exist yet and register itself into the unresolved package pile', async () => {
        // given
        const fakeApi = {} as WhoamiV1;
        const window : any = (global as any).window = {}
        
        // when: requesting the API
        const pendingWhoamiApi = whoamiV1();

        // then:
        expect(window.pssmasloader.require).toBeDefined();
        expect(window.pssmasloader._.u).toBeDefined();
        expect(window.pssmasloader._.u['whoami:v1']).toBeDefined();
        expect(window.pssmasloader._.u['whoami:v1'].length).toBe(1);
        expect(window.pssmasloader._.p).toBeDefined();

        // and when: someone then provides the unresolved package
        window.pssmasloader._.u['whoami:v1'][0](fakeApi, null)

        // then: the promise resolved
        expect(await pendingWhoamiApi).toBe(fakeApi);
    })

    it('installs its own loader that is able to queue unresolved packages', () => {
        // given
        const fakeApi = {} as WhoamiV1;
        const window : any = (global as any).window = {}
        
        // when: requesting the API
        whoamiV1();

        // and when: 3rd party services uses the require functionality again
        const fooCb = () => {}
        window.pssmasloader.require('fooservice:v1', fooCb)

        // then
        expect(window.pssmasloader._.u['fooservice:v1']).toEqual([fooCb]);
    })

    it('installs its own loader that is able to load provided packages', () => {
        // given
        const fooApi = {};
        const window : any = (global as any).window = {}
        
        // when: requesting the API
        whoamiV1();


        // and when: service is registered
        window.pssmasloader._.p['fooservice:v1'] = fooApi;

        // and when: 3rd party services uses the require functionality again
        const requireCb = sinon.spy();
        window.pssmasloader.require('fooservice:v1', requireCb)

        sinon.assert.calledWith(requireCb, fooApi, null)
    })


})