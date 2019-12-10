import { PackageInfo } from './types';
import { versionResolution } from './ver';
import { dependencies } from './npm-registry';

export default function(
  rootPkg: PackageInfo,
): { [Symbol.asyncIterator](): AsyncGenerator<PackageInfo, void, unknown> } {
  const akey = ({ name, version }: PackageInfo) => `${name}|${version}`;
  const parentInfo = (pkg: PackageInfo): PackageInfo => ({
    name: pkg.name,
    version: pkg.version,
    depth: pkg.depth || 0,
  });
  const alreadyAdded = new Set<string>().add(akey(rootPkg));

  async function* walkDependencies(
    pkg: PackageInfo,
    depth = 0,
  ): AsyncGenerator<PackageInfo> {
    yield pkg;

    for (const [name, rawVersion] of Object.entries(
      (await dependencies(pkg)) || {},
    )) {
      const to: PackageInfo = {
        name,
        rawVersion,
        version: versionResolution(rawVersion),
        depth: depth + 1,
        parent: parentInfo(depth === 0 ? rootPkg : pkg),
      };

      if (!alreadyAdded.has(akey(to))) {
        alreadyAdded.add(akey(to));
        yield* walkDependencies(to, depth + 1);
      }
    }
  }

  return {
    async *[Symbol.asyncIterator]() {
      const pkg = walkDependencies(rootPkg);
      let res;
      do {
        res = await pkg.next();
        res.value && (yield res.value);
      } while (!res.done);
    },
  };
}
