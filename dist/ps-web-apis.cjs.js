'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function requireApi(name) {
    // -- START -- static loader
    var unresolvedPackages = {};
    var providedPackages = {};
    var loaderName = 'pssmasloader';
    // set or reuse existing loader implementation
    var loader = window[loaderName] = window[loaderName] || {
        // Requires packageName and returns it via callback 
        require: function (packageName, cb) {
            var pack = providedPackages[packageName];
            if (pack !== undefined) {
                // -- will callback directly if required functionality was already provided
                cb(pack, null);
            }
            else {
                // -- will queue callbacks if required functionality is not yet available
                unresolvedPackages[packageName] = unresolvedPackages[packageName] || [];
                unresolvedPackages[packageName].push(cb);
            }
        },
        // private state
        _: {
            u: unresolvedPackages,
            p: providedPackages,
        }
    };
    // -- END -- static loader
    return new Promise(function (resolve, reject) {
        loader.require(name, function (res, error) {
            if (error) {
                reject(error);
            }
            else {
                resolve(res);
            }
        });
    });
}
function whoamiV1() {
    return requireApi('whoami:v1');
}

exports.whoamiV1 = whoamiV1;
