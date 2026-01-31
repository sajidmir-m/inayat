import Hero from "@/components/home/Hero"
import SearchWidget from "@/components/home/SearchWidget"
import FeaturedPackages from "@/components/home/FeaturedPackages"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Testimonials from "@/components/home/Testimonials"
import Association from "@/components/home/Association"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <SearchWidget />
      <FeaturedPackages />
      <WhyChooseUs />
      <Testimonials />
      <Association />
    </div>
  )
}
