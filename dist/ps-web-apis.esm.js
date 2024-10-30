function provide(packageNameActual, packActual) {
    // -- START -- static loader
    var unresolvedPackages = {};
    var providedPackages = {};
    var loaderName = "pssmasloader";
    var loader = (window[loaderName] = window[loaderName] || {
        _: {
            u: unresolvedPackages,
            p: providedPackages
        },
        require: function (packageName, cb) {
            var pack = providedPackages[packageName];
            if (pack !== undefined) {
                cb(pack, null);
            }
            else {
                unresolvedPackages[packageName] = unresolvedPackages[packageName] || [];
                unresolvedPackages[packageName].push(cb);
            }
        }
    });
    unresolvedPackages = loader._.u;
    providedPackages = loader._.p;
    // -- END -- static loader
    var unresolvedRequires = unresolvedPackages[packageNameActual] || [];
    providedPackages[packageNameActual] = packActual;
    for (var i = 0; i < unresolvedRequires.length; i++) {
        unresolvedRequires[i](packActual, null);
    }
    return packActual;
}

function requirePackage(name) {
    // -- START -- static loader
    var unresolvedPackages = {};
    var providedPackages = {};
    var loaderName = "pssmasloader";
    // set or reuse existing loader implementation
    var loader = (window[loaderName] = window[loaderName] || {
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
            p: providedPackages
        }
    });
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
    return requirePackage("whoami:v1");
}
function utilsV1() {
    return requirePackage("utils:v1");
}
function waitingRoomV1() {
    return requireApi("waiting_room:v1");
}
function abV1() {
    return requirePackage("ab:v1");
}
function CligV1() {
    return requirePackage("ppclig:v1");
}
function CligV2() {
    return requirePackage("clig:v2");
}
var provideApi = provide;
var requireApi = requirePackage;

export { CligV1, CligV2, abV1, provideApi, requireApi, utilsV1, waitingRoomV1, whoamiV1 };
