import Image from "next/image";
import { Gem, Sparkles, Truck } from "lucide-react";

const PILLARS = [
  {
    icon: Gem,
    title: "Class",
    body: "Thoughtful direction and a calm presence, so you can enjoy your moment while we capture it.",
  },
  {
    icon: Sparkles,
    title: "Style",
    body: "Clean, rich edits with true-to-life skin tones and a timeless, editorial finish.",
  },
  {
    icon: Truck,
    title: "Elegance",
    body: "From church aisles and kitchen parties to relaxed sessions in our studio — wherever your story unfolds.",
  },
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] w-4/5 overflow-hidden rounded-3xl shadow-2xl shadow-plum-900/20">
            <Image
              src="/images/wedding-bride-car.jpg"
              alt="Bride seated in the wedding car holding calla lilies"
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 right-0 aspect-[3/4] w-1/2 overflow-hidden rounded-3xl border-8 border-white shadow-2xl shadow-plum-900/20">
            <Image
              src="/images/graduate-smile.jpg"
              alt="Smiling graduate in her academic sash"
              fill
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -left-3 top-8 rounded-2xl bg-plum-700 px-5 py-4 text-white shadow-xl sm:-left-6">
            <p className="font-serif text-3xl leading-none text-white">2026</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-plum-100">Price Guide</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-plum-600">About Us</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal sm:text-4xl md:text-5xl">
            Clean work. <span className="italic text-plum-600">Every single time.</span>
          </h2>
          <div className="mt-5 h-px w-16 bg-plum-600" />
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            The Creatives zm is a Lusaka-based photography team capturing weddings, traditional ceremonies like
            Chilanga Mulilo and kitchen parties, graduations, birthdays and portraits. Our promise is simple:{" "}
            <em className="font-serif text-plum-700">if the work isn&apos;t clean, then it wasn&apos;t our work.</em>
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="group">
                <span className="grid size-11 place-items-center rounded-2xl bg-plum-50 text-plum-600 transition-colors group-hover:bg-plum-600 group-hover:text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-xl text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
