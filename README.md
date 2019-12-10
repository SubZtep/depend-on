# dependOn _t.e._ 📡

## Installation

1. Run `npm install` on the project directory
2. Make `cache` and `test/cache` folders writable

## Run It

1. Run `$ npm run serve` for server

2. Open browser http://localhost:1337

   - Open, e.g. http://localhost:1337/roarr/2.14.6 load dependency tree immediately although server-side rendering makes it slow.

## Code Example

```js
import dependOn from "./depend-on"
import { PkgInfo } from "./types"

const rootPkg: PkgInfo = {
  name: "roarr",
  version: "2.14.6"
}

for await (const pkg of dependOn(rootPkg)) {
  //TODO: do something
}
```

## Available Commands

```bash
# Run tests
$ npm run test

# Run http server (port in .env)
$ npm run serve
```

```bash
# Build project
$ npm run build

# Run project in debug mode
$ npm run debug

# Run ESLint
$ npm run lint

# Run ESLint with auto fix
$ npm run lint:fix

# Run ESLint with auto fix and reformat source code
$ npm run lint:fix:snyk
```

---
