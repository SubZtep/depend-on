import nock from "nock"
import { join } from "path"
import signale from "signale"
import { expect } from "chai"
import dependOn from "../src/depend-on"
import { PackageInfo } from "../src/types"

describe("Depend-on async iterator", () => {
  beforeEach(() => {
    const packages = [
      "roarr/2.14.6",
      "boolean/3.0.0",
      "detect-node/2.0.4",
      "globalthis/1.0.0",
      "define-properties/1.1.2",
      "foreach/2.0.5",
      "object-keys/1.0.8",
      "function-bind/1.1.1",
      "object-keys/1.0.12",
      "json-stringify-safe/5.0.1",
      "semver-compare/1.0.0",
      "sprintf-js/1.1.2"
    ]
    for (const pkg of packages) {
      nock(process.env.NPM_REGISTRY_BASE_URI as string)
        .get(`/${pkg}`)
        .replyWithFile(200, join(__dirname, "mocks", `${pkg.replace("/", "_")}.json`))
    }
  })

  it("Dependencies count", async () => {
    const rootPkg: PackageInfo = {
      name: "roarr",
      version: "2.14.6"
    }

    const realRows = []
    for await (const pkg of dependOn(rootPkg)) {
      const row = `${"> ".repeat(pkg.depth || 0)}${pkg.name} (${pkg.version})`
      signale.info(row)
      realRows.push(row)
    }

    expect(realRows).to.have.lengthOf(12)
  })
})
