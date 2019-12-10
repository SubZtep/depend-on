import { expect } from "chai"
import { createTree } from "../src/tree"
import { PackageNode } from "../src/types"

describe("Tree dataset", () => {
  it("Test with small amount of nodes", () => {
    const version = "0.1.0"

    const tree = createTree({ name: "html", version })
    const html = tree.root
    const head = html.addChild({ name: "head", version })
    head.addChild({ name: "title", version })
    const body = html.addChild({ name: "body", version })
    const div = body.addChild({ name: "div", version })
    div.addChild({ name: "p", version })

    const node = tree.getChild({ name: "div", version })
    expect(node?.children[0]?.package.name).to.equal("p")
  })

  it("Test cb with huge amount (1m) of nodes", done => {
    const version = "0.1.0"

    const tree = createTree({ name: "test", version })
    let prevNode = tree.root
    for (let i = 0; i < 1_000_000; i++) {
      prevNode = prevNode.addChild({ name: `test${i}`, version })
    }

    tree.getChildCB({ name: "test999999", version }, (node: PackageNode | undefined) => {
      expect(node?.package?.name).to.equal("test999999")
      done()
    })
  })
})
