function provide(packageName, pack) {
    // -- START -- static loader
    var unresolvedPackages = {};
    var providedPackages = {};
    var loaderName = 'pssmasloader';
    var loader = window[loaderName] = window[loaderName] || {
        _: {
            u: unresolvedPackages,
            p: providedPackages,
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
        },
    };
    unresolvedPackages = loader._.u;
    providedPackages = loader._.p;
    // -- END -- static loader
    var unresolvedRequires = unresolvedPackages[packageName] || [];
    providedPackages[packageName] = pack;
    for (var i = 0; i < unresolvedRequires.length; i++) {
        unresolvedRequires[i](pack, null);
    }
    return pack;
}

export { provide };
