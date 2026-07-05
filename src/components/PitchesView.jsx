import { MapPin, Zap, Clock } from "lucide-react";
import { pitches } from "../data/mockData.js";

function PitchCard({ pitch, featured }) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-chalk/10 bg-turf p-6 transition-transform duration-300 hover:-translate-y-1 ${
        featured ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-0"
        aria-hidden="true"
      />
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-night px-3 py-1 text-xs uppercase tracking-wide text-fade">
            {pitch.format}
          </span>
          {pitch.floodlit && (
            <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-lime">
              <Zap size={12} strokeWidth={2.5} />
              Floodlit
            </span>
          )}
        </div>
        <h3
          className={`font-display uppercase leading-none text-chalk ${featured ? "text-4xl" : "text-2xl"}`}
        >
          {pitch.name}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-fade">
          <MapPin size={14} />
          {pitch.neighborhood} &middot; {pitch.distanceMi} mi away
        </p>
        <p className="mt-1 text-sm text-fade">{pitch.surface}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-chalk/10 pt-4">
        <span className="flex items-center gap-1.5 text-sm text-fade">
          <Clock size={14} />
          &pound;{pitch.pricePerHour}/hr
        </span>
        <button
          type="button"
          className="rounded-full border border-chalk/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-chalk transition-colors hover:border-lime hover:text-lime"
        >
          View slot
        </button>
      </div>
    </div>
  );
}

export default function PitchesView() {
  const [featured, ...rest] = pitches;
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl uppercase text-chalk">
          Nearby pitches
        </h2>
        <span className="text-sm text-fade">{pitches.length} within 5 miles</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PitchCard pitch={featured} featured />
        {rest.map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))}
      </div>
    </section>
  );
}
