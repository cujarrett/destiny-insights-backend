import fs from "fs"
import { buildWeaponWishLists } from "./build-cached-weapon-wish-lists.js"

const updateWeaponWishLists = async () => {
  const cachedItems = await buildWeaponWishLists()
  const data = JSON.stringify(cachedItems, null, "  ")
  await fs.writeFileSync("./src/data/cached-weapon-wish-lists.json", data)
}

updateWeaponWishLists()
