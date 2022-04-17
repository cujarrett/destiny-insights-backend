import fs from "fs"
import { buildCachedMods } from "./build-cached-mods.js"

const updateCachedMods = async () => {
  const cachedMods = await buildCachedMods()
  const data = JSON.stringify(cachedMods, null, "  ")
  await fs.writeFileSync("./src/data/cached-mods.json", data)
}

updateCachedMods()
