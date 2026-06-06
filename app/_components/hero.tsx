"use client"

import { ArrowRight, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { countries, currencies } from "@/lib/data"

export default function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<
    {
      type: "country" | "currency"
      name: string
      id: string
      flagOrSymbol: string
      code?: string
    }[]
  >([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    const filteredCountries = countries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.currencyCode.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 4)
      .map((c) => ({
        type: "country" as const,
        name: c.name,
        id: c.id,
        flagOrSymbol: c.flag,
        code: c.currencyCode,
      }))

    const filteredCurrencies = currencies
      .filter(
        (curr) =>
          curr.name.toLowerCase().includes(query.toLowerCase()) ||
          curr.code.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 4)
      .map((curr) => ({
        type: "currency" as const,
        name: curr.name,
        id: curr.id,
        flagOrSymbol: curr.symbol,
        code: curr.code,
      }))

    setSuggestions([...filteredCountries, ...filteredCurrencies])
    setIsOpen(true)
  }, [query])

  const handleSelect = (item: (typeof suggestions)[0]) => {
    setQuery("")
    setIsOpen(false)
    if (item.type === "country") {
      router.push(`/country/${item.id}`)
    } else {
      router.push(`/currency/${item.id}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() === "") return

    // Try to find exact match
    const matchedCountry = countries.find(
      (c) =>
        c.name.toLowerCase() === query.toLowerCase().trim() ||
        c.currencyCode.toLowerCase() === query.toLowerCase().trim()
    )
    if (matchedCountry) {
      router.push(`/country/${matchedCountry.id}`)
      return
    }

    const matchedCurrency = currencies.find(
      (curr) =>
        curr.name.toLowerCase() === query.toLowerCase().trim() ||
        curr.code.toLowerCase() === query.toLowerCase().trim()
    )
    if (matchedCurrency) {
      router.push(`/currency/${matchedCurrency.id}`)
      return
    }

    // Default: go to countries list with search parameter
    router.push(`/countries?search=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent px-4 py-20 md:py-28">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute top-12 left-10 -z-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="font-extrabold font-heading text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl">
          Find Any Country's{" "}
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            Currency
          </span>{" "}
          Instantly
        </h1>

        {/* Subheadline */}
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-base text-muted-foreground sm:text-lg">
            Search for a country and instantly see:
          </p>
          <ul className="mt-3 inline-grid grid-cols-2 gap-x-8 gap-y-2 text-left text-muted-foreground text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Official currency</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Currency code</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Currency symbol</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>Current USD exchange rate</span>
            </li>
          </ul>
        </div>

        {/* Search Box */}
        <div ref={containerRef} className="relative mx-auto mt-10 max-w-xl">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter country name (e.g., Japan, Brazil) or code..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                className="h-14 w-full rounded-2xl border border-border/80 bg-background/95 pr-4 pl-12 text-base shadow-lg ring-offset-background transition-all duration-200 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 shrink-0 rounded-2xl px-6 font-semibold shadow-lg shadow-primary/15 transition-all duration-300 hover:shadow-primary/25"
            >
              Search Currency
            </Button>
          </form>

          {/* Suggestions Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div className="fade-in slide-in-from-top-2 absolute right-0 left-0 z-50 mt-2 animate-in rounded-2xl border border-border/50 bg-background/95 p-2 shadow-2xl backdrop-blur-md duration-150">
              <div className="px-3 py-1.5 font-semibold text-muted-foreground/70 text-xs uppercase tracking-wider">
                Suggestions
              </div>
              <div className="mt-1 divide-y divide-border/20">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.type === "country" ? (
                        <span className="text-xl leading-none">
                          {item.flagOrSymbol}
                        </span>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 font-bold text-primary text-xs">
                          {item.flagOrSymbol}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          ({item.code})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-medium text-primary text-xs opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100">
                      <span>View</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Example Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-muted-foreground text-sm">
          <span>Try searching for:</span>
          {["United States", "Japan", "India", "Brazil", "Germany"].map(
            (name) => {
              const countryId = name.toLowerCase().replace(/\s+/g, "-")
              return (
                <button
                  key={name}
                  onClick={() => router.push(`/country/${countryId}`)}
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-card px-3 py-1 font-medium text-foreground text-xs transition-all duration-200 hover:border-primary/40 hover:bg-primary/5"
                >
                  <span>
                    {name === "United States"
                      ? "🇺🇸"
                      : name === "Japan"
                        ? "🇯🇵"
                        : name === "India"
                          ? "🇮🇳"
                          : name === "Brazil"
                            ? "🇧🇷"
                            : "🇩🇪"}
                  </span>
                  <span>{name}</span>
                </button>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}
