module.exports.getCategories = (categories) => {
  console.log("getCategories called")
  // Normally, the last item in the array holds the mods but if Banshee-44 has a
  // seasonal quest it goes to end until picked up.
  const lastItem = categories[categories.length - 1].itemIndexes

  if (lastItem.length > 1) {
    const [firstCategory, secondCategory] = lastItem
    return [firstCategory, secondCategory]
  } else {
    const secondToLastItem = categories[categories.length - 2].itemIndexes
    const [firstCategory, secondCategory] = secondToLastItem
    return [firstCategory, secondCategory]
  }
}
