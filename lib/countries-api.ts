import { type Country, countries as staticCountries } from "./data"

function slugify(name: string) {
  let slug = name
    .toLowerCase()
    .normalize("NFD") // Split accented characters into base and accent
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Deduplicate hyphens

  // Map to align with static data overrides
  if (slug === "turkiye") {
    slug = "turkey"
  }
  return slug
}

function formatPopulation(pop: number) {
  if (pop >= 1_000_000_000) {
    return `${(pop / 1_000_000_000).toFixed(1)} billion`
  }
  if (pop >= 1_000_000) {
    return `${(pop / 1_000_000).toFixed(1)} million`
  }
  return pop.toLocaleString()
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000
): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(id)
  }
}

export async function getLiveRates(): Promise<Record<string, number>> {
  try {
    const ratesResponse = await fetchWithTimeout(
      "https://open.er-api.com/v6/latest/USD",
      {},
      15000
    )
    if (ratesResponse.ok) {
      const ratesData = await ratesResponse.json()
      return ratesData.rates || {}
    }
  } catch (e) {
    console.warn("Failed to fetch live exchange rates:", e)
  }
  return {}
}

export async function getCountriesFromApi(): Promise<Country[]> {
  try {
    // 1. Fetch live exchange rates from Open Exchange Rates API
    const rates = await getLiveRates()

    // 2. Fetch countries from REST Countries API
    // Requesting specific fields to minimize payload size and improve speed
    const fields =
      "name,cca3,flag,flags,capital,population,currencies,region,subregion,borders"
    const countriesResponse = await fetchWithTimeout(
      `https://restcountries.com/v3.1/all?fields=${fields}`,
      {},
      15000
    )

    if (!countriesResponse.ok) {
      throw new Error(
        `REST Countries API responded with status ${countriesResponse.status}`
      )
    }

    const rawCountries = await countriesResponse.json()
    if (!Array.isArray(rawCountries) || rawCountries.length === 0) {
      throw new Error("Invalid response format from REST Countries API")
    }

    // Create a lookup map for static countries for metadata matching
    const staticMap = new Map<string, Country>()
    for (const c of staticCountries) {
      staticMap.set(c.id, c)
    }

    // Create a lookup map of cca3 to country slugs for resolving related countries (borders)
    const cca3ToIdMap = new Map<string, string>()
    for (const raw of rawCountries) {
      if (raw.name?.common) {
        cca3ToIdMap.set(raw.cca3, slugify(raw.name.common))
      }
    }

    const mappedCountries: Country[] = rawCountries.map((raw) => {
      const name = raw.name?.common || ""
      const id = slugify(name)
      const staticCountry = staticMap.get(id)

      const flag = raw.flag || staticCountry?.flag || "🏳️"
      const capital = raw.capital?.[0] || staticCountry?.capital || "N/A"
      const population = raw.population
        ? formatPopulation(raw.population)
        : staticCountry?.population || "0"

      // Extract currency information
      let currencyCode = ""
      let currencyName = ""
      let currencySymbol = ""

      if (raw.currencies && typeof raw.currencies === "object") {
        const codes = Object.keys(raw.currencies)
        if (codes.length > 0) {
          currencyCode = codes[0]
          const curObj = raw.currencies[currencyCode]
          currencyName = curObj.name || ""
          currencySymbol = curObj.symbol || currencyCode
        }
      }

      if (!currencyCode && staticCountry) {
        currencyCode = staticCountry.currencyCode
        currencyName = staticCountry.currencyName
        currencySymbol = staticCountry.currencySymbol
      }

      // Resolve live exchange rate (base is USD)
      let usdRate = 1.0
      if (currencyCode) {
        const rate = rates[currencyCode.toUpperCase()]
        if (typeof rate === "number") {
          usdRate = Number(rate.toFixed(4))
        } else if (staticCountry) {
          usdRate = staticCountry.usdRate
        }
      }

      // Map related countries: borders first, then other countries in the same region
      const relatedCountries: string[] = []
      if (raw.borders && Array.isArray(raw.borders)) {
        for (const border of raw.borders) {
          const mappedId = cca3ToIdMap.get(border)
          if (mappedId) {
            relatedCountries.push(mappedId)
          }
        }
      }

      if (relatedCountries.length < 4) {
        const region = raw.region || staticCountry?.region || ""
        const sameRegion = rawCountries
          .filter(
            (other) =>
              other.region === region &&
              other.cca3 !== raw.cca3 &&
              !relatedCountries.includes(cca3ToIdMap.get(other.cca3) || "")
          )
          .slice(0, 4 - relatedCountries.length)

        for (const other of sameRegion) {
          const mappedId = cca3ToIdMap.get(other.cca3)
          if (mappedId) {
            relatedCountries.push(mappedId)
          }
        }
      }

      // Merge and construct detailed metadata
      const description =
        staticCountry?.description ||
        `${name} is a sovereign country situated in the ${raw.region || "world"} region. It has a capital city of ${capital}, a population of approximately ${population}, and uses the ${currencyName || "local currency"} (${currencyCode || "N/A"}) as its legal tender.`

      const region = raw.region || staticCountry?.region || "Unknown"
      const purchasingPowerIndex = staticCountry?.purchasingPowerIndex ?? 50.0
      const inflationRate = staticCountry?.inflationRate ?? 3.0

      return {
        id,
        name,
        flag,
        capital,
        population,
        currencyCode: currencyCode || "N/A",
        currencyName: currencyName || "N/A",
        currencySymbol: currencySymbol || "",
        usdRate,
        relatedCountries: relatedCountries.slice(0, 4),
        description,
        region,
        purchasingPowerIndex,
        inflationRate,
      }
    })

    // Sort alphabetically by name
    return mappedCountries.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error(
      "Failed to fetch dynamic country details, using static data:",
      error
    )
    return staticCountries
  }
}
