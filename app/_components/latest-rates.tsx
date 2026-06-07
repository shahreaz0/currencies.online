import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { getCachedExchangeRates } from "@/lib/data-cache"
import { cn } from "@/lib/utils"

export async function LatestRates() {
  const exchangeRatesMatrix = await getCachedExchangeRates()
  // Show a curated selection: first 12 entries gives USD→X pairs + some reverse
  const rates = exchangeRatesMatrix.slice(0, 12)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h2 className="flex items-center gap-2 font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            Latest Exchange Rates
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Live interbank currency rates versus the US Dollar. Select a pair to
            view daily trend percentages and deep-dive historical records.
          </p>
        </div>
        <Link
          href="/exchange-rates"
          className="group mt-4 inline-flex items-center gap-1.5 font-semibold text-primary text-sm transition-colors hover:text-primary/80 md:mt-0"
        >
          <span>All Exchange Rates</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Rates Table / List */}
      <div className="overflow-hidden rounded-none border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-muted-foreground text-sm">
            <thead>
              <tr className="border-border border-b bg-muted/30 font-medium text-foreground">
                <th className="px-6 py-4">Currency Pair</th>
                <th className="px-6 py-4">Live Rate</th>
                <th className="px-6 py-4">Daily Change</th>
                <th className="hidden px-6 py-4 sm:table-cell">
                  Weekly Change
                </th>
                <th className="hidden px-6 py-4 md:table-cell">
                  Monthly Change
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {rates.map((rate) => {
                const pairSlug = `${rate.from.toLowerCase()}-to-${rate.to.toLowerCase()}`
                const isDailyUp = rate.dailyChange >= 0
                const isWeeklyUp = rate.weeklyChange >= 0
                const isMonthlyUp = rate.monthlyChange >= 0

                return (
                  <tr
                    key={pairSlug}
                    className="group transition-colors duration-150 hover:bg-accent/25"
                  >
                    {/* Pair */}
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span>{rate.from}</span>
                        <span className="text-muted-foreground/50">/</span>
                        <span className="text-primary">{rate.to}</span>
                      </div>
                    </td>

                    {/* Rate */}
                    <td className="px-6 py-4 font-bold font-mono text-foreground">
                      {rate.rate.toFixed(4)}
                    </td>

                    {/* Daily Change */}
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs",
                          isDailyUp
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-destructive/10 text-destructive"
                        )}
                      >
                        {isDailyUp ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {isDailyUp ? "+" : ""}
                        {rate.dailyChange}%
                      </span>
                    </td>

                    {/* Weekly Change */}
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium text-xs",
                          isWeeklyUp ? "text-emerald-500" : "text-destructive"
                        )}
                      >
                        {isWeeklyUp ? "+" : ""}
                        {rate.weeklyChange}%
                      </span>
                    </td>

                    {/* Monthly Change */}
                    <td className="hidden px-6 py-4 md:table-cell">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium text-xs",
                          isMonthlyUp ? "text-emerald-500" : "text-destructive"
                        )}
                      >
                        {isMonthlyUp ? "+" : ""}
                        {rate.monthlyChange}%
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/exchange-rates/${pairSlug}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary text-xs group-hover:underline"
                      >
                        <span>Analyze</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
