/**\
 ** Simple native webserver that serve API and Webpage for display dependencies.
\**/
import url from "url"
import http from "http"
import signale from "signale"
import dependOn from "./depend-on"
import { createTree } from "./tree"
import { PackageInfo, PackageTree } from "./types"
require("dotenv").config()

const responseFormHTML = (name: string, version: string) =>
  `<form class="w-full max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mx-auto">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Package Name</label>
      <input type="text" id="name" value="${name}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <label for="name" class="block text-gray-700 text-sm font-bold mb-2 mt-6">Package Version</label>
      <input type="text" id="version" value="${version}" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <input type="button" id="btn" value="Get Dependency Tree" class="cursor-pointer mt-8 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
    </form>
    <script>
    (function() {
      document.getElementById("btn").addEventListener("click", function() {
        document.location = "/" + document.getElementById("name").value + "/" + document.getElementById("version").value
      })
    })()
    </script>`

const responseTreeHTML = async (name: string, version: string) => {
  signale.time("Start")

  const rootPkg: PackageInfo = {
    name,
    version
  }

  let tree: PackageTree
  for await (const pkg of dependOn(rootPkg)) {
    if (!pkg.depth) {
      tree = createTree(rootPkg)
    } else if (pkg.depth === 1) {
      tree!.root.addChild(pkg)
    } else {
      // @ts-ignore
      tree.getChild(pkg?.parent)?.addChild(pkg)
    }
  }

  signale.timeEnd()
  // @ts-ignore
  return `<pre class="mx-auto max-w-lg bg-gray-400 shadow-md rounded px-8 py-6 mb-6">${tree?.print()}</pre>`
}

http
  .createServer(async (req, res: http.ServerResponse) => {
    res.writeHead(200, { "Content-Type": "text/html" })

    const reqPath = url.parse(req.url || "").path || ""
    const [name, version] =
      reqPath.length > 1 ? reqPath.split("/").filter(Boolean) : ["roarr", "2.14.6"]

    let html = `<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
      <div class="container mx-auto bg-gray-200 py-6">`
    if (/^\/\S+/.test(reqPath)) {
      html += await responseTreeHTML(name, version)
    }
    html += responseFormHTML(name, version)
    html += `</div>`
    res.end(html)
  })
  .listen(process.env.SERVER_PORT)
