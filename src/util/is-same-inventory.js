module.exports.isSameInventory = async (currentItems, doubleCheckedItems) => {
  console.log("isSameInventory called")
  let sameItemsFound = true
  const doubleCheckedItemsNames = doubleCheckedItems.map((value) => value.name)

  for (const currentItem of currentItems) {
    if (!doubleCheckedItemsNames.includes(currentItem.name)) {
      sameItemsFound = false
    }
  }
  return sameItemsFound
}
