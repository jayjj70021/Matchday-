import { useState } from "react";
import Header from "./components/Header.jsx";
import TabNav from "./components/TabNav.jsx";
import PitchesView from "./components/PitchesView.jsx";
import MatchesView from "./components/MatchesView.jsx";
import ChatView from "./components/ChatView.jsx";
import { matches as initialMatches, chatThreads as initialThreads } from "./data/mockData.js";

export default function App() {
  const [tab, setTab] = useState("pitches");
  const [matches, setMatches] = useState(initialMatches);
  const [joinedIds, setJoinedIds] = useState([]);
  const [threads, setThreads] = useState(initialThreads);
  const [activeMatchId, setActiveMatchId] = useState(initialMatches[0]?.id ?? null);

  function toggleJoin(matchId) {
    setJoinedIds((prev) =>
      prev.includes(matchId) ? prev.filter((id) => id !== matchId) : [...prev, matchId],
    );
  }

  function addMatch(match) {
    setMatches((prev) => [match, ...prev]);
    setThreads((prev) => ({ ...prev, [match.id]: [] }));
    setJoinedIds((prev) => [...prev, match.id]);
  }

  function sendMessage(matchId, text) {
    setThreads((prev) => ({
      ...prev,
      [matchId]: [
        ...(prev[matchId] ?? []),
        {
          id: `msg-${(prev[matchId]?.length ?? 0) + 1}-${matchId}`,
          author: "You",
          text,
          time: "Just now",
          self: true,
        },
      ],
    }));
  }

  return (
    <div className="grain min-h-screen bg-night">
      <Header />
      <div className="sticky top-0 z-10 border-b border-chalk/10 bg-night/90 py-4 backdrop-blur">
        <TabNav active={tab} onChange={setTab} />
      </div>

      {tab === "pitches" && <PitchesView />}
      {tab === "matches" && (
        <MatchesView
          matches={matches}
          joinedIds={joinedIds}
          onToggleJoin={toggleJoin}
          onAddMatch={addMatch}
        />
      )}
      {tab === "chat" && (
        <ChatView
          matches={matches}
          threads={threads}
          activeMatchId={activeMatchId}
          onSelectMatch={setActiveMatchId}
          onSendMessage={sendMessage}
        />
      )}

      <footer className="mx-auto max-w-5xl px-6 py-10 text-xs text-fade">
        Matchday is a prototype — everything above lives in this browser tab
        and resets on refresh.
      </footer>
    </div>
  );
}
