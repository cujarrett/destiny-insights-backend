import fetch from "node-fetch"
import { getJson } from "./json.js"

export const buildWeaponWishLists = async () => {
  const cachedItems = await getJson("../data/cached-items.json")
  // eslint-disable-next-line max-len
  const rawWeaponWishListData = await fetch("https://raw.githubusercontent.com/48klocs/dim-wish-list-sources/master/voltron.txt")
  const weaponWishListData = await rawWeaponWishListData.text()

  const result = {}
  const lines = weaponWishListData.split(/\r\n|\n/)
  for (const line of lines) {
    const roll = {}
    if (line.includes("dimwishlist:item=")) {
    // eslint-disable-next-line max-len
      const weaponItemHash = line.substring(line.indexOf("dimwishlist:item=") + 17, line.indexOf("&perks="))

      const rollHashes = line.substring(line.indexOf("&perks=") + 7).split("#")[0].split(",")

      if (!result[weaponItemHash]) {
        const { name, type } = cachedItems[weaponItemHash]
        result[weaponItemHash] = {
          name,
          type,
          rolls: []
        }
      }
      roll.perkHashses = rollHashes
      result[weaponItemHash].rolls.push(roll)
    }
  }
  return result
}
