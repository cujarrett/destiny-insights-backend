import fs from "fs"
import { buildCachedItems } from "./build-cached-items.js"

const writeCachedItems = async () => {
  const cachedItems = await buildCachedItems()
  const data = JSON.stringify(cachedItems, null, "  ")
  await fs.writeFileSync("./src/data/cached-items.json", data)
}

writeCachedItems()
