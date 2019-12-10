export interface CachedDependencies {
  [key: string]: string
}

/** Exact package identifier. */
export interface PackageInfo {
  name: string
  version: string
  rawVersion?: string
  parent?: PackageInfo
  depth?: number
}

export interface PackageNode {
  package: PackageInfo
  children: PackageNode[]
  addChild(childPkg: PackageInfo): PackageNode
}

export interface PackageTree {
  root: PackageNode
  getChildCB({ name, version }: PackageInfo, cb: (node?: PackageNode) => void): void
  getChild({ name, version }: PackageInfo): PackageNode | undefined
  print(): string
}
