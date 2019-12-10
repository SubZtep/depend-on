import signale from "signale"
import req from "request-promise"
import flatCache from "flat-cache"
import { VERSION } from "./constants"
import { versionResolution } from "./ver"
import { CachedDependencies, PackageInfo } from "./types"
require("dotenv").config()

/**
 * Get dependency list from npm registry.
 * @param pkg Package name and resulted version
 * @returns Packages with name and raw version
 */
export const fetchDependencies = async (
  pkg: PackageInfo
): Promise<CachedDependencies | undefined> => {
  const uri = `${process.env.NPM_REGISTRY_BASE_URI}/${pkg.name}/${versionResolution(pkg.version)}`
  try {
    signale.debug(`Request ${uri}`)
    return (await req({ uri, json: true }))?.dependencies || {}
  } catch (err) {
    signale.error(`${err.message} [ ${pkg.name} - ${uri} ]`)
  }
}

/**
 * Fetch all available versions of a package from npm registry
 * @param name package name
 * @returns version list
 */
export const fetchVersions = async (name: string): Promise<string[] | undefined> => {
  const uri = `${process.env.NPM_REGISTRY_BASE_URI}/${name}`
  let deps: string[] | undefined
  try {
    signale.debug(`Request ${uri}`)
    const res = await req({ uri, json: true })
    if (res) {
      deps = Object.keys(res.versions)
    }
  } catch (err) {
    signale.error(`${err.message} - ${uri}`)
  }
  return deps
}

/**
 * Get all version numbers of a package
 * @param package package name
 * @param forceUpdate skip cache reading
 * @returns versions
 */
export const versions = async (
  name: string,
  forceUpdate = false
): Promise<string[] | undefined> => {
  const cache = flatCache.load(`versions`, process.env.CACHE_DIR)
  let versions: string[] | undefined

  if (!forceUpdate) {
    versions = cache.getKey(name)
    if (versions !== undefined) {
      return versions
    }
  }

  versions = await fetchVersions(name)
  if (versions !== undefined && cache) {
    cache.setKey(name, versions)
    cache.save()
  }
  return versions
}

/**
 * Get (non-recursive non-dev) dependencies of a package
 * @param pkg package name and version
 * @returns dependencies object { name: version }
 */
export const dependencies = async (
  pkg: PackageInfo,
  forceUpdate = false
): Promise<CachedDependencies | undefined> => {
  const cache = flatCache.load(`dependencies`, process.env.CACHE_DIR)
  let { name, version } = pkg
  // FIXME: Find out how to handle package names with `/`
  // eg. @babel/code-frame, https://registry.npmjs.org/@types/color-name/latest
  name.includes("/") && (name = pkg.name.split("/").pop() || name)
  version = versionResolution(version)
  const cacheKey = `${name}|${version}`
  let deps: CachedDependencies | undefined

  if (!forceUpdate) {
    deps = cache.getKey(cacheKey)
    if (deps !== undefined) {
      return deps
    }
  }

  deps = await fetchDependencies({ name, version })
  if (version !== VERSION.ALWAYS_EXISTS && deps !== undefined && cache) {
    cache.setKey(cacheKey, deps)
    cache.save(true)
  }
  return deps
}
