module.exports.getLastSoldMessge = (modSales) => {
  console.log("getLastSoldMessge called")
  if (modSales.length > 0) {
    // eslint-disable-next-line newline-per-chained-call
    return new Date(modSales[0]).toISOString().split("T")[0]
  } else {
    return "Not sold in the last year"
  }
}
