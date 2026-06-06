import { notFound } from "next/navigation"
import Adsense from "@/app/_components/adsense"
import RatePairDetail from "./_components/rate-pair-detail"
import { parsePair } from "./utils"

const popularPairs = [
  "usd-to-eur",
  "usd-to-jpy",
  "usd-to-gbp",
  "usd-to-inr",
  "usd-to-cad",
  "eur-to-usd",
  "gbp-to-usd",
  "cad-to-usd",
  "aud-to-usd",
  "jpy-to-usd",
]

// Pre-render popular exchange rate paths
export async function generateStaticParams() {
  return popularPairs.map((pair) => ({
    pair,
  }))
}

// Build SEO Metadata
export async function generateMetadata(
  props: PageProps<"/exchange-rates/[pair]">
) {
  const { pair } = await props.params
  const parsed = parsePair(pair)

  if (!parsed) {
    return {
      title: "Exchange Rate Pair Not Found | Currencies.online",
      description:
        "The requested currency exchange rate pair could not be resolved.",
    }
  }

  const { fromCurrency, toCurrency } = parsed
  const rate = toCurrency.usdRate / fromCurrency.usdRate

  return {
    title: `${fromCurrency.code} to ${toCurrency.code} Exchange Rate - Live Chart | Currencies.online`,
    description: `Analyze ${fromCurrency.name} to ${toCurrency.name} (${fromCurrency.code} to ${toCurrency.code}) conversion rates. View current rate of ${rate.toFixed(4)}, daily percent trends, interactive 30-day line graphs, and conversion lookup tables.`,
  }
}

export default async function ExchangeRatePairPage(
  props: PageProps<"/exchange-rates/[pair]">
) {
  const { pair } = await props.params
  const parsed = parsePair(pair)

  if (!parsed) {
    notFound()
  }

  const { fromCurrency, toCurrency } = parsed
  const rate = toCurrency.usdRate / fromCurrency.usdRate

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="mb-8">
        <Adsense slot="pair-detail-top" format="horizontal" />
      </div>

      {/* Main Details and Widgets */}
      <RatePairDetail
        fromCode={fromCurrency.code}
        toCode={toCurrency.code}
        fromName={fromCurrency.name}
        toName={toCurrency.name}
        rate={rate}
      />

      {/* Bottom Banner */}
      <div className="mt-12">
        <Adsense slot="pair-detail-bottom" format="horizontal" />
      </div>
    </div>
  )
}
