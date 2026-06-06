import { cacheLife, cacheTag } from "next/cache"
import { getCountriesFromApi } from "./countries-api"

export async function getCachedCountries() {
  "use cache"
  cacheLife("hours")
  cacheTag("countries")
  return getCountriesFromApi()
}

export async function getCachedCountry(id: string) {
  "use cache"
  cacheLife("hours")
  cacheTag("countries", `country-${id}`)
  const allCountries = await getCachedCountries()
  return allCountries.find((c) => c.id === id)
}
