import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-chalk/10">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[140%] -translate-x-1/2 rounded-full bg-lime/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-lime">
            <Zap size={14} strokeWidth={2.5} />
            <span>Kickoff in your postcode</span>
          </div>
          <h1 className="font-display text-6xl uppercase leading-[0.85] tracking-tight text-chalk sm:text-7xl">
            Matchday
          </h1>
        </div>
        <p className="max-w-xs text-sm text-fade sm:text-right">
          Find a pitch, fill the last few spots on someone else's game, or
          shout about your own before the lights go on.
        </p>
      </div>
    </header>
  );
}
