import { About } from "@/components/about";
import { BookingProvider } from "@/components/booking-context";
import { Calculator } from "@/components/calculator";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Portfolio } from "@/components/portfolio";
import { Services } from "@/components/services";
import { Terms } from "@/components/terms";

export default function Home() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Calculator />
        <Terms />
      </main>
      <Contact />
    </BookingProvider>
  );
}
