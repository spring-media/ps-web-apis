export function provide(packageName: string, pack: any) {
    // -- START -- static loader
    let unresolvedPackages = {} as any;
    let providedPackages = {} as any;
    const loaderName = 'pssmasloader';
    const loader = (window as any)[loaderName] = (window as any)[loaderName] || {
        _: {
            u: unresolvedPackages,
            p: providedPackages,
        },

        require(packageName: string, cb: any) {
            const pack = providedPackages[packageName];
            if (pack !== undefined) {
                cb(pack, null)
            } else {
                unresolvedPackages[packageName] = unresolvedPackages[packageName] || []
                unresolvedPackages[packageName].push(cb)
            }
        },
    }
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
