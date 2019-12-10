import semver from "semver"
import { VERSION } from "./constants"

/**
 * Parse dependency version string to find an exact version.
 * @param versionString A version in various formats
 * @returns Valid version number
 */
export const versionResolution = (versionString: string) => {
  if (versionString === VERSION.ALWAYS_EXISTS) {
    return VERSION.ALWAYS_EXISTS
  }

  //FIXME: Doublecheck semver result for insufficient versioning
  //       https://registry.npmjs.org/nopt/3.0.1
  //       https://registry.npmjs.org/abbrev
  https: const ver = semver.valid(versionString)
  if (ver) {
    return ver
  }

  //FIXME: Get all existing versions and user the most satisfying one.
  //       Or test already fetched version to save requests.
  let range: semver.Range | undefined
  try {
    range = new semver.Range(versionString)
  } catch {
    range = undefined
  }
  if (range) {
    const minVer = semver.minVersion(range) // might not exist
    if (minVer) {
      const format = minVer.format()
      if (format !== "0.0.0") {
        return format
      }
    }
  }

  return VERSION.ALWAYS_EXISTS
}
