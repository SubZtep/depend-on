import { expect } from "chai"
import { VERSION } from "../src/constants"
import { versionResolution } from "../src/ver"

describe("Semantic version resolution", () => {
  it("Exact", () => {
    expect(versionResolution("")).to.equal(VERSION.ALWAYS_EXISTS)
    expect(versionResolution("1.2.3")).to.equal("1.2.3")
    expect(versionResolution("^1.2.3")).to.equal("1.2.3")
    expect(versionResolution("~1.2.3")).to.equal("1.2.3")
    expect(versionResolution("latest")).to.equal(VERSION.ALWAYS_EXISTS)
  })
  it("Range", () => {
    expect(versionResolution(">=1.2.3")).to.equal("1.2.3")
    expect(versionResolution(">1.2.3")).to.equal("1.2.4")
    expect(versionResolution("<=1.2.3")).to.equal(VERSION.ALWAYS_EXISTS)
    expect(versionResolution("<1.2.3")).to.equal(VERSION.ALWAYS_EXISTS)
    expect(versionResolution("^2 <2.2 || > 2.3")).to.equal("2.0.0")
  })
})
