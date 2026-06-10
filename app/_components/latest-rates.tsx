import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { generateHistory } from "@/lib/data"
import { getCachedExchangeRates } from "@/lib/data-cache"
import { cn } from "@/lib/utils"

function getFlagByCode(code: string) {
  if (code === "USD") return "🇺🇸"
  if (code === "EUR") return "🇪🇺"
  if (code === "JPY") return "🇯🇵"
  if (code === "GBP") return "🇬🇧"
  if (code === "INR") return "🇮🇳"
  return "🏳️"
}

// Sparkline component that draws an inline SVG path with gradient filling
function Sparkline({
  rate,
  isUp,
  from,
  to,
}: {
  rate: number
  isUp: boolean
  from: string
  to: string
}) {
  const history = generateHistory(rate, 30)
  const rates = history.map((h) => h.rate)
  const min = Math.min(...rates)
  const max = Math.max(...rates)
  const range = max - min || 1

  const width = 120
  const height = 35
  const padding = 2

  const points = rates.map((r, i) => {
    const x = (i / (rates.length - 1)) * width
    const y = padding + (height - 2 * padding) * (1 - (r - min) / range)
    return { x, y }
  })

  const pathD = `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`
  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`

  const strokeColor = isUp ? "#10b981" : "#ef4444"
  const gradientId = `sparkline-grad-${from.toLowerCase()}-${to.toLowerCase()}`

  return (
    <svg className="h-[35px] w-[120px]" viewBox={`0 0 ${width} ${height}`}>
      <title>Sparkline rate trend</title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.00" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export async function LatestRates() {
  const exchangeRatesMatrix = await getCachedExchangeRates()

  const targetPairs = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "JPY" },
    { from: "USD", to: "GBP" },
    { from: "USD", to: "INR" },
    { from: "EUR", to: "USD" },
    { from: "GBP", to: "USD" },
  ]

  const rates = targetPairs
    .map((pair) =>
      exchangeRatesMatrix.find((r) => r.from === pair.from && r.to === pair.to)
    )
    .filter((r): r is NonNullable<typeof r> => !!r)

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-end">
        <div>
          <h2 className="flex items-center gap-2 font-bold font-heading text-2xl text-foreground tracking-tight sm:text-3xl">
            Live Exchange Rates
            {/* Blinking Live indicator */}
            <span className="relative ml-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Real-time exchange rates updated every second
          </p>
        </div>
        <Link
          href="/exchange-rates"
          className="group mt-4 inline-flex items-center gap-1.5 font-bold text-primary text-xs uppercase tracking-wider sm:mt-0"
        >
          <span>View all rates</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {rates.map((rate) => {
          const pairSlug = `${rate.from.toLowerCase()}-to-${rate.to.toLowerCase()}`
          const isUp = rate.dailyChange >= 0
          const fromFlag = getFlagByCode(rate.from)
          const toFlag = getFlagByCode(rate.to)

          return (
            <Link
              key={pairSlug}
              href={`/exchange-rates/${pairSlug}`}
              className="group block"
            >
              <Card className="h-full border border-border bg-card/40 transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-md">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-4">
                  {/* Pair Title & Flags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="select-none text-sm">{fromFlag}</span>
                      <span className="font-bold text-muted-foreground/80 text-xs transition-colors group-hover:text-primary">
                        {rate.from}
                      </span>
                      <span className="text-muted-foreground/30 text-xs">
                        /
                      </span>
                      <span className="font-bold text-muted-foreground/80 text-xs transition-colors group-hover:text-primary">
                        {rate.to}
                      </span>
                      <span className="select-none text-sm">{toFlag}</span>
                    </div>
                  </div>

                  {/* Rate Value */}
                  <div className="space-y-1">
                    <div className="font-extrabold font-mono text-foreground text-lg leading-none tracking-tight">
                      {rate.rate.toFixed(4)}
                    </div>
                    {/* Daily Change */}
                    <div
                      className={cn(
                        "flex items-center gap-0.5 font-bold text-[10px] uppercase",
                        isUp ? "text-emerald-500" : "text-destructive"
                      )}
                    >
                      {isUp ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {isUp ? "+" : ""}
                        {rate.dailyChange}%
                      </span>
                    </div>
                  </div>

                  {/* SVG Sparkline */}
                  <div className="flex justify-center pt-2">
                    <Sparkline
                      rate={rate.rate}
                      isUp={isUp}
                      from={rate.from}
                      to={rate.to}
                    />
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
