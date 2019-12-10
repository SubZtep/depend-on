import nock from "nock"
import { join } from "path"
import { expect } from "chai"
import { fetchVersions, versions, fetchDependencies, dependencies } from "../src/npm-registry"

process.env.CACHE_DIR = "./test/cache"

beforeEach(() => {
  nock(process.env.NPM_REGISTRY_BASE_URI as string)
    .get("/eslint")
    .replyWithFile(200, join(__dirname, "mocks", "eslint.json"))
  nock(process.env.NPM_REGISTRY_BASE_URI as string)
    .get("/eslint/0.0.4")
    .replyWithFile(200, join(__dirname, "mocks", "eslint_0.0.4.json"))
})

describe("Registry requests (no cache)", () => {
  it("Versions", async () => {
    expect((await fetchVersions("eslint"))?.shift()).to.equal("0.0.4")
  })
  it("Dependencies", async () => {
    expect(await fetchDependencies({ name: "eslint", version: "0.0.4" })).to.be.an("object")
  })
})

describe("Registry requests", () => {
  it("Versions", async () => {
    expect((await versions("eslint"))?.shift()).to.equal("0.0.4")
  })
  it("Dependencies", async () => {
    expect(await dependencies({ name: "eslint", version: "0.0.4" })).to.have.all.keys(
      "astw",
      "esprima",
      "jshint",
      "optimist"
    )
  })
})
