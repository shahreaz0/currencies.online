import { Adsense } from "@/app/_components/adsense"
import { BrowseRegions } from "@/app/_components/browse-regions"
import { FeaturesCards } from "@/app/_components/features-cards"
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
      {/* 1. Hero Search Area & Animated Globe */}
      <Hero initialCountries={countries} initialCurrencies={currencies} />

      {/* 2. Adsense Block (Immediately below search area) */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Adsense slot="home-top-banner" format="horizontal" />
      </div>

      {/* 3. Popular Currency Section */}
      <PopularCurrencies />

      {/* 4. Live Exchange Rates Section */}
      <LatestRates />

      {/* 5. Adsense Bottom Spot */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Adsense slot="home-bottom-banner" format="horizontal" />
      </div>

      {/* 6. Navigation Features Cards */}
      <FeaturesCards />

      {/* 7. Browse Countries by Region Section */}
      <BrowseRegions />
    </div>
  )
}
