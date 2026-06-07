import { CheckCircle, HelpCircle, Shield, Sparkles } from "lucide-react"
import { Adsense } from "@/app/_components/adsense"
import { CurrencyRankings } from "@/app/_components/currency-rankings"
import { Hero } from "@/app/_components/hero"
import { LatestRates } from "@/app/_components/latest-rates"
import { PopularCurrencies } from "@/app/_components/popular-currencies"
import { getCachedCountries, getCachedCurrencies } from "@/lib/data-cache"

export default async function Home() {
  const [countries, currencies] = await Promise.all([
    getCachedCountries(),
    getCachedCurrencies(),
  ])

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* 1. Hero Search Area */}
      <Hero initialCountries={countries} initialCurrencies={currencies} />

      {/* 2. Adsense Block (Immediately below search area) */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Adsense slot="home-top-banner" format="horizontal" />
      </div>

      {/* 3. Popular Currency Section */}
      <PopularCurrencies />

      {/* 4. Latest Exchange Rates Section */}
      <LatestRates />

      {/* 5. Currency Rankings Section */}
      <CurrencyRankings />

      {/* 6. Marketing/SEO Pitch & Trust badges */}
      <section className="border-border border-t border-b bg-muted/40 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              Information Engine
            </span>
            <h2 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
              The World's Currency Directory & Exchange Rate Database
            </h2>
            <p className="mt-4 text-muted-foreground">
              Currencies.online delivers comprehensive economic data covering
              over 195+ countries. Access precise codes, official symbols, and
              accurate cross-currency rates instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-none border border-border bg-card p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">
                Statically Automated
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Built with static databases to serve pages under 50ms while
                keeping currency records and country relationships fully
                verified.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-none border border-border bg-card p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">
                Double-Indexed Structure
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Dedicated directories for both Countries and Currencies. Ideal
                for resolving complex user search intents.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-none border border-border bg-card p-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">
                Rich Historical Charts
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Interactive charts detail currency fluctuations over the last 30
                days, showing historical swings in clean line formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Adsense Bottom Spot */}
      <div className="container mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Adsense slot="home-bottom-banner" format="horizontal" />
      </div>
    </div>
  )
}
