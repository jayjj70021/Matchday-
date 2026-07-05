import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { pitches } from "../data/mockData.js";

export default function ChatView({ matches, threads, activeMatchId, onSelectMatch, onSendMessage }) {
  const [draft, setDraft] = useState("");
  const activeMatch = matches.find((m) => m.id === activeMatchId) ?? matches[0];
  const messages = activeMatch ? threads[activeMatch.id] ?? [] : [];

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim() || !activeMatch) return;
    onSendMessage(activeMatch.id, draft.trim());
    setDraft("");
  }

  if (matches.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-dashed border-chalk/15 p-12 text-center text-fade">
          Join a match to unlock its chat.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="mb-6 font-display text-3xl uppercase text-chalk">Match chat</h2>
      <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-2xl border border-chalk/10 sm:grid-cols-[220px_1fr]">
        <aside className="no-scrollbar flex flex-row gap-2 overflow-x-auto border-b border-chalk/10 bg-turf p-3 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r">
          {matches.map((match) => {
            const ground = pitches.find((p) => p.id === match.groundId);
            const isActive = activeMatch && match.id === activeMatch.id;
            return (
              <button
                key={match.id}
                type="button"
                onClick={() => onSelectMatch(match.id)}
                className={`flex shrink-0 flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors sm:shrink ${
                  isActive ? "bg-lime text-night" : "text-fade hover:bg-night"
                }`}
              >
                <span className="text-sm font-semibold">{ground?.name ?? match.sport}</span>
                <span className={`text-xs ${isActive ? "text-night/70" : "text-fade/70"}`}>
                  {match.time}
                </span>
              </button>
            );
          })}
        </aside>

        <div className="flex h-[420px] flex-col bg-pitch">
          <div className="flex items-center gap-2 border-b border-chalk/10 px-5 py-3 text-sm text-fade">
            <MessageCircle size={14} />
            {activeMatch ? pitches.find((p) => p.id === activeMatch.groundId)?.name : ""}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.length === 0 ? (
              <p className="text-sm text-fade">
                No messages yet. Say hello to whoever else is in.
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.self ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      msg.self ? "bg-lime text-night" : "bg-turf text-chalk"
                    }`}
                  >
                    {!msg.self && (
                      <div className="mb-0.5 text-xs font-semibold text-flare">{msg.author}</div>
                    )}
                    {msg.text}
                  </div>
                  <span className="mt-1 text-xs text-fade">{msg.time}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-chalk/10 p-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the group..."
              className="flex-1 rounded-full border border-chalk/15 bg-night px-4 py-2 text-sm text-chalk focus:border-lime focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-night transition-colors hover:bg-chalk"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
