"use client"

import { Coins, Globe, MapPin, Search, Users } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Let's import from @/components/ui/input instead.
import { Input as UiInput } from "@/components/ui/input"
import { countries } from "@/lib/data"

interface CountriesListProps {
  initialSearch?: string
}

export default function CountriesList({
  initialSearch = "",
}: CountriesListProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedRegion, setSelectedRegion] = useState<string>("All")

  const regions = useMemo(() => {
    const list = new Set(countries.map((c) => c.region))
    return ["All", ...Array.from(list)]
  }, [])

  const filteredCountries = useMemo(() => {
    return countries.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.currencyName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegion =
        selectedRegion === "All" || c.region === selectedRegion

      return matchesSearch && matchesRegion
    })
  }, [searchTerm, selectedRegion])

  return (
    <div className="space-y-8">
      {/* Search and Filter Controls */}
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-border/40 bg-card p-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <UiInput
            type="text"
            placeholder="Search by country, capital, currency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl border-border/60 bg-background/50 pl-9"
          />
        </div>

        {/* Region Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {regions.map((region) => (
            <Button
              key={region}
              variant={selectedRegion === region ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedRegion(region)}
              className="rounded-xl px-4 py-1.5 font-semibold text-xs"
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredCountries.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map((country) => (
            <Link
              key={country.id}
              href={`/country/${country.id}`}
              className="group block"
            >
              <Card className="h-full rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/20 hover:bg-accent/30 hover:shadow-md">
                <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
                  {/* Top: Flag and Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-4xl leading-none"
                        role="img"
                        aria-label={`Flag of ${country.name}`}
                      >
                        {country.flag}
                      </span>
                      <div>
                        <h3 className="font-bold text-foreground text-lg transition-colors group-hover:text-primary">
                          {country.name}
                        </h3>
                        <span className="mt-0.5 flex items-center gap-1 font-medium text-muted-foreground text-xs">
                          <MapPin className="h-3 w-3" />
                          {country.capital}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mid details */}
                  <div className="grid grid-cols-2 gap-4 border-border/20 border-t border-b py-3 text-xs">
                    <div>
                      <div className="mb-1 flex items-center gap-1 font-medium text-muted-foreground">
                        <Users className="h-3.5 w-3.5 text-muted-foreground/80" />
                        Population
                      </div>
                      <div className="font-semibold text-foreground">
                        {country.population}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-1 font-medium text-muted-foreground">
                        <Coins className="h-3.5 w-3.5 text-muted-foreground/80" />
                        Currency
                      </div>
                      <div className="font-bold text-foreground">
                        {country.currencyCode}{" "}
                        <span className="font-medium text-primary">
                          ({country.currencySymbol})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: rate and link */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-muted-foreground">
                      USD Exchange Rate
                    </span>
                    <span className="font-bold font-mono text-foreground transition-colors group-hover:text-primary">
                      1 USD = {country.usdRate} {country.currencyCode}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/30 bg-card py-20 text-center">
          <Globe className="mb-4 h-12 w-12 animate-bounce text-muted-foreground/40" />
          <h3 className="font-bold text-foreground text-lg">
            No Countries Found
          </h3>
          <p className="mt-2 max-w-sm text-muted-foreground text-sm">
            We couldn't find any country matching your search criteria. Try
            modifying your filters or search terms.
          </p>
        </div>
      )}
    </div>
  )
}
