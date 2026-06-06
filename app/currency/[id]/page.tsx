import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Adsense from "@/app/_components/adsense"
import { currencies } from "@/lib/data"
import CurrencyDetail from "./_components/currency-detail"

// Pre-render currency routes
export async function generateStaticParams() {
  return currencies.map((c) => ({
    id: c.id,
  }))
}

// Metadata builder
export async function generateMetadata(
  props: PageProps<"/currency/[id]">
): Promise<Metadata> {
  const { id } = await props.params
  const currency = currencies.find((c) => c.id === id)

  if (!currency) {
    return {
      title: "Currency Not Found | Currencies.online",
      description:
        "The requested currency information page could not be located in our database.",
    }
  }

  return {
    title: `${currency.name} (${currency.code}) Overview and Exchange Rates | Currencies.online`,
    description: `Official currency overview for ${currency.name} (${currency.code}). See active symbol (${currency.symbol}), countries using it, live USD conversion rates, 30-day historical chart, and detailed FAQs.`,
  }
}

export default async function CurrencyPage(props: PageProps<"/currency/[id]">) {
  const { id } = await props.params
  const currency = currencies.find((c) => c.id === id)

  if (!currency) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="mb-8">
        <Adsense slot="currency-detail-top" format="horizontal" />
      </div>

      {/* Detail Block */}
      <CurrencyDetail currency={currency} />

      {/* Bottom Banner */}
      <div className="mt-12">
        <Adsense slot="currency-detail-bottom" format="horizontal" />
      </div>
    </div>
  )
}
