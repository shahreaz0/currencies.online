import { cacheLife, cacheTag } from "next/cache"
import { countries } from "./data"

export async function getCachedCountries() {
  "use cache"
  cacheLife("hours")
  cacheTag("countries")
  return countries
}

export async function getCachedCountry(id: string) {
  "use cache"
  cacheLife("hours")
  cacheTag("countries", `country-${id}`)
  return countries.find((c) => c.id === id)
}
