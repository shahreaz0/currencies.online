import { ArrowRight, Coins } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { countries, currencies } from "@/lib/data"

export default function PopularCurrencies() {
  // Get top currencies from our list to make a gorgeous grid
  const popularList = currencies.slice(0, 30)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h2 className="flex items-center gap-2 font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            <Coins className="h-6 w-6 text-primary" />
            Popular Currencies
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Browse through the most highly traded currencies. Select any
            currency to view real-time historical trends, using countries, and
            converter integrations.
          </p>
        </div>
        <Link
          href="/currencies"
          className="group mt-4 inline-flex items-center gap-1.5 font-semibold text-primary text-sm transition-colors hover:text-primary/80 md:mt-0"
        >
          <span>View All Currencies</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popularList.map((currency) => {
          // Find country flag using the currency association
          const firstCountry = countries.find(
            (c) => c.currencyCode === currency.code
          )
          const flag = firstCountry ? firstCountry.flag : "🏳️"

          return (
            <Link
              key={currency.id}
              href={`/currency/${currency.id}`}
              className="group block"
            >
              <Card className="h-full border border-border transition-all duration-300 hover:border-primary/20 hover:bg-accent/30 hover:shadow-md">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  {/* Top Row: Name, Flag, Code */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-3xl leading-none"
                        role="img"
                        aria-label="Flag"
                      >
                        {flag}
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                          {currency.name}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          Official Currency
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-none bg-muted px-2.5 py-1 font-bold font-mono text-muted-foreground text-xs transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {currency.code}
                    </span>
                  </div>

                  {/* Mid Row: Info */}
                  <p className="line-clamp-2 text-muted-foreground/80 text-xs">
                    {currency.overview}
                  </p>

                  {/* Bottom Row: Exchange rate vs USD */}
                  <div className="flex items-center justify-between border-border border-t pt-3">
                    <div className="text-muted-foreground text-xs">
                      Value vs USD
                    </div>
                    <div className="font-bold font-mono text-foreground text-sm">
                      1 USD ={" "}
                      <span className="text-primary">{currency.usdRate}</span>{" "}
                      {currency.code}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
