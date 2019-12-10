/**\
 ** dependency graph can have circulations,
 ** better to be a tree
\**/
import { PackageInfo, PackageNode, PackageTree } from "./types"

export const createNode = (pkg: PackageInfo): PackageNode => {
  const children: PackageNode[] = []

  return {
    package: pkg,
    children,
    addChild(childPkg: PackageInfo): PackageNode {
      const childNode = createNode(childPkg)
      children.push(childNode)
      return childNode
    }
  }
}

export const createTree = (rootPackage: PackageInfo): PackageTree => {
  const root = createNode(rootPackage)

  return {
    root,

    getChildCB({ name, version }: PackageInfo, cb: (node?: PackageNode) => void) {
      let child: PackageNode | undefined
      const traverse = (node?: PackageNode, depth = 0) => {
        if (node?.package.name === name && node?.package.version === version) {
          child = node
        }
        if (!child) {
          for (const n of node?.children || []) {
            setImmediate(() => traverse(n, depth + 1))
          }
        }
        if (child) {
          cb(child)
        }
      }
      traverse(root)
    },

    getChild({ name, version }: PackageInfo): PackageNode | undefined {
      let child: PackageNode | undefined
      const traverse = (node: PackageNode, depth = 0) => {
        if (node.package.name === name && node.package.version === version) {
          child = node
        }
        if (!child) {
          node.children.forEach(n => traverse(n, depth + 1))
        }
      }
      traverse(root)
      return child
    },

    print() {
      const rows: string[] = []
      const traverse = (node: PackageNode, depth = 0) => {
        rows.push(
          `${"-> ".repeat(node.package.depth || 0)}${node.package.name} (${node.package.version})`
        )
        node.children.forEach(n => traverse(n, depth + 1))
      }
      traverse(root)
      return rows.join("\n")
    }
  }
}
