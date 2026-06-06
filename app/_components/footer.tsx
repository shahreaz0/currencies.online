import { Activity, Coins, DollarSign, Globe, Heart } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative border-border border-t bg-card/50 text-card-foreground">
      {/* Visual top border line */}
      <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:gap-12">
          {/* Column 1: Popular Countries */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm uppercase tracking-wider">
              <Globe className="h-4 w-4 text-primary" />
              Popular Countries
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "Japan Currency", href: "/country/japan" },
                { name: "India Currency", href: "/country/india" },
                { name: "China Currency", href: "/country/china" },
                { name: "Canada Currency", href: "/country/canada" },
                { name: "Mexico Currency", href: "/country/mexico" },
                { name: "Brazil Currency", href: "/country/brazil" },
                { name: "Australia Currency", href: "/country/australia" },
                {
                  name: "United Kingdom Currency",
                  href: "/country/united-kingdom",
                },
                { name: "Germany Currency", href: "/country/germany" },
                { name: "South Korea Currency", href: "/country/south-korea" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors duration-150 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Popular Currencies */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm uppercase tracking-wider">
              <DollarSign className="h-4 w-4 text-primary" />
              Popular Currencies
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "US Dollar (USD)", href: "/currency/us-dollar" },
                { name: "Euro (EUR)", href: "/currency/euro" },
                {
                  name: "British Pound (GBP)",
                  href: "/currency/british-pound",
                },
                { name: "Japanese Yen (JPY)", href: "/currency/japanese-yen" },
                { name: "Indian Rupee (INR)", href: "/currency/indian-rupee" },
                {
                  name: "Canadian Dollar (CAD)",
                  href: "/currency/canadian-dollar",
                },
                {
                  name: "Australian Dollar (AUD)",
                  href: "/currency/australian-dollar",
                },
                { name: "Chinese Yuan (CNY)", href: "/currency/chinese-yuan" },
                { name: "Swiss Franc (CHF)", href: "/currency/swiss-franc" },
                { name: "Mexican Peso (MXN)", href: "/currency/mexican-peso" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors duration-150 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Exchange Rates */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm uppercase tracking-wider">
              <Activity className="h-4 w-4 text-primary" />
              Exchange Rates
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "USD to EUR", href: "/exchange-rates/usd-to-eur" },
                { name: "USD to JPY", href: "/exchange-rates/usd-to-jpy" },
                { name: "USD to GBP", href: "/exchange-rates/usd-to-gbp" },
                { name: "USD to INR", href: "/exchange-rates/usd-to-inr" },
                { name: "USD to CAD", href: "/exchange-rates/usd-to-cad" },
                { name: "EUR to USD", href: "/exchange-rates/eur-to-usd" },
                { name: "GBP to USD", href: "/exchange-rates/gbp-to-usd" },
                { name: "CAD to USD", href: "/exchange-rates/cad-to-usd" },
                { name: "AUD to USD", href: "/exchange-rates/aud-to-usd" },
                { name: "JPY to USD", href: "/exchange-rates/jpy-to-usd" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors duration-150 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company Links */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground text-sm uppercase tracking-wider">
              <Coins className="h-4 w-4 text-primary" />
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Disclaimer", href: "/disclaimer" },
                { name: "Sitemap", href: "/sitemap" },
                { name: "XML Sitemap", href: "/sitemap.xml" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground text-sm transition-colors duration-150 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Brand & copyright bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-border border-t pt-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-none bg-primary/10 text-primary">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-sm">Currencies.online</span>
            <span className="text-muted-foreground text-xs">
              | The World's Currency Directory & Exchange Rate Database
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <span>
              &copy; {new Date().getFullYear()} Currencies.online. All rights
              reserved.
            </span>
            <span className="hidden sm:inline">Made with</span>
            <Heart className="hidden h-3 w-3 fill-red-500 text-red-500 sm:inline" />
            <span className="hidden sm:inline">for global finance.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
