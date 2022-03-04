import { readFile } from "fs/promises"

export const getJson = async (path) => {
  const json = JSON.parse(
    await readFile(
      new URL(path, import.meta.url)
    )
  )
  return json
}
