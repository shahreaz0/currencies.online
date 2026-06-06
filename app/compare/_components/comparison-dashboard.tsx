"use client"

import {
  ArrowLeftRight,
  Coins,
  Globe,
  Info,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { countries, currencies, exchangeRatesMatrix } from "@/lib/data"

export default function ComparisonDashboard() {
  const [tab, setTab] = useQueryState(
    "type",
    parseAsString.withDefault("currencies")
  )
  const [c1Param, setC1Param] = useQueryState("c1")
  const [c2Param, setC2Param] = useQueryState("c2")

  // 1. Currency vs Currency Selection
  const activeCurr1 = useMemo(() => {
    if (!c1Param) return currencies[0].code
    const found = currencies.find(
      (c) =>
        c.code.toLowerCase() === c1Param.toLowerCase() ||
        c.id.toLowerCase() === c1Param.toLowerCase()
    )
    return found ? found.code : currencies[0].code
  }, [c1Param])

  const activeCurr2 = useMemo(() => {
    if (!c2Param) return currencies[1].code
    const found = currencies.find(
      (c) =>
        c.code.toLowerCase() === c2Param.toLowerCase() ||
        c.id.toLowerCase() === c2Param.toLowerCase()
    )
    return found ? found.code : currencies[1].code
  }, [c2Param])

  // 2. Country vs Country Selection
  const activeCountry1 = useMemo(() => {
    if (!c1Param) return countries[0].id
    const found = countries.find((c) => c.id === c1Param)
    return found ? found.id : countries[0].id
  }, [c1Param])

  const activeCountry2 = useMemo(() => {
    if (!c2Param) return countries[1].id
    const found = countries.find((c) => c.id === c2Param)
    return found ? found.id : countries[1].id
  }, [c2Param])

  // 3. Exchange Rate vs Exchange Rate Selection
  const activeRate1 = useMemo(() => {
    if (!c1Param) return "USD-to-EUR"
    const found = exchangeRatesMatrix.find(
      (r) => `${r.from}-to-${r.to}` === c1Param
    )
    return found ? `${found.from}-to-${found.to}` : "USD-to-EUR"
  }, [c1Param])

  const activeRate2 = useMemo(() => {
    if (!c2Param) return "USD-to-JPY"
    const found = exchangeRatesMatrix.find(
      (r) => `${r.from}-to-${r.to}` === c2Param
    )
    return found ? `${found.from}-to-${found.to}` : "USD-to-JPY"
  }, [c2Param])

  // Fetch selections for rendering
  const c1Data = useMemo(
    () => currencies.find((c) => c.code === activeCurr1) || currencies[0],
    [activeCurr1]
  )
  const c2Data = useMemo(
    () => currencies.find((c) => c.code === activeCurr2) || currencies[1],
    [activeCurr2]
  )

  const co1Data = useMemo(
    () => countries.find((c) => c.id === activeCountry1) || countries[0],
    [activeCountry1]
  )
  const co2Data = useMemo(
    () => countries.find((c) => c.id === activeCountry2) || countries[1],
    [activeCountry2]
  )

  const rateComparison = useMemo(() => {
    const r1 =
      exchangeRatesMatrix.find((r) => `${r.from}-to-${r.to}` === activeRate1) ||
      exchangeRatesMatrix[0]
    const r2 =
      exchangeRatesMatrix.find((r) => `${r.from}-to-${r.to}` === activeRate2) ||
      exchangeRatesMatrix[1]
    return { r1, r2 }
  }, [activeRate1, activeRate2])

  // Rank currencies by Strength (lowest inflation combined with highest purchasing power)
  const strengthRankings = useMemo(() => {
    return [...countries]
      .sort(
        (a, b) =>
          b.purchasingPowerIndex -
          b.inflationRate -
          (a.purchasingPowerIndex - a.inflationRate)
      )
      .slice(0, 10)
  }, [])

  // Rank currencies by Purchasing Power Index
  const purchasingPowerRankings = useMemo(() => {
    return [...countries]
      .sort((a, b) => b.purchasingPowerIndex - a.purchasingPowerIndex)
      .slice(0, 10)
  }, [])

  const handleCurr1Change = (val: string | null) => {
    if (!val) return
    const found = currencies.find((c) => c.code === val)
    if (found) setC1Param(found.id)
  }

  const handleCurr2Change = (val: string | null) => {
    if (!val) return
    const found = currencies.find((c) => c.code === val)
    if (found) setC2Param(found.id)
  }

  const handleCountry1Change = (val: string | null) => {
    if (val) setC1Param(val)
  }

  const handleCountry2Change = (val: string | null) => {
    if (val) setC2Param(val)
  }

  const handleRate1Change = (val: string | null) => {
    if (val) setC1Param(val)
  }

  const handleRate2Change = (val: string | null) => {
    if (val) setC2Param(val)
  }

  const handleTabChange = (val: string | null) => {
    if (val) {
      setTab(val)
      setC1Param(null)
      setC2Param(null)
    }
  }

  return (
    <div className="space-y-8">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        {/* Navigation Tabs List */}
        <div className="mb-8 flex justify-center">
          <TabsList className="!h-11 !rounded-2xl grid w-full max-w-2xl grid-cols-4 border border-border/40 bg-muted/60 p-1">
            <TabsTrigger
              value="currencies"
              className="!rounded-xl py-2 font-semibold text-xs data-active:bg-background data-active:shadow-sm"
            >
              Currencies
            </TabsTrigger>
            <TabsTrigger
              value="countries"
              className="!rounded-xl py-2 font-semibold text-xs data-active:bg-background data-active:shadow-sm"
            >
              Countries
            </TabsTrigger>
            <TabsTrigger
              value="rates"
              className="!rounded-xl py-2 font-semibold text-xs data-active:bg-background data-active:shadow-sm"
            >
              Rates
            </TabsTrigger>
            <TabsTrigger
              value="strength"
              className="!rounded-xl py-2 font-semibold text-xs data-active:bg-background data-active:shadow-sm"
            >
              Strength & Power
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Currency vs Currency */}
        <TabsContent
          value="currencies"
          className="fade-in-50 animate-in space-y-6 duration-200"
        >
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/40 bg-card p-5 md:flex-row">
            <div className="flex w-full max-w-xs items-center gap-3">
              <Coins className="h-5 w-5 shrink-0 text-primary" />
              <Select value={activeCurr1} onValueChange={handleCurr1Change}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background px-3 font-semibold text-xs">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowLeftRight className="hidden h-5 w-5 text-muted-foreground md:block" />

            <div className="flex w-full max-w-xs items-center gap-3">
              <Coins className="h-5 w-5 shrink-0 text-primary" />
              <Select value={activeCurr2} onValueChange={handleCurr2Change}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background px-3 font-semibold text-xs">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comparison results */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-primary text-sm">
                    {c1Data.code}
                  </span>
                  <h3 className="font-bold text-foreground text-lg">
                    {c1Data.name}
                  </h3>
                </div>
                <div className="divide-y divide-border/20 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Symbol</span>
                    <span className="font-bold font-mono text-foreground">
                      {c1Data.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Value vs USD</span>
                    <span className="font-bold text-foreground">
                      1 USD = {c1Data.usdRate} {c1Data.code}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      USD Equivalent
                    </span>
                    <span className="font-bold text-foreground">
                      1 {c1Data.code} = {(1 / c1Data.usdRate).toFixed(4)} USD
                    </span>
                  </div>
                  <div className="py-2.5">
                    <span className="mb-1 block text-muted-foreground">
                      Brief Description
                    </span>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
                      {c1Data.overview}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-primary text-sm">
                    {c2Data.code}
                  </span>
                  <h3 className="font-bold text-foreground text-lg">
                    {c2Data.name}
                  </h3>
                </div>
                <div className="divide-y divide-border/20 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Symbol</span>
                    <span className="font-bold font-mono text-foreground">
                      {c2Data.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Value vs USD</span>
                    <span className="font-bold text-foreground">
                      1 USD = {c2Data.usdRate} {c2Data.code}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      USD Equivalent
                    </span>
                    <span className="font-bold text-foreground">
                      1 {c2Data.code} = {(1 / c2Data.usdRate).toFixed(4)} USD
                    </span>
                  </div>
                  <div className="py-2.5">
                    <span className="mb-1 block text-muted-foreground">
                      Brief Description
                    </span>
                    <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
                      {c2Data.overview}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Country vs Country */}
        <TabsContent
          value="countries"
          className="fade-in-50 animate-in space-y-6 duration-200"
        >
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/40 bg-card p-5 md:flex-row">
            <div className="flex w-full max-w-xs items-center gap-3">
              <Globe className="h-5 w-5 shrink-0 text-primary" />
              <Select
                value={activeCountry1}
                onValueChange={handleCountry1Change}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background px-3 font-semibold text-xs">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="mr-1">{c.flag}</span> {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowLeftRight className="hidden h-5 w-5 text-muted-foreground md:block" />

            <div className="flex w-full max-w-xs items-center gap-3">
              <Globe className="h-5 w-5 shrink-0 text-primary" />
              <Select
                value={activeCountry2}
                onValueChange={handleCountry2Change}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background px-3 font-semibold text-xs">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="mr-1">{c.flag}</span> {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Country 1 */}
            <Card className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl leading-none">{co1Data.flag}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {co1Data.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {co1Data.region}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-border/20 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Capital City</span>
                    <span className="font-bold text-foreground">
                      {co1Data.capital}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Population</span>
                    <span className="font-bold text-foreground">
                      {co1Data.population}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Official Currency
                    </span>
                    <span className="font-bold text-primary">
                      {co1Data.currencyName} ({co1Data.currencyCode})
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Purchasing Power Index
                    </span>
                    <span className="font-bold font-mono text-foreground">
                      {co1Data.purchasingPowerIndex} / 100
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Inflation Rate
                    </span>
                    <span
                      className={`font-bold font-mono ${co1Data.inflationRate > 5.0 ? "text-destructive" : "text-emerald-500"}`}
                    >
                      {co1Data.inflationRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Country 2 */}
            <Card className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl leading-none">{co2Data.flag}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {co2Data.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {co2Data.region}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-border/20 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Capital City</span>
                    <span className="font-bold text-foreground">
                      {co2Data.capital}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Population</span>
                    <span className="font-bold text-foreground">
                      {co2Data.population}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Official Currency
                    </span>
                    <span className="font-bold text-primary">
                      {co2Data.currencyName} ({co2Data.currencyCode})
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Purchasing Power Index
                    </span>
                    <span className="font-bold font-mono text-foreground">
                      {co2Data.purchasingPowerIndex} / 100
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Inflation Rate
                    </span>
                    <span
                      className={`font-bold font-mono ${co2Data.inflationRate > 5.0 ? "text-destructive" : "text-emerald-500"}`}
                    >
                      {co2Data.inflationRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Exchange Rate vs Exchange Rate */}
        <TabsContent
          value="rates"
          className="fade-in-50 animate-in space-y-6 duration-200"
        >
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/40 bg-card p-5 md:flex-row">
            <div className="flex w-full max-w-xs items-center gap-3">
              <TrendingUp className="h-5 w-5 shrink-0 text-primary" />
              <Select value={activeRate1} onValueChange={handleRate1Change}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background px-3 font-mono font-semibold text-xs">
                  <SelectValue placeholder="Select Pair 1" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {exchangeRatesMatrix.map((r) => (
                    <SelectItem
                      key={`${r.from}-to-${r.to}`}
                      value={`${r.from}-to-${r.to}`}
                    >
                      {r.from} to {r.to}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowLeftRight className="hidden h-5 w-5 text-muted-foreground md:block" />

            <div className="flex w-full max-w-xs items-center gap-3">
              <TrendingUp className="h-5 w-5 shrink-0 text-primary" />
              <Select value={activeRate2} onValueChange={handleRate2Change}>
                <SelectTrigger className="h-11 w-full rounded-xl border-border/60 bg-background px-3 font-mono font-semibold text-xs">
                  <SelectValue placeholder="Select Pair 2" />
                </SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {exchangeRatesMatrix.map((r) => (
                    <SelectItem
                      key={`${r.from}-to-${r.to}`}
                      value={`${r.from}-to-${r.to}`}
                    >
                      {r.from} to {r.to}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Rate 1 */}
            <Card className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardContent className="space-y-4 p-6">
                <h3 className="inline-block rounded-lg bg-primary/10 px-3.5 py-1 font-bold font-mono text-base text-primary">
                  {rateComparison.r1.from} / {rateComparison.r1.to}
                </h3>
                <div className="divide-y divide-border/20 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="font-bold font-mono text-foreground">
                      {rateComparison.r1.rate.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Daily Change</span>
                    <span
                      className={`font-bold font-mono ${rateComparison.r1.dailyChange >= 0 ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {rateComparison.r1.dailyChange}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Weekly Change</span>
                    <span
                      className={`font-bold font-mono ${rateComparison.r1.weeklyChange >= 0 ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {rateComparison.r1.weeklyChange}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Monthly Change
                    </span>
                    <span
                      className={`font-bold font-mono ${rateComparison.r1.monthlyChange >= 0 ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {rateComparison.r1.monthlyChange}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate 2 */}
            <Card className="rounded-2xl border border-border/40 bg-card shadow-sm">
              <CardContent className="space-y-4 p-6">
                <h3 className="inline-block rounded-lg bg-primary/10 px-3.5 py-1 font-bold font-mono text-base text-primary">
                  {rateComparison.r2.from} / {rateComparison.r2.to}
                </h3>
                <div className="divide-y divide-border/20 text-xs">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Exchange Rate</span>
                    <span className="font-bold font-mono text-foreground">
                      {rateComparison.r2.rate.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Daily Change</span>
                    <span
                      className={`font-bold font-mono ${rateComparison.r2.dailyChange >= 0 ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {rateComparison.r2.dailyChange}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Weekly Change</span>
                    <span
                      className={`font-bold font-mono ${rateComparison.r2.weeklyChange >= 0 ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {rateComparison.r2.weeklyChange}%
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">
                      Monthly Change
                    </span>
                    <span
                      className={`font-bold font-mono ${rateComparison.r2.monthlyChange >= 0 ? "text-emerald-500" : "text-destructive"}`}
                    >
                      {rateComparison.r2.monthlyChange}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Currency Strength & Purchasing Power Rankings */}
        <TabsContent
          value="strength"
          className="fade-in-50 animate-in space-y-6 duration-200"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Currency Strength Rankings */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-1.5 font-bold text-muted-foreground text-sm uppercase tracking-wider">
                <Scale className="h-4 w-4 text-primary" />
                Top 10 Strongest Currencies
              </h3>

              <div className="overflow-hidden rounded-xl border border-border/40 bg-card">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-border/40 border-b bg-muted/40 font-bold text-foreground">
                      <th className="p-3">Rank</th>
                      <th className="p-3">Country / Currency</th>
                      <th className="p-3 text-right">Power Index</th>
                      <th className="p-3 text-right">Inflation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 font-mono text-muted-foreground">
                    {strengthRankings.map((country, idx) => (
                      <tr key={country.id} className="hover:bg-accent/20">
                        <td className="p-3 font-bold text-foreground">
                          #{idx + 1}
                        </td>
                        <td className="flex items-center gap-2 p-3 font-sans font-semibold text-foreground">
                          <span>{country.flag}</span>
                          <span>
                            {country.currencyCode} - {country.name}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {country.purchasingPowerIndex}
                        </td>
                        <td className="p-3 text-right text-emerald-500">
                          %{country.inflationRate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Purchasing Power Rankings */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-1.5 font-bold text-muted-foreground text-sm uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-primary" />
                Top 10 Purchasing Power Index
              </h3>

              <div className="overflow-hidden rounded-xl border border-border/40 bg-card">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-border/40 border-b bg-muted/40 font-bold text-foreground">
                      <th className="p-3">Rank</th>
                      <th className="p-3">Country</th>
                      <th className="p-3 text-right">Index Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 font-mono text-muted-foreground">
                    {purchasingPowerRankings.map((country, idx) => (
                      <tr key={country.id} className="hover:bg-accent/20">
                        <td className="p-3 font-bold text-foreground">
                          #{idx + 1}
                        </td>
                        <td className="flex items-center gap-2 p-3 font-sans font-semibold text-foreground">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </td>
                        <td className="p-3 text-right font-bold text-primary">
                          {country.purchasingPowerIndex} / 100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Card className="rounded-xl border border-border/40 bg-muted/20">
            <CardContent className="flex items-start gap-3 p-4">
              <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
              <p className="text-[11px] text-muted-foreground leading-normal">
                <strong>Rankings Definition:</strong> Currency Strength is
                assessed using a compound metric weighing local inflation
                indices and purchasing power ratios relative to the US dollar
                benchmark (100.0 score). Higher indexes imply stronger domestic
                product acquisition capacity per currency unit.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
