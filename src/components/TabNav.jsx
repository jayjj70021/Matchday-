const TABS = [
  { id: "pitches", label: "Pitches" },
  { id: "matches", label: "Matches" },
  { id: "chat", label: "Chat" },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="mx-auto flex max-w-5xl gap-2 px-6">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
              isActive
                ? "bg-lime text-night"
                : "text-fade hover:text-chalk"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
