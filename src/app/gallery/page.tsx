import type { Metadata } from "next";
import { BookingProvider } from "@/components/booking-context";
import { Contact } from "@/components/contact";
import { Gallery } from "@/components/gallery";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Gallery — The Creatives zm",
  description:
    "Wedding, engagement, bridal shower, traditional ceremony, graduation, birthday and mobile studio photography by The Creatives zm in Lusaka, Zambia.",
};

export default function GalleryPage() {
  return (
    <BookingProvider>
      <Navbar />
      <main>
        <Gallery />
      </main>
      <Contact />
    </BookingProvider>
  );
}
