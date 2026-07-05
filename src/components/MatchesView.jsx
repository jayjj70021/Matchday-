import { useState } from "react";
import { Users, MapPin, Plus, X } from "lucide-react";
import { pitches, sports } from "../data/mockData.js";

function groundFor(groundId) {
  return pitches.find((p) => p.id === groundId);
}

function MatchCard({ match, joined, onToggleJoin }) {
  const ground = groundFor(match.groundId);
  const full = match.spotsFilled >= match.spotsTotal && !joined;
  const pct = Math.min(100, Math.round((match.spotsFilled / match.spotsTotal) * 100));

  return (
    <div className="rounded-2xl border border-chalk/10 bg-turf p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-night px-3 py-1 text-xs uppercase tracking-wide text-flare">
            {match.sport}
          </span>
          <h3 className="mt-3 font-display text-2xl uppercase leading-none text-chalk">
            {ground ? ground.name : "Unknown ground"}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-fade">
            <MapPin size={14} />
            {ground ? ground.neighborhood : ""} &middot; {match.time}
          </p>
        </div>
        <button
          type="button"
          disabled={full}
          onClick={() => onToggleJoin(match.id)}
          className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
            joined
              ? "border border-lime text-lime"
              : full
                ? "cursor-not-allowed border border-chalk/10 text-fade"
                : "bg-lime text-night hover:bg-chalk"
          }`}
        >
          {joined ? "Joined ✓" : full ? "Full" : "Join"}
        </button>
      </div>

      <p className="mt-4 text-sm text-fade">{match.note}</p>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs uppercase tracking-wide text-fade">
          <span className="flex items-center gap-1.5">
            <Users size={13} />
            {match.spotsFilled + (joined ? 1 : 0)}/{match.spotsTotal} filled
          </span>
          <span>{match.skill}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-night">
          <div
            className="h-full rounded-full bg-lime transition-all duration-300"
            style={{ width: `${joined ? Math.min(100, pct + Math.round(100 / match.spotsTotal)) : pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function NewMatchForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    sport: sports[0],
    groundId: pitches[0].id,
    time: "",
    spots: 10,
    note: "",
  });
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!form.time.trim()) nextErrors.time = "Add a day and kickoff time.";
    if (!form.spots || Number(form.spots) < 2) nextErrors.spots = "Needs at least 2 spots.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onAdd({
      id: `m-${Date.now()}`,
      sport: form.sport,
      groundId: form.groundId,
      organizer: "You",
      time: form.time.trim(),
      skill: "Open to all",
      spotsTotal: Number(form.spots),
      spotsFilled: 1,
      note: form.note.trim() || "No notes yet — first one there sets the tone.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl border border-lime/30 bg-turf p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl uppercase text-chalk">Call a game</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-fade transition-colors hover:text-chalk"
          aria-label="Close form"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-wide text-fade">
          Sport
          <select
            value={form.sport}
            onChange={(e) => update("sport", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-chalk/15 bg-night px-3 py-2 text-sm text-chalk focus:border-lime focus:outline-none"
          >
            {sports.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs uppercase tracking-wide text-fade">
          Ground
          <select
            value={form.groundId}
            onChange={(e) => update("groundId", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-chalk/15 bg-night px-3 py-2 text-sm text-chalk focus:border-lime focus:outline-none"
          >
            {pitches.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs uppercase tracking-wide text-fade">
          When
          <input
            type="text"
            placeholder="e.g. Fri, 7:00pm"
            value={form.time}
            onChange={(e) => update("time", e.target.value)}
            className={`mt-1.5 w-full rounded-lg border bg-night px-3 py-2 text-sm text-chalk focus:outline-none ${
              errors.time ? "border-flare" : "border-chalk/15 focus:border-lime"
            }`}
          />
          {errors.time && <span className="mt-1 block normal-case tracking-normal text-flare">{errors.time}</span>}
        </label>

        <label className="block text-xs uppercase tracking-wide text-fade">
          Total spots
          <input
            type="number"
            min="2"
            value={form.spots}
            onChange={(e) => update("spots", e.target.value)}
            className={`mt-1.5 w-full rounded-lg border bg-night px-3 py-2 text-sm text-chalk focus:outline-none ${
              errors.spots ? "border-flare" : "border-chalk/15 focus:border-lime"
            }`}
          />
          {errors.spots && <span className="mt-1 block normal-case tracking-normal text-flare">{errors.spots}</span>}
        </label>

        <label className="block text-xs uppercase tracking-wide text-fade sm:col-span-2">
          Note
          <textarea
            rows="2"
            placeholder="Anything people should know before they show up?"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            className="mt-1.5 w-full resize-none rounded-lg border border-chalk/15 bg-night px-3 py-2 text-sm text-chalk focus:border-lime focus:outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 rounded-full bg-lime px-6 py-2 text-xs font-semibold uppercase tracking-wide text-night transition-colors hover:bg-chalk"
      >
        Post match
      </button>
    </form>
  );
}

export default function MatchesView({ matches, joinedIds, onToggleJoin, onAddMatch }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl uppercase text-chalk">Open matches</h2>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full border border-chalk/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-chalk transition-colors hover:border-lime hover:text-lime"
          >
            <Plus size={14} />
            Call a game
          </button>
        )}
      </div>

      {showForm && (
        <NewMatchForm
          onAdd={(match) => {
            onAddMatch(match);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-chalk/15 p-12 text-center text-fade">
          No matches on the board yet. Be the first to call one.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              joined={joinedIds.includes(match.id)}
              onToggleJoin={onToggleJoin}
            />
          ))}
        </div>
      )}
    </section>
  );
}
