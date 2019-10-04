export function provide(packageNameActual: string, packActual: any) {
    // -- START -- static loader
    let unresolvedPackages = {} as any;
    let providedPackages = {} as any;
    const loaderName = "pssmasloader";
    const loader = ((window as any)[loaderName] = (window as any)[loaderName] || {
        _: {
            u: unresolvedPackages,
            p: providedPackages
        },

        require(packageName: string, cb: any) {
            const pack = providedPackages[packageName];
            if (pack !== undefined) {
                cb(pack, null);
            } else {
                unresolvedPackages[packageName] = unresolvedPackages[packageName] || [];
                unresolvedPackages[packageName].push(cb);
            }
        }
    });
    unresolvedPackages = loader._.u;
    providedPackages = loader._.p;
    // -- END -- static loader

    const unresolvedRequires = unresolvedPackages[packageNameActual] || [];
    providedPackages[packageNameActual] = packActual;
    for (let i = 0; i < unresolvedRequires.length; i++) {
        unresolvedRequires[i](packActual, null);
    }
    return packActual;
}
