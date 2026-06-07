import { getCountriesFromApi, getLiveRates } from "./countries-api"
import {
  type Currency,
  currencies as staticCurrencies,
  exchangeRatesMatrix as staticMatrix,
} from "./data"

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export async function getCurrenciesFromApi(): Promise<Currency[]> {
  try {
    const [countries, rates] = await Promise.all([
      getCountriesFromApi(),
      getLiveRates(),
    ])

    // Group countries by currency code
    const currencyMap = new Map<
      string,
      {
        code: string
        name: string
        symbol: string
        countries: { name: string; id: string; flag: string }[]
      }
    >()

    for (const c of countries) {
      if (!c.currencyCode || c.currencyCode === "N/A") continue
      const code = c.currencyCode.toUpperCase()

      if (!currencyMap.has(code)) {
        currencyMap.set(code, {
          code,
          name: c.currencyName || `${code} Currency`,
          symbol: c.currencySymbol || code,
          countries: [],
        })
      }

      const currInfo = currencyMap.get(code)!
      // Avoid duplicate countries in the utilizing list
      if (!currInfo.countries.some((country) => country.id === c.id)) {
        currInfo.countries.push({
          name: c.name,
          id: c.id,
          flag: c.flag,
        })
      }
    }

    // Map of static currencies to merge with manually-curated fields
    const staticMap = new Map<string, Currency>()
    for (const sc of staticCurrencies) {
      staticMap.set(sc.code.toUpperCase(), sc)
    }

    const allCurrencies: Currency[] = []

    for (const [code, info] of currencyMap.entries()) {
      const staticCurr = staticMap.get(code)

      let id = staticCurr?.id || slugify(info.name)
      if (!id) {
        id = code.toLowerCase()
      }
      const name = staticCurr?.name || info.name
      const symbol = staticCurr?.symbol || info.symbol

      let usdRate = staticCurr?.usdRate ?? 1.0
      const liveRate = rates[code]
      if (typeof liveRate === "number") {
        usdRate = Number(liveRate.toFixed(4))
      }

      const usingCountriesNames = info.countries.map((c) => c.name).join(", ")
      const overview =
        staticCurr?.overview ||
        `The ${name} (${code}) is the official currency of ${usingCountriesNames || "its using countries"}. It is represented by the symbol ${symbol} and is managed by the central monetary authority of the issuing region.`

      const faqs = staticCurr?.faqs || [
        {
          question: `Which countries use the ${name} (${code})?`,
          answer: `The ${name} is used as official legal tender in the following countries: ${usingCountriesNames}.`,
        },
        {
          question: `How is the exchange rate of ${name} vs the US Dollar determined?`,
          answer: `The exchange rate is determined by international foreign exchange markets based on supply, demand, inflation, economic health, and interest rate policies of the issuing region.`,
        },
      ]

      allCurrencies.push({
        id,
        name,
        code,
        symbol,
        usdRate,
        overview,
        countries: info.countries,
        faqs,
      })
    }

    // Sort to prioritize featured/major currencies at the top of listings
    const priorityCodes = [
      "USD",
      "EUR",
      "JPY",
      "GBP",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "INR",
      "MXN",
      "BRL",
      "SGD",
      "ZAR",
      "SEK",
      "NOK",
      "DKK",
      "AED",
      "SAR",
      "EGP",
      "NGN",
      "TRY",
      "NZD",
    ]

    return allCurrencies.sort((a, b) => {
      const idxA = priorityCodes.indexOf(a.code.toUpperCase())
      const idxB = priorityCodes.indexOf(b.code.toUpperCase())

      if (idxA !== -1 && idxB !== -1) {
        return idxA - idxB
      }
      if (idxA !== -1) return -1
      if (idxB !== -1) return 1

      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error("Failed to construct dynamic currencies:", error)
    return staticCurrencies
  }
}

export async function getExchangeRatesMatrixFromApi() {
  try {
    const rates = await getLiveRates()

    return staticMatrix.map((pair) => {
      let rate = pair.rate
      const fromRate = rates[pair.from.toUpperCase()]
      const toRate = rates[pair.to.toUpperCase()]

      if (typeof fromRate === "number" && typeof toRate === "number") {
        rate = Number((toRate / fromRate).toFixed(4))
      }
      return {
        ...pair,
        rate,
      }
    })
  } catch (error) {
    console.error(
      "Failed to fetch dynamic exchange rates, using static data:",
      error
    )
    return staticMatrix
  }
}
